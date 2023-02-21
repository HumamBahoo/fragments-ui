import { useEffect, useState } from 'react';
import { getUser } from '../auth';
import LoginComponent from './LoginComponent';
import { getUserFragments } from '../api';

const MainComponent = () => {
  const [userData, setUserData] = useState({});
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const getUserData = async () => {
    const res = await getUser();

    if (res) {
      setUserData(res);
      setIsLoggedIn(true);
    }
  };

  useEffect(() => {
    getUserData();

    if (isLoggedIn) {
      getUserFragments(userData);
    }

    // eslint-disable-next-line
  }, [isLoggedIn]);

  return (
    <div className="MainComponent">
      <LoginComponent isLoggedIn={isLoggedIn} />

      {/* display username if user is logged in */}
      {isLoggedIn === true && (
        <h2 className="text-3xl font-semibold text-white text-center mt-[50px]">
          Hello <span className="text-red-400 uppercase">{userData.username}!</span>
        </h2>
      )}
    </div>
  );
};

export default MainComponent;
