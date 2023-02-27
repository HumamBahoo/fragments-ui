import { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import NotFoundPage from './pages/NotFoundPage';
import { getUserFragments } from './util/api';
import { getUser } from './util/auth';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState({});

  const getUserData = async () => {
    if (isLoggedIn) {
      await getUserFragments(userData);
    } else {
      const data = await getUser();

      if (data) {
        setUserData(data);
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    }
  };

  useEffect(() => {
    getUserData();
    // eslint-disable-next-line
  }, [isLoggedIn]);

  return (
    <BrowserRouter>
      <Header isLoggedIn={isLoggedIn} />
      <div className="w-3/4 flex justify-center mx-auto py-10">
        <Routes>
          <Route path="/" element={<HomePage user={userData} isLoggedIn={isLoggedIn} />} />
          <Route path="/*" element={<NotFoundPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
