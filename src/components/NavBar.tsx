import { MdOutlineGridOn, MdHowToVote, MdAdd, MdAccountBox, MdPerson } from 'react-icons/md';
import { Link } from 'react-router-dom';

export function NavBar() {
  return (
    <nav>
      <ul className="flex flex-row">
        <li className="flex-1">
          <Link to="/archive" className="block h-full w-full py-5 transition-transform hover:rotate-3 hover:scale-125">
            <MdOutlineGridOn className="mx-auto size-6" />
          </Link>
        </li>
        <li className="flex-1">
          <Link to="/archive" className="block h-full w-full py-5 transition-transform hover:rotate-3 hover:scale-125">
            <MdHowToVote className="mx-auto size-6" />
          </Link>
        </li>
        <li className="flex-1">
          <Link to="/archive" className="block h-full w-full py-5 transition-transform hover:rotate-3 hover:scale-125">
            <MdAdd className="mx-auto size-6" />
          </Link>
        </li>
        <li className="flex-1">
          <Link to="/archive" className="block h-full w-full py-5 transition-transform hover:rotate-3 hover:scale-125">
            <MdAccountBox className="mx-auto size-6" />
          </Link>
        </li>
        <li className="flex-1">
          <Link to="/archive" className="block h-full w-full py-5 transition-transform hover:rotate-3 hover:scale-125">
            <MdPerson className="mx-auto size-6" />
          </Link>
        </li>
      </ul>
    </nav>
  );
}
