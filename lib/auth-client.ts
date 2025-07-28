import { createAuthClient } from "better-auth/react"
import { adminClient } from "better-auth/client/plugins"
import {
	organizationClient,
} from "better-auth/client/plugins";
export const authClient = createAuthClient({
    plugins: [
		organizationClient(),
		adminClient()
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