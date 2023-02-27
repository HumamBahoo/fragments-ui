import { useState } from 'react';
import { getFragmentDataById } from '../util/api';

const GetFragmentDataByID = ({ user }) => {
  const [retrievedFragment, setRetrievedFragment] = useState(null);
  const [alertMessage, setAlertMessage] = useState(null);

  const [formDetails, setFormDetails] = useState({
    id: null,
    contentType: null,
  });

  const handleChange = (evt) => {
    const name = evt.target.name;
    const value = evt.target.value;

    setAlertMessage(null);

    setFormDetails((data) => {
      return { ...data, [name]: value };
    });
  };

  const handleSubmit = async (evt) => {
    evt.preventDefault();

    if (formDetails.id && formDetails.contentType) {
      const res = await getFragmentDataById(user, formDetails);

      if (res.Status == 200) {
        setRetrievedFragment(res);
      } else {
        setRetrievedFragment('There was an error in retrieving the fragment');
      }
    } else {
      setAlertMessage(
        <p className="text-white bg-red-500 rounded px-4 py-1 my-2">
          Both Fragment Id and Content Type has to be entered/selected
        </p>
      );
    }
  };

  return (
    <div className="flex flex-col gap-4 items-center border p-5 rounded-lg border-red-300 min-h-[650px]">
      <h1 className="text-h4 border-b-2 border-red-300 text-center pb-3">Get Fragment By ID</h1>

      <div className="flex gap-10 w-full content-center">
        <form className="flex flex-col gap-5 p-5 w-1/3 content-center">
          <div className="flex flex-col gap-2">
            <input
              name="id"
              id="id"
              type="text"
              placeholder="Enter fragment id"
              className="rounded-lg p-5 text-base text-black"
              onChange={handleChange}
            />

            <select
              name="contentType"
              id="contentType"
              required
              className="rounded-lg p-5 text-base text-black"
              onChange={handleChange}
            >
              <option value="">Select Content Type</option>
              <option value="text/plain">text/plain</option>
            </select>
            {alertMessage}
            <button className="btn self-center w-full" onClick={handleSubmit} type="submit">
              Submit
            </button>
          </div>
        </form>

        <div className="flex flex-col gap-5 p-5 w-2/3">
          <h2 className="text-lg font-bold">Results</h2>

          {retrievedFragment && (
            <pre className="text-base overflow-auto">
              {JSON.stringify(retrievedFragment, null, 4)}
            </pre>
          )}
        </div>
      </div>
    </div>
  );
};

export default GetFragmentDataByID;
