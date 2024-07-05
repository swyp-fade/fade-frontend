import { FadeLogo } from '@Components/FadeLogo';
import { Carousel } from './components/Carousel';
import { KakaoLoginButton } from './components/KakaoLoginButton';

export default function Page() {
  return (
    <section className="flex h-dvh flex-col items-center justify-center">
      <div className="flex flex-1 items-center">
        <FadeLogo />
      </div>

      <div className="flex flex-1 items-center">
        <Carousel />
      </div>

      <div className="flex flex-1 items-center">
        <KakaoLoginButton />
      </div>
    </section>
  );
}
