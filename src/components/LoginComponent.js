import { Auth } from '../auth';

const LoginComponent = ({ isLoggedIn }) => {
  const handleLogin = () => {
    Auth.federatedSignIn();
  };

  const handleLogout = () => {
    Auth.signOut();
  };

  return (
    <div className="LoginComponent text-center p-5">
      {/* find if user is logged in */}
      {isLoggedIn ? (
        <button className="btn btn-secondary w-40" onClick={handleLogout}>
          Logout
        </button>
      ) : (
        <button className="btn btn-primary w-40" onClick={handleLogin}>
          Login
        </button>
      )}
    </div>
  );
};

export default LoginComponent;
