// src/app.js

import { Auth, getUser } from './auth';
import { getFragmentDataById, listUserFragments, postFragment } from './api';

async function init() {
  // Get our UI elements
  const userSection = document.querySelector('#user');
  const loginBtn = document.querySelector('#login');
  const logoutBtn = document.querySelector('#logout');
  const contentSection = document.querySelector('#content');

  // Form: get fragment data by id
  const getFragmentDataByIdForm = document.querySelector('#get-fragment-data-by-id-form');

  // Form: create new fragment form
  const newFragmentForm = document.querySelector('#new-fragment-form');
  const fragmentTypeSelection = document.querySelector('#fragment-type');
  const textFragmentInput = document.querySelector('#text-fragment');
  const jsonFragmentInput = document.querySelector('#json-fragment');
  const markdownFragmentInput = document.querySelector('#markdown-fragment');
  const htmlFragmentInput = document.querySelector('#html-fragment');

  // Wire up event handlers to deal with login and logout.
  loginBtn.onclick = () => {
    // Sign-in via the Amazon Cognito Hosted UI (requires redirects), see:
    // https://docs.amplify.aws/lib/auth/advanced/q/platform/js/#identity-pool-federation
    Auth.federatedSignIn();
  };

  logoutBtn.onclick = () => {
    // Sign-out of the Amazon Cognito Hosted UI (requires redirects), see:
    // https://docs.amplify.aws/lib/auth/emailpassword/q/platform/js/#sign-out
    Auth.signOut();
  };

  // See if we're signed in (i.e., we'll have a `user` object)
  const user = await getUser();

  if (!user) {
    // Disable the Logout button
    logoutBtn.disabled = true;
    return;
  }

  // EVENT HANDLERS
  // =============================================
  // =============================================

  // POST /v1/fragments
  newFragmentForm.onsubmit = (evt) => {
    evt.preventDefault();
    // retrieve form data
    const formData = new FormData(newFragmentForm);
    const selectedFragmentType = fragmentTypeSelection.value;

    const textFragment = formData.get('text-fragment');
    const htmlFragment = formData.get('html-fragment');
    const markdownFragment = formData.get('markdown-fragment');
    const jsonFragment = formData.get('json-fragment');

    // if plain text fragments
    if (selectedFragmentType == 'text/plain') {
      // request to post
      postFragment(user, textFragment, selectedFragmentType);

      //clean up form
      newFragmentForm.reset();
      textFragmentInput.hidden = true;
      textFragmentInput.required = false;
    }

    // if markdown
    if (selectedFragmentType == 'text/markdown') {
      // request to post
      postFragment(user, markdownFragment, selectedFragmentType);

      //clean up form
      newFragmentForm.reset();
      markdownFragmentInput.hidden = true;
      markdownFragmentInput.required = false;
    }

    // if html
    if (selectedFragmentType == 'text/html') {
      // request to post
      postFragment(user, htmlFragment, selectedFragmentType);

      //clean up form
      newFragmentForm.reset();
      htmlFragmentInput.hidden = true;
      htmlFragmentInput.required = false;
    }

    // if json
    if (selectedFragmentType == 'application/json') {
      try {
        // validate if this is a valid json fragment before submitting
        JSON.parse(jsonFragment);

        // request to post
        postFragment(user, jsonFragment, selectedFragmentType);

        //clean up form
        newFragmentForm.reset();
        jsonFragmentInput.hidden = true;
        jsonFragmentInput.required = false;

        // remove child node (notification) if it exists
        const notificationElement = newFragmentForm.querySelector('.notification');
        if (notificationElement) {
          notificationElement.remove();
        }
      } catch (err) {
        // setup form notification
        const notification = document.createElement('div');
        notification.classList.add('notification');
        notification.textContent = 'Invalid JSON format';
        notification.style.color = 'red';

        // append and log to console
        newFragmentForm.appendChild(notification);
        console.error('Invalid JSON format');
      }
    }
  };

  // =============================================

  // GET /v1/fragments/:id
  getFragmentDataByIdForm.onsubmit = (evt) => {
    evt.preventDefault();

    // retrieve form data
    const formData = new FormData(getFragmentDataByIdForm);
    const fragmentId = formData.get('fragment-id');

    // request
    getFragmentDataById(user, fragmentId);

    // clean up form
    getFragmentDataByIdForm.reset();
  };

  // =============================================
  // =============================================

  fragmentTypeSelection.onchange = () => {
    // set everything to default
    textFragmentInput.hidden = true;
    textFragmentInput.required = false;

    htmlFragmentInput.hidden = true;
    htmlFragmentInput.required = false;

    markdownFragmentInput.hidden = true;
    markdownFragmentInput.required = false;

    jsonFragmentInput.hidden = true;
    jsonFragmentInput.required = false;

    if (fragmentTypeSelection.value == 'text/plain') {
      textFragmentInput.hidden = false;
      textFragmentInput.required = true;
    } else if (fragmentTypeSelection.value == 'text/markdown') {
      markdownFragmentInput.hidden = false;
      markdownFragmentInput.required = true;
    } else if (fragmentTypeSelection.value == 'text/html') {
      htmlFragmentInput.hidden = false;
      htmlFragmentInput.required = true;
    } else if (fragmentTypeSelection.value == 'application/json') {
      jsonFragmentInput.hidden = false;
      jsonFragmentInput.required = true;
    }
  };

  // Log user info for debugging purposes
  console.log({ user });

  // Update the UI to welcome the user
  userSection.hidden = false;
  contentSection.hidden = false;

  // Show the user's username
  userSection.querySelector('.username').innerText = user.username;

  // Disable the Login button
  loginBtn.disabled = true;

  // Do an authenticated request to the fragments API server and log the result
  listUserFragments(user);
}

// Wait for the DOM to be ready, then start the app
addEventListener('DOMContentLoaded', init);
