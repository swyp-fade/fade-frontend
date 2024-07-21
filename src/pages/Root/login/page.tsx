import { FadeLogo } from '@Components/FadeLogo';
import { Carousel } from './components/Carousel';
import { KakaoLoginButton } from './components/KakaoLoginButton';

import onboardingBackground from '@Assets/onboarding_background.jpg';
import { Link } from 'react-router-dom';

export default function Page() {
  return (
    <section className="flex h-dvh flex-col items-center justify-center" style={{ backgroundImage: `url('${onboardingBackground}')`, backgroundSize: 'cover' }}>
      <div className="flex flex-1 items-center">
        <FadeLogo />
      </div>

      <div className="flex flex-1 items-center">
        <Carousel />
      </div>

      <div className="flex flex-1 items-center">
        <div className="flex flex-col gap-3">
          <KakaoLoginButton />
          <Link to="/auth/callback/kakao?code=test" className="rounded-lg border bg-gray-50 p-2 text-center">
            테스트 로그인
          </Link>
        </div>
      </div>
    </section>
  );
}
