import {
  CognitoUserPool,
  CognitoUserAttribute,
  CognitoUser,
  AuthenticationDetails,
} from 'amazon-cognito-identity-js';
import { Credentials } from './types';

const poolData = {
  UserPoolId: import.meta.env.VITE_COGNITO_USER_POOL_ID,
  ClientId: import.meta.env.VITE_COGNITO_CLIENT_ID,
};
const userPool = new CognitoUserPool(poolData);

export function registerUser({ email, password }: Credentials) {
  userPool.signUp(email, password, [], [], function (err, result) {
    if (err) {
      alert(err.message || JSON.stringify(err));
      return;
    }
    const cognitoUser = result?.user;
    console.log('user name is ' + cognitoUser?.getUsername());
  });
}

export function loginUser({ email, password }: Credentials) {
  const authenticationData = {
    Username: email,
    Password: password,
  };
  const authenticationDetails = new AuthenticationDetails(authenticationData);

  const userData = {
    Username: email,
    Pool: userPool,
  };
  const cognitoUser = new CognitoUser(userData);
  cognitoUser.authenticateUser(authenticationDetails, {
    onSuccess: function (result) {
      console.log(result);
    },

    onFailure: function (err) {
      alert(err.message || JSON.stringify(err));
    },
  });
}
