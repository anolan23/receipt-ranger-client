import { Amplify } from 'aws-amplify';

Amplify.configure({
  Auth: {
    Cognito: {
      //  Amazon Cognito User Pool ID
      userPoolId: import.meta.env.VITE_COGNITO_USER_POOL_ID,
      // OPTIONAL - Amazon Cognito Web Client ID (26-char alphanumeric string)
      userPoolClientId: import.meta.env.VITE_COGNITO_CLIENT_ID,
      // REQUIRED only for Federated Authentication - Amazon Cognito Identity Pool ID
      identityPoolId: '',
      // OPTIONAL - This is used when autoSignIn is enabled for Auth.signUp
      // 'code' is used for Auth.confirmSignUp, 'link' is used for email link verification
      signUpVerificationMethod: 'code', // 'code' | 'link'
      loginWith: {
        email: true,
        oauth: {
          providers: ['Google'],
          domain: import.meta.env.VITE_COGNITO_DOMAIN,
          scopes: ['email', 'aws.cognito.signin.user.admin'],
          redirectSignIn: [
            'http://localhost:3000/dashboard',
            'https://app.snapceipt.com/dashboard',
          ],
          redirectSignOut: [],
          responseType: 'code',
        },
      },
    },
  },
});
