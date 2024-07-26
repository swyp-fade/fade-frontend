import testImage from '@Assets/test_fashion_image.jpg';
import { Image } from '@Components/ui/image';
import { useHeader } from '@Hooks/useHeader';
import { MdChevronLeft } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';

export default function Page() {
  useHeader({
    title: '북마크',
    leftSlot: () => <BackButton />,
  });

  return (
    <div>
      <div className="grid w-full grid-cols-3 gap-1 p-1">
        {Array.from({ length: 13 })
          .fill(0)
          .map((_, index) => (
            <div key={`item-${index}`} className="group aspect-[3/4] w-full cursor-pointer overflow-hidden rounded-lg">
              <Image src={testImage} className="h-full w-full transition-transform group-hover:scale-105" />
            </div>
          ))}
      </div>
    </div>
  );
}

function BackButton() {
  const navigate = useNavigate();

  return (
    <button
      className="group cursor-pointer rounded-lg p-2 touchdevice:active:bg-gray-100 pointerdevice:hover:bg-gray-100"
      onClick={() => navigate('/mypage', { replace: true })}>
      <MdChevronLeft className="size-6 transition-transform group-active:scale-95" />
    </button>
  );
}
