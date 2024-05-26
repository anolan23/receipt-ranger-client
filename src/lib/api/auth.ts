import {
  confirmSignUp,
  signIn,
  signOut,
  signUp,
  resendSignUpCode,
  signInWithRedirect,
  type ConfirmSignUpInput,
  type SignInInput,
  type ResendSignUpCodeInput,
  autoSignIn,
} from 'aws-amplify/auth';
import { Credentials } from '../types';

export async function signUpUser({ password, email }: Credentials) {
  const result = await signUp({
    username: email,
    password,
    options: {
      userAttributes: {},
      // optional
      autoSignIn: true, // or SignInOptions e.g { authFlowType: "USER_SRP_AUTH" }
    },
  });

  return result;
}

export async function confirmUserSignUp({
  username,
  confirmationCode,
}: ConfirmSignUpInput) {
  const result = await confirmSignUp({
    username,
    confirmationCode,
  });
  return result;
}

export async function autoSignInUser() {
  const result = await autoSignIn();
  return result;
}

export async function loginUser({ username, password }: SignInInput) {
  const result = await signIn({ username, password });
  return result;
}

export async function signOutUser() {
  await signOut({ global: true });
}

export async function resendSignUpCodeToEmail({
  username,
}: ResendSignUpCodeInput) {
  const result = await resendSignUpCode({ username });
  return result;
}

export async function googleSignIn() {
  await signInWithRedirect({ provider: 'Google' });
}
