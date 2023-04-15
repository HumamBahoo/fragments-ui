// src/app.js

import { Auth, getUser } from './auth';
import { viewFragment, listFragments, deleteFragment, postFragment } from './api';

async function handleDeleteFragment(user, id) {
  await deleteFragment(user, id);
  await handleListFragments(user);
}

async function handleViewFragment(user, id) {}

async function handlePostFragment(user, formData) {
  const selectedFragmentType = formData.get('fragment-type-select');
  const textFragment = formData.get('text-fragment');
  const jsonFragment = formData.get('json-fragment');
  const imageFragment = document.querySelector('#image-fragment');

  if (selectedFragmentType.startsWith('text/')) {
    try {
      const res = await postFragment(user, textFragment, selectedFragmentType);
      return res;
    } catch (err) {
      console.error(err);
      return 'Failed to create a new fragment';
    }
  }

  if (selectedFragmentType.startsWith('application/')) {
    try {
      JSON.parse(jsonFragment);
      const res = await postFragment(user, jsonFragment, selectedFragmentType);
      return res;
    } catch (err) {
      console.error(err);
      return 'Failed to create a new fragment';
    }
  }

  if (selectedFragmentType.startsWith('image/')) {
    try {
      const res = await postFragment(user, imageFragment.files[0], imageFragment.files[0].type);
      return res;
    } catch (err) {
      console.error(err);
      return 'Failed to create a new fragment';
    }
  }
}

async function handleListFragments(user) {
  const res = await listFragments(user);

  const tableBody = document.querySelector('#table-body');
  tableBody.innerHTML = '';

  // loop through the fragments array
  res.fragments.forEach((fragment) => {
    const columns = ['id', 'ownerId', 'type', 'size', 'created', 'updated'];
    const tr = document.createElement('tr');

    // loop through each column to append the fragment data
    columns.forEach((column) => {
      const cell = document.createElement('td');

      // if curr column is 'id'
      if (column === 'id') {
        // create a link and set its properties
        const idLink = document.createElement('a');
        idLink.href = '#';
        idLink.textContent = fragment[column];
        idLink.onclick = async () => await handleViewFragment(user, fragment.id);

        // append link to cell
        cell.appendChild(idLink);
      }
      // if curr column is 'ownerId'
      else if (column === 'ownerId') {
        // display the first and last 5 characters
        const ownerId = fragment[column];
        cell.textContent = ownerId.substring(0, 5) + '***' + ownerId.substring(ownerId.length - 5);
      }
      // everything else
      else {
        cell.textContent = fragment[column];
      }

      tr.appendChild(cell);
    });

    // create delete button and add an event listener
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.id = 'delete-fragment';
    deleteButton.onclick = async () => await handleDeleteFragment(user, fragment.id);

    // add delete button to the row
    const buttonCell = document.createElement('td');
    buttonCell.appendChild(deleteButton);
    tr.appendChild(buttonCell);

    // append tr to tbody
    tableBody.appendChild(tr);
  });
}

async function init() {
  // get our UI elements
  const userSection = document.querySelector('#user');
  const loginBtn = document.querySelector('#login');
  const logoutBtn = document.querySelector('#logout');
  const contentSection = document.querySelector('#content');
  const viewFragmentForm = document.querySelector('#view-fragment-form');
  const createFragmentForm = document.querySelector('#create-fragment-form');
  const createFragmentError = document.querySelector('#create-fragment-error');
  const getFragmentError = document.querySelector('#get-fragment-error');

  // wire up event handlers to deal with login and logout.
  loginBtn.onclick = () => Auth.federatedSignIn();
  logoutBtn.onclick = () => Auth.signOut();

  // get the signed in user
  const user = await getUser();

  // if user is signed in
  if (user) {
    console.log({ user });
    userSection.querySelector('.username').textContent = user.username;
    userSection.hidden = false;
    contentSection.hidden = false;
    loginBtn.disabled = true;
    handleListFragments(user);
  }
  // if user not signed in
  else {
    logoutBtn.disabled = true;
  }

  /////// handles fragment type selection //////////////////
  const fragmentTypeSelect = document.querySelector('#fragment-type-select');
  const textFragment = document.querySelector('#text-fragment');
  const jsonFragment = document.querySelector('#json-fragment');
  const imageFragment = document.querySelector('#image-fragment');

  // handle change
  fragmentTypeSelect.onchange = () => {
    // set everything to default
    textFragment.hidden = true;
    textFragment.required = false;
    jsonFragment.hidden = true;
    jsonFragment.required = false;
    imageFragment.hidden = true;
    imageFragment.required = false;

    if (fragmentTypeSelect.value.startsWith('text/')) {
      textFragment.hidden = false;
      textFragment.required = true;
    } else if (fragmentTypeSelect.value.startsWith('application/')) {
      jsonFragment.hidden = false;
      jsonFragment.required = true;
    } else if (fragmentTypeSelect.value.startsWith('image/')) {
      imageFragment.hidden = false;
      imageFragment.required = true;
    }
  };

  /////// handles POST /v1/fragments //////////////////
  createFragmentForm.onsubmit = async (evt) => {
    evt.preventDefault();

    // retrieve form data and pass it to create fragment handler
    const formData = new FormData(createFragmentForm);
    const res = await handlePostFragment(user, formData);

    // remove existing error notification
    if (createFragmentError) {
      createFragmentError.innerHTML = '';
      createFragmentError.hidden = true;
    }

    // if an error occurred
    if (res === 'Failed to create a new fragment') {
      const p = document.createElement('p');
      p.textContent = res;
      p.style.color = 'red';
      createFragmentError.appendChild(p);
      createFragmentError.hidden = false;
    }
    // if no error
    else {
      await handleListFragments(user);

      textFragment.hidden = true;
      textFragment.required = false;
      jsonFragment.hidden = true;
      jsonFragment.required = false;
      imageFragment.hidden = true;
      imageFragment.required = false;

      createFragmentForm.reset();
    }
  };

  /////// handles GET /v1/fragments/:id //////////////////
  viewFragmentForm.onsubmit = async (evt) => {
    evt.preventDefault();

    // retrieve form data
    const formData = new FormData(viewFragmentForm);
    const fragmentId = formData.get('fragment-id');

    if (getFragmentError) {
      getFragmentError.innerHTML = '';
      getFragmentError.hidden = true;
    }

    // handle view fragment
    try {
      const { data, fragmentType } = await viewFragment(user, fragmentId);

      const pre = document.createElement('pre');

      if (fragmentType.startsWith('image/')) {
        const img = document.createElement('img');
        img.src = data;
        pre.appendChild(img);
      } else {
        pre.textContent = fragmentType.startsWith('text/') ? data : JSON.stringify(data, null, 2);
      }

      document.body.appendChild(pre);

      viewFragmentForm.reset();
    } catch (err) {
      const p = document.createElement('p');
      p.textContent = err;
      p.style.color = 'red';
      getFragmentError.appendChild(p);
      getFragmentError.hidden = false;
    }
  };
}

// Wait for the DOM to be ready, then start the app
addEventListener('DOMContentLoaded', init);
