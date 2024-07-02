import { Outlet } from 'react-router-dom';

export default function RootLayout() {
  return (
    <main className="mx-auto min-h-dvh w-full border-x md:max-w-[48rem]">
      <Outlet />
    </main>
  );
}
