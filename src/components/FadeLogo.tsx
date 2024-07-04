import fadeLogoImage from '@Assets/fade_logo.png';

export function FadeLogo() {
  return <div className="h-6 w-[5.25rem]" style={{ backgroundImage: `url('${fadeLogoImage}')` }} />;
}
