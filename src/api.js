// src/api.js

// fragments microservice API, defaults to localhost:8080
const apiUrl = process.env.API_URL || 'http://localhost:8080';

/**
 * Given an authenticated user, request all fragments for this user from the
 * fragments microservice (currently only running locally). We expect a user
 * to have an `idToken` attached, so we can send that along with the request.
 */
export async function listUserFragments(user) {
  console.log('GET /v1/fragments: Get all user fragments');

  try {
    const res = await fetch(`${apiUrl}/v1/fragments?expand=1`, {
      // Generate headers with the proper Authorization bearer token to pass
      headers: user.authorizationHeaders(),
    });

    if (!res.ok) {
      throw await res.json();
    }

    const data = await res.json();

    if (data.fragments.length > 0) {
      console.log(`Successfully retrieved ${data.fragments.length} fragment(s)`, {
        fragments: data.fragments,
      });
    } else {
      console.warn('User has no fragments');
    }
  } catch (err) {
    console.error('Error in GET /v1/fragments:', err);
  }
}

/**
 * Creating a new fragment for the current user
 * @param {*} user current authenticated user
 * @param {*} formData form data to submit
 */
export async function postFragment(user, content, fragmentType) {
  console.log('POST /v1/fragments: Create a new fragment');

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

    const data = await res.json();
    console.log(`A New ${fragmentType} fragment was created`, { data });
  } catch (err) {
    console.error('Error in POST /v1/fragments', { err });
  }
}

/**
 *
 */
export async function getFragmentDataById(user, fragmentId) {
  console.log('GET /v1/fragments/:id: Get fragment by Id');

  try {
    const res = await fetch(`${apiUrl}/v1/fragments/${fragmentId}`, {
      headers: user.authorizationHeaders(),
    });

    if (!res.ok) {
      throw await res.json();
    }

    // get data based on response content-type
    let data;
    const contentType = res.headers.get('Content-Type');

    if (contentType.includes('text/plain')) {
      data = await res.text();
    }
    if (contentType.includes('text/markdown')) {
      data = await res.text();
    }
    if (contentType.includes('text/html')) {
      data = await res.text();
    }
    if (contentType.includes('application/json')) {
      data = await res.json();
    }

    console.log('Fragment data has been retrieved', { data });
  } catch (err) {
    console.error('Error in GET /v1/fragments/:id', err);
  }
}
