import { useEffect, useState } from 'react';
import { getUser } from '../auth';
import LoginComponent from './LoginComponent';

const MainComponent = () => {
  const [user, setUser] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // function to get logged in user and set it
    const getUserData = async () => {
      const result = await getUser();
      if (result) {
        setUser(result.username);
      }
    };

    // get user data
    getUserData();

    // find if user is logged in
    if (user) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, [user]);

  return (
    <div className="MainComponent">
      <LoginComponent isLoggedIn={isLoggedIn} />

      {/* display username if user is logged in */}
      {isLoggedIn === true && (
        <h2 className="text-3xl font-semibold text-white text-center mt-[50px]">
          Hello <span className="text-red-400 uppercase">{user}!</span>
        </h2>
      )}
    </div>
  );
};

export default MainComponent;
