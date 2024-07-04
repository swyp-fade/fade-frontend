import RootLayout from '@/layouts/RootLayout';
import RootPage from '@Pages/Root/page';
import { lazy } from 'react';
import { Route, createRoutesFromElements } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';

/** Common */
const NotFoundPage = lazy(() => import('@Pages/NotFoundPage'));

/** Auth */
const KakaoCallback = lazy(() => import('@Pages/Auth/KakaoCallback').then((module) => ({ default: module.default })));
const SignOut = lazy(() => import('@Pages/Auth/SignOut').then((module) => ({ default: module.default })));

export const routesFromElements = createRoutesFromElements(
  <Route element={<RootLayout />}>
    <Route path="/">
      <Route index element={<RootPage />} />
      <Route element={<ProtectedRoute />}>
        <Route path="archive" />
        <Route path="fap" />
        <Route path="upload" />
        <Route path="feed" />
        <Route path="mypage" />
      </Route>
    </Route>

    <Route path="/auth">
      <Route path="callback">
        <Route path="kakao">
          <Route index Component={KakaoCallback} loader={(await import('@Pages/Auth/KakaoCallback')).loader} />
        </Route>
      </Route>
      <Route path="signout">
        <Route index Component={SignOut} loader={(await import('@Pages/Auth/SignOut')).loader} />
      </Route>
    </Route>

    <Route path="*" Component={NotFoundPage} />
  </Route>
);
