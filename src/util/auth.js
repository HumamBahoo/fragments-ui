import { Amplify, Auth } from 'aws-amplify';

// config our auth object to use our Cognito User Pool
Amplify.configure({
  Auth: {
    region: 'us-east-1',
    userPoolId: process.env.REACT_APP_AWS_COGNITO_POOL_ID,
    userPoolWebClientId: process.env.REACT_APP_AWS_COGNITO_CLIENT_ID,
    oauth: {
      domain: process.env.REACT_APP_AWS_COGNITO_HOSTED_UI_DOMAIN,

      // must match what you set in the User Pool for this App Client
      scope: ['email', 'profile', 'openid'],

      // must match what you have specified in the Hosted UI
      redirectSignIn: process.env.REACT_APP_OAUTH_SIGN_IN_REDIRECT_URL,
      redirectSignOut: process.env.REACT_APP_OAUTH_SIGN_OUT_REDIRECT_URL,

      responseType: 'code',
    },
  },
});

/**
 * Get the Authenticated user
 * @returns Promise<user>
 */
async function getUser() {
  try {
    // Get the user's info, see:
    // https://docs.amplify.aws/lib/auth/advanced/q/platform/js/#identity-pool-federation
    const currentAuthenticatedUser = await Auth.currentAuthenticatedUser();

    // user is authenticated and we have a user object if it didn't throw
    console.log('The user is authenticated');

    // Get the user's Identity Token, which we'll use later with our
    // microservice. See discussion of various tokens:
    // https://docs.aws.amazon.com/cognito/latest/developerguide/amazon-cognito-user-pools-using-tokens-with-identity-providers.html
    const username = currentAuthenticatedUser.username;
    const idToken = currentAuthenticatedUser.signInUserSession.idToken.jwtToken;
    const accessToken = currentAuthenticatedUser.signInUserSession.accessToken.jwtToken;

    const authenticatedUser = {
      username,
      idToken,
      accessToken,
      authorizationHeaders: () => {
        const headers = { 'Content-Type': 'application/json' };
        headers['Authorization'] = `Bearer ${idToken}`;

        return headers;
      },
    };

    return authenticatedUser;
  } catch (err) {
    console.log(err);
    return null;
  }
}

export { Auth, getUser };
