import { Auth } from '../util/auth';
import { useNavigate } from 'react-router-dom';

const Header = ({ isLoggedIn }) => {
  const navigate = useNavigate();

  const handleLogin = () => {
    Auth.federatedSignIn();
  };

  const handleSignout = () => {
    Auth.signOut();
  };

  return (
    <div className="sticky flex justify-between px-40 py-5 bg-slate-900 text-white gap-5">
      <h1
        className="text-xl cursor-pointer font-bold hover:text-red-300 self-center"
        onClick={() => {
          navigate('/');
        }}
      >
        Fragments UI
      </h1>

      <div className="flex">
        {isLoggedIn ? (
          <button className="btn btn-primary self-center" onClick={handleSignout}>
            Sign Out
          </button>
        ) : (
          <button className="btn btn-primary self-center" onClick={handleLogin}>
            Login
          </button>
        )}
      </div>
    </div>
  );
};

export default Header;
