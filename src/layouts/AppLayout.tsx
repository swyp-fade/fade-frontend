import { Outlet } from 'react-router-dom';

export default function AppLayout() {
  return (
    <div className="flex h-full flex-col">
      <header className="border border-red-300">헤더</header>
      <main className="scroll min-h-1 flex-1 overflow-y-scroll border border-blue-300 p-5">
        <Outlet />
      </main>
      <footer className="border border-green-500">풋터</footer>
    </div>
  );
}
