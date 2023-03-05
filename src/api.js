// src/api.js

// fragments microservice API, defaults to localhost:8080
const apiUrl = process.env.API_URL || 'http://localhost:8080';

/**
 * Given an authenticated user, request all fragments for this user from the
 * fragments microservice (currently only running locally). We expect a user
 * to have an `idToken` attached, so we can send that along with the request.
 */
export async function listUserFragments(user) {
  console.log('Retrieving all fragments for current user: Calling GET /v1/fragments');

  try {
    const res = await fetch(`${apiUrl}/v1/fragments`, {
      // Generate headers with the proper Authorization bearer token to pass
      headers: user.authorizationHeaders(),
    });

    if (!res.ok) {
      throw new Error(`${res.status} ${res.statusText}`);
    }

    const data = await res.json();
    console.log('Successfully retrieved all user fragments', { data });
    // TODO: return something
  } catch (err) {
    console.error('Unable to call GET /v1/fragments', { err });
  }
}

/**
 * Creating a new fragment for the current user
 * @param {*} user current authenticated user
 * @param {*} formData form data to submit
 */
export async function postFragment(user, content, fragmentType) {
  console.log('Creating a new fragment: Calling POST /v1/fragments');

  // setting fetch request details
  const body = content;

  const headers = {
    Authorization: user.authorizationHeaders().Authorization,
    'Content-Type': fragmentType,
  };

  try {
    const res = await fetch(`${apiUrl}/v1/fragments`, {
      method: 'POST',
      headers: headers,
      body: body,
    });

    if (!res.ok) {
      throw await res.json();
    }

    const data = {
      status: res.status,
      statusText: res.statusText,
      'Content-Type': res.headers.get('Content-Type'),
      Location: res.headers.get('Location'),
      'Content-Length': res.headers.get('Content-Length'),
      body: await res.json(),
    };

    console.log('Successfully created a new fragment', { data });
    // TODO: return something
  } catch (err) {
    console.error('Failed to create a new fragment', { err });
  }
}

/**
 *
 */
export async function getFragmentDataById(user, fragmentId) {
  console.log('Retrieving a fragment by Id: Calling GET /v1/fragments/:id');

  try {
    const res = await fetch(`${apiUrl}/v1/fragments/${fragmentId}`, {
      headers: user.authorizationHeaders(),
    });

    if (!res.ok) {
      throw await res.json();
    }

    const data = {
      status: res.status,
      statusText: res.statusText,
      'Content-Type': res.headers.get('Content-Type'),
      'Content-Length': res.headers.get('Content-Length'),
    };

    if (data['Content-Type'].match('text/*')) {
      data['body'] = await res.text();
    } else {
      data['body'] = await res.json();
    }

    console.log('Successfully retrieved the fragment', { data });
  } catch (err) {
    console.error('Failed to retrieve the fragment', { err });
  }
}
