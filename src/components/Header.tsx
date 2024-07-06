import { MdInfoOutline, MdOutlineNotificationsNone } from 'react-icons/md';

export function Header() {
  return (
    <header className="relative px-5 py-4">
      <MdInfoOutline className="absolute left-5 top-1/2 size-6 -translate-y-1/2" />
      <p className="text-center text-2xl font-semibold">FA:P 투표</p>
      <MdOutlineNotificationsNone className="absolute right-5 top-1/2 size-6 -translate-y-1/2" />
    </header>
  );
}
