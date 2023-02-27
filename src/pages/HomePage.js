import GetFragmentDataByID from '../components/GetFragmentDataByID';
import PostFragment from '../components/PostFragment';

const HomePage = ({ user, isLoggedIn }) => {
  return (
    <div className="text-white w-full">
      {isLoggedIn ? (
        <div>
          <h2 className="text-h2 text-center">
            Hello, <span className="uppercase text-red-300">{user.username}</span>
          </h2>

          <div className="py-20 flex flex-col gap-5">
            <PostFragment user={user} />
            <GetFragmentDataByID user={user} />
          </div>
        </div>
      ) : (
        <h2 className="text-h2">Please, login first...</h2>
      )}
    </div>
  );
};

export default HomePage;
