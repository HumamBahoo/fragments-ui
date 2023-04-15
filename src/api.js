// src/api.js

// fragments microservice API, defaults to localhost:8080
const apiUrl = process.env.API_URL || 'http://localhost:8080';

/**
 * Given an authenticated user, request all fragments for this user from the
 * fragments microservice (currently only running locally). We expect a user
 * to have an `idToken` attached, so we can send that along with the request.
 */
export async function listFragments(user) {
  console.log('GET /v1/fragments?expand=1');

  return await fetch(`${apiUrl}/v1/fragments?expand=1`, {
    method: 'GET',
    headers: user.authorizationHeaders(),
  })
    .then((res) => {
      if (!res.ok) {
        throw res.json();
      }

      return res.json();
    })
    .then((data) => {
      if (data.fragments.length > 0) {
        console.log(`User has ${data.fragments.length} fragment(s): `, { data });
      } else {
        console.log(`User has no saved fragments`);
      }

      return data;
    })
    .catch((err) => {
      console.error(err);
    });
}

/**
 * Creating a new fragment for the current user
 * @param {*} user current authenticated user
 * @param {*} formData form data to submit
 */
export async function postFragment(user, content, fragmentType) {
  console.log('POST /v1/fragments');

  return await fetch(`${apiUrl}/v1/fragments`, {
    method: 'POST',
    headers: {
      Authorization: user.authorizationHeaders().Authorization,
      'Content-Type': fragmentType,
    },
    body: content,
  })
    .then((res) => {
      if (!res.ok) {
        throw res.json();
      }
      return res.json();
    })
    .then((data) => {
      console.log('Success in creating new fragment', { data });
      return data;
    })
    .catch((err) => {
      console.error(err);
    });
}

/**
 *
 */
export async function viewFragment(user, fragmentId) {
  console.log('GET /v1/fragments/:id');

  try {
    const res = await fetch(`${apiUrl}/v1/fragments/${fragmentId}`, {
      method: 'GET',
      headers: user.authorizationHeaders(),
    });

    if (!res.ok) {
      throw await res.json();
    }

    let data;
    const fragmentType = res.headers.get('Content-Type');

    if (fragmentType.startsWith('text/')) {
      data = await res.text();
    } else if (fragmentType.startsWith('application/')) {
      data = await res.json();
    } else if (fragmentType.startsWith('image/')) {
      const blob = await res.blob();
      data = URL.createObjectURL(blob);
    }

    console.log('Success in retrieving fragment data: ', { data });

    return { data, fragmentType };
  } catch (err) {
    console.error(err);
    throw err;
  }
}

export async function deleteFragment(user, id) {
  console.log('DELETE /v1/fragments');

  return await fetch(`${apiUrl}/v1/fragments/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: user.authorizationHeaders().Authorization,
    },
  })
    .then((res) => {
      if (!res.ok) {
        throw res.json();
      }
      return res.json();
    })
    .then((data) => {
      console.log('Success in deleting fragment: ', { data });
      return data;
    })
    .catch((err) => {
      console.error(err);
    });
}
