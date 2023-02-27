import { useEffect, useState } from 'react';
import { postFragment } from '../util/api';

const PostFragment = ({ user }) => {
  const [formDetails, setFormDetails] = useState(null);
  const [createdFragment, setCreatedFragment] = useState(null);
  const [alertMessage, setAlertMessage] = useState(null);

  const handleChange = (evt) => {
    setAlertMessage(null);
    setFormDetails(evt.target.value);
  };

  const handleSubmit = async (evt) => {
    evt.preventDefault();

    if (formDetails) {
      const res = await postFragment(user, formDetails);

      if (res.Status === 201) {
        setCreatedFragment(res);
      } else {
        setCreatedFragment('There was an error in creating the new fragment');
      }
    } else {
      setAlertMessage(
        <p className="text-white bg-red-500 rounded px-4 py-1 my-2">Please enter some text first</p>
      );
    }
  };

  return (
    <div className="flex flex-col gap-4 items-center border p-5 rounded-lg border-red-300 min-h-[650px]">
      <h1 className="text-h4 border-b-2 border-red-300 text-center pb-3">CREATE A TEXT FRAGMENT</h1>
      <div className="flex gap-10 w-full content-center">
        <form className="flex flex-col gap-5 p-5 w-1/4 content-center">
          <div className="flex flex-col gap-2">
            <textarea
              name="text-fragment"
              id="text-fragment"
              cols="20"
              rows="10"
              placeholder="Enter some text"
              className="rounded-lg p-5 text-base text-black"
              onChange={handleChange}
              required
            />
            {alertMessage}
            <button className="btn self-center w-full" onClick={handleSubmit} type="submit">
              Submit
            </button>
          </div>
        </form>

        <div className="flex flex-col gap-5 p-5 w-3/4">
          <h2 className="text-lg font-bold">Results</h2>

          {createdFragment && (
            <pre className="text-base overflow-auto">
              {JSON.stringify(createdFragment, null, 4)}
            </pre>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostFragment;
