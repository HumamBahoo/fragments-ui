import { useEffect } from 'react';

const ListFragments = ({ user, fragments, setFragments }) => {
  const handleSetFragments = async (setFragments) => {
    const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8080';

    const res = await fetch(`${apiUrl}/v1/fragments?expand=1`, {
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
          console.log(`User has ${data.fragments.length} fragment(s)`);
        } else {
          console.warn(`User has no saved fragments`);
        }
        return data;
      })
      .catch((err) => {
        console.error(err);
      });

    setFragments(res.fragments);
  };

  useEffect(() => {
    handleSetFragments(setFragments);
    // eslint-disable-next-line
    console.log(fragments[0].id);
  }, []);

  return (
    <div>
      <h1>{fragments[0].id}</h1>
    </div>
  );
};
export default ListFragments;
