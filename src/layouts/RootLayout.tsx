import { Outlet } from 'react-router-dom';

export default function RootLayout() {
  return (
    <div className="mx-auto h-1 min-h-dvh w-full border-x md:max-w-[48rem]">
      <Outlet />
    </div>
  );
}
