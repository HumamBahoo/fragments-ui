import { useState } from 'react';
import CreateFragment from './CreateFragment';
import ListFragments from './ListFragments';
import DisplayFragment from './DisplayFragment';

const Content = ({ user, fragments, setFragments }) => {
  const [selection, setSelection] = useState('list');

  const handleSelection = (value) => {
    setSelection(value);
  };

  return (
    <div className="m-12 mx-52 flex flex-col items-center justify-start gap-8">
      <h1 className="text-4xl">Fragments UI</h1>
      <nav className="bg-red-50 py-2 border-l-2 border-r-2 border-black w-full">
        <ul className="flex flex-row justify-center items-center gap-32">
          <li
            className="cursor-pointer hover:text-blue-600 font-bold text-lg uppercase hover:underline"
            onClick={() => handleSelection('create')}
          >
            Create Fragment
          </li>
          <li
            className="cursor-pointer hover:text-blue-600 font-bold text-lg uppercase hover:underline"
            onClick={() => handleSelection('list')}
          >
            List Fragments
          </li>
          <li
            className="cursor-pointer hover:text-blue-600 font-bold text-lg uppercase hover:underline"
            onClick={() => handleSelection('display')}
          >
            Display Fragment
          </li>
        </ul>
      </nav>

      {selection === 'create' && (
        <CreateFragment user={user} fragments={fragments} setFragments={setFragments} />
      )}
      {selection === 'list' && (
        <ListFragments user={user} fragments={fragments} setFragments={setFragments} />
      )}
      {selection === 'display' && (
        <DisplayFragment user={user} fragments={fragments} setFragments={setFragments} />
      )}
    </div>
  );
};

export default Content;
