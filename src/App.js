import { useEffect, useState } from 'react';
import './App.css';
import { Auth, getUser } from './util/auth';
import Content from './components/Content';

function App() {
  const [user, setUser] = useState({});
  const [fragments, setFragments] = useState([]);

  const handleSetUser = async () => {
    setUser(await getUser());
  };

  const handleLogin = () => {
    Auth.federatedSignIn();
  };

  const handleLogout = () => {
    Auth.signOut();
  };

  useEffect(() => {
    handleSetUser();
  }, []);

  return (
    <div className="App">
      <header className="flex flex-row bg-slate-800 border-b-1 border-slate-300 shadow-sm items-center py-3 px-16 justify-between text-slate-300">
        <h1 className="text-2xl cursor-pointer hover:text-red-200" onClick={() => {}}>
          Fragments UI
        </h1>

        <nav>
          {user ? (
            <div className="flex flex-row gap-8 items-center">
              <h1 className="text-xl">
                Hello, <span className="uppercase text-red-400">{user.username}</span>
              </h1>
              <button onClick={handleLogout}>Logout</button>
            </div>
          ) : (
            <button onClick={handleLogin}>Login</button>
          )}
        </nav>
      </header>

      {user && <Content user={user} fragments={fragments} setFragments={setFragments} />}
    </div>
  );
}

export default App;
