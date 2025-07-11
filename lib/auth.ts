import { betterAuth } from "better-auth";
import { openAPI, organization } from "better-auth/plugins"
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { prisma } from '@/lib/prisma';
import { getInvitationEmailContent } from "@/lib/email/invitation";
import { getResetPasswordEmailContent } from "@/lib/email/reset-password";
import { resend } from "@/lib/email/resend";
import { EmailTemplate } from "@daveyplate/better-auth-ui/server"
import { getVerificationEmailContent } from "@/lib/email/verification";

const FROM_EMAIL = process.env.FROM_EMAIL || "delivered@resend.dev";
const SITE_NAME = "MULTIBOARD";
const EMAIL_LINK_BASE_URL = process.env.BETTER_AUTH_URL || "https://www.multiboard.dev";


export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),
    emailAndPassword: {
        enabled: true,
		requireEmailVerification: true,
        async sendResetPassword({ user, url }) {
			const name = user.name || user.email.split("@")[0]
			await resend.emails.send({
				from: FROM_EMAIL,
				to: user.email,
				subject: "Reset your password",
				react: EmailTemplate({
					content: getResetPasswordEmailContent(name),
					heading: "Reset Password",
					imageUrl: `${EMAIL_LINK_BASE_URL}/apple-touch-icon.png`,
					siteName: SITE_NAME,
					baseUrl: EMAIL_LINK_BASE_URL,
					action: "Reset Password",
					url
				}),
			});
		},
    },
    emailVerification: {
        sendVerificationEmail: async ({ user, url }) => {
            const name = user.name || user.email.split("@")[0]
            await resend.emails.send({
                from: FROM_EMAIL,
                to: user.email,
                subject: "Verify your email address",
                react: EmailTemplate({
                    content: getVerificationEmailContent(name),
                    heading: "Verify Email",
					imageUrl: `${EMAIL_LINK_BASE_URL}/apple-touch-icon.png`,
                    siteName: SITE_NAME,
                    baseUrl: EMAIL_LINK_BASE_URL,
                    action: "Verify Email",
                    url
                })
            })
        },
        autoSignInAfterVerification: true,
        sendOnSignUp: true
    },
    plugins: [
        organization({
			async sendInvitationEmail(data) {
				const inviteLink = `${EMAIL_LINK_BASE_URL}/accept-invitation/${data.id}`;
				const invitedByUsername = data.inviter.user.name || data.inviter.user.email.split("@")[0];
				const teamName = data.organization.name;
				await resend.emails.send({
					from: FROM_EMAIL,
					to: data.email,
					subject: "You've been invited to join a team",
					react: EmailTemplate({
						content: getInvitationEmailContent(data.email, invitedByUsername, teamName),
						heading: "Join Team",
						imageUrl: `${EMAIL_LINK_BASE_URL}/apple-touch-icon.png`,
						siteName: SITE_NAME,
						baseUrl: EMAIL_LINK_BASE_URL,
						action: "Join Team",
						url: inviteLink
					}),
				});
			},
		}),
        nextCookies(),
		openAPI({
			disableDefaultReference: true,
		})
    ]
});