import { signIn, type SignInInput, signOut } from 'aws-amplify/auth';

export async function loginUser({ username, password }: SignInInput) {
  try {
    const result = await signIn({ username, password });
    return result;
  } catch (error) {
    console.error('error signing in', error);
  }
}

export async function signOutUser() {
  try {
    await signOut();
  } catch (error) {
    console.error('error signing out: ', error);
  }
}
