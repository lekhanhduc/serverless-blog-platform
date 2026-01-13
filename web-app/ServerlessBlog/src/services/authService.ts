import { signIn, signOut, getCurrentUser, fetchAuthSession, confirmSignIn, signUp, confirmSignUp } from 'aws-amplify/auth';

export const authService = {
    async checkUser() {
        try {
            const currentUser = await getCurrentUser();
            const session = await fetchAuthSession();
            const groups = (session.tokens?.idToken?.payload['cognito:groups'] as string[]) || [];
            const name = (session.tokens?.idToken?.payload['name'] as string) || '';

            return {
                ...currentUser,
                name,
                groups,
                idToken: session.tokens?.idToken?.toString()
            };
        } catch {
            return null;
        }
    },

    async login(email: string, pass: string) {
        return await signIn({ username: email, password: pass });
    },

    async confirmChallenge(newPassword: string, name: string) {
        return await confirmSignIn({
            challengeResponse: newPassword,
            options: {
                userAttributes: { name }
            }
        });
    },

    async register(email: string, pass: string, name: string) {
        return await signUp({
            username: email,
            password: pass,
            options: {
                userAttributes: { name }
            }
        });
    },

    async confirmRegistration(email: string, code: string) {
        return await confirmSignUp({
            username: email,
            confirmationCode: code
        });
    },

    async logout() {
        await signOut();
    }
};
