import { useHeader } from '@Hooks/useHeader';
import { useState } from 'react';
import { MdChevronLeft } from 'react-icons/md';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import fadeInImage from '@Assets/vote_fade_in.png';
import { cn } from '@Utils/index';

import testFashionImage1 from '@Assets/test_fashion_image.jpg';
import testFashionImage10 from '@Assets/test_fashion_image_10.jpg';
import testFashionImage2 from '@Assets/test_fashion_image_2.jpg';
import testFashionImage3 from '@Assets/test_fashion_image_3.jpg';
import testFashionImage4 from '@Assets/test_fashion_image_4.jpg';
import testFashionImage5 from '@Assets/test_fashion_image_5.webp';
import testFashionImage6 from '@Assets/test_fashion_image_6.jpg';
import testFashionImage7 from '@Assets/test_fashion_image_7.jpg';
import testFashionImage8 from '@Assets/test_fashion_image_8.jpg';
import testFashionImage9 from '@Assets/test_fashion_image_9.jpg';

const testFahsionImages = [
  testFashionImage1,
  testFashionImage2,
  testFashionImage3,
  testFashionImage4,
  testFashionImage5,
  testFashionImage6,
  testFashionImage7,
  testFashionImage8,
  testFashionImage9,
  testFashionImage10,
];

export default function Page() {
  useHeader({ title: '투표 내역', leftSlot: () => <BackButton /> });

  const [isFadeInMode, setIsFadeInMode] = useState(false);

  return (
    <div className="flex h-full flex-col">
      <div className="flex flex-row items-center gap-3 border border-red-500 bg-white px-5 py-3">
        <input type="date" className="flex-1" />
        <FadeInModeToggleButton isFadeInMode={isFadeInMode} onToggle={() => setIsFadeInMode((prev) => !prev)} />
      </div>

      <div className="flex-1 space-y-[3.75rem] overflow-y-scroll p-5">
        <VoteHistoryItem />
        <VoteHistoryItem />
        <VoteHistoryItem />
        <p className="text-detail text-gray-700">모든 투표 내역을 불러왔습니다.</p>
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

function FadeInModeToggleButton({ isFadeInMode, onToggle }: { isFadeInMode: boolean; onToggle: () => void }) {
  return (
    <button
      className={cn('rounded-3xl bg-gray-200 p-1 shadow-inner transition-colors', {
        ['pr-8']: !isFadeInMode,
        ['bg-purple-500 pl-8']: isFadeInMode,
      })}
      onClick={() => onToggle()}>
      <motion.div layout className="rounded-3xl bg-white px-3 py-2">
        <div style={{ backgroundImage: `url('${fadeInImage}')` }} className="h-[.75rem] w-[3.875rem] bg-contain bg-center bg-no-repeat" />
      </motion.div>
    </button>
  );
}

function VoteHistoryItem() {
  return (
    <section className="space-y-2">
      <h6 className="text-h6 font-semibold">2024년 7월 23일</h6>
      <ImageGrid images={testFahsionImages} />
    </section>
  );
}

function ImageGrid({ images }: { images: string[] }) {
  return (
    <div className="grid grid-cols-5 grid-rows-2 gap-2 border border-red-500">
      {images.map((imageURL) => (
        <ImageGridItem key={imageURL} imageURL={imageURL} />
      ))}
    </div>
  );
}

function ImageGridItem({ imageURL }: { imageURL: string }) {
  return (
    <button className="group aspect-[3/4] overflow-hidden rounded-lg">
      <div
        style={{ backgroundImage: `url('${imageURL}')` }}
        className="h-full w-full cursor-pointer bg-cover bg-center bg-no-repeat transition-transform touchdevice:group-active:scale-105 pointerdevice:group-hover:scale-105"
      />
    </button>
  );
}
