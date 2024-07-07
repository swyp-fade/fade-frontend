import { Header } from '@Components/Header';
import { NavBar } from '@Components/NavBar';
import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';

export default function AppLayout() {
  return (
    <div className="flex h-full flex-col">
      <Header />
      <main className="scroll min-h-1 flex-1 overflow-y-scroll border border-blue-300 p-5">
        <Suspense fallback={<>페이지 로딩 중!</>}>
          <Outlet />
        </Suspense>
      </main>
      <NavBar />
    </div>
  );
}
