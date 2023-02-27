// src/api.js

// fragments microservice API, defaults to localhost:8080
const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8080';

/**
 * Given an authenticated user, request all fragments for this user from the
 * fragments microservice (currently only running locally). We expect a user
 * to have an `idToken` attached, so we can send that along with the request.
 */
module.exports.getUserFragments = async (user) => {
  console.log(`Calling GET ${apiUrl}/v1/fragments`);

  try {
    const res = await fetch(`${apiUrl}/v1/fragments`, {
      headers: user.authorizationHeaders(),
    });

    if (!res.ok) {
      throw new Error(`${res.status} ${res.statusText}`);
    }

    const data = await res.json();
    console.log('Retrieved fragments user data', { data });
  } catch (err) {
    console.error('Unable to call GET /v1/fragment', { err });
  }
};

module.exports.postFragment = async (user, formData) => {
  console.log(`Calling POST ${apiUrl}/v1/fragments`);

  const createdFragment = {};

  const authHeaders = user.authorizationHeaders();
  const contentType = 'text/plain';

  try {
    const res = await fetch(`${apiUrl}/v1/fragments`, {
      method: 'POST',
      headers: {
        Authorization: authHeaders.Authorization,
        'Content-Type': contentType,
      },
      body: formData,
    });

    if (!res.ok) {
      throw new Error(`${res.status}, ${res.statusText}`);
    }

    createdFragment['Status'] = res.status;
    createdFragment['StatusText'] = res.statusText;
    createdFragment['Content-Type'] = res.headers.get('Content-Type');
    createdFragment['Location'] = res.headers.get('Location');
    createdFragment['Content-Length'] = res.headers.get('Content-Length');
    createdFragment['Body'] = await res.json();

    console.log('A new fragment has been created', createdFragment.body);
    return Promise.resolve(createdFragment);
  } catch (err) {
    console.error('Unable to call POST /v1/fragments', { err });
    return Promise.resolve(err);
  }
};

module.exports.getFragmentDataById = async (user, formData) => {
  console.log('Calling GET /v1/fragments/:id');

  const retrievedFragment = {};
  const authHeaders = user.authorizationHeaders();
  const contentType = formData.contentType;

  try {
    const res = await fetch(`${apiUrl}/v1/fragments/${formData.id}`, {
      method: 'GET',
      headers: {
        Authorization: authHeaders.Authorization,
        'Content-Type': contentType,
      },
    });

    if (!res.ok) {
      throw new Error(`${res.status}, ${res.statusText}`);
    }

    retrievedFragment['Status'] = res.status;
    retrievedFragment['StatusText'] = res.statusText;
    retrievedFragment['Content-Type'] = res.headers.get('Content-Type');
    retrievedFragment['Content-Length'] = res.headers.get('Content-Length');
    retrievedFragment['text'] = await res.text();

    console.log('A new fragment has been created', retrievedFragment.text);

    return Promise.resolve(retrievedFragment);
  } catch (err) {
    console.log('Unable to call GET /v1/fragments/:id', { err });
    return Promise.resolve(err);
  }
};
