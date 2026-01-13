import { signIn, signOut, getCurrentUser, fetchAuthSession, confirmSignIn } from 'aws-amplify/auth';

const API_BASE_URL = 'https://serverless.javabuilder.online';

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

    async register(email: string, pass: string, username: string) {
        const response = await fetch(`${API_BASE_URL}/users`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password: pass, username })
        });
        
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || 'Đăng ký thất bại');
        }
        return data;
    },

    async logout() {
        await signOut();
    }
};
