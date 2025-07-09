import { createAuthClient } from "better-auth/react"
import {
	organizationClient,
} from "better-auth/client/plugins";
export const authClient = createAuthClient({
    plugins: [
		organizationClient(),
	]
})

export const {
	signUp,
	signIn,
	signOut,
	useSession,
	organization,
	useListOrganizations,
	useActiveOrganization,
} = authClient;