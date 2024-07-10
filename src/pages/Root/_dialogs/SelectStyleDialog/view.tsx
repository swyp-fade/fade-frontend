import { OUTFIT_STYLE_LIST } from '@/constants';
import { AnimatedDialog } from '@Components/AnimatedDialog';
import { ToggleButton } from '@Components/ui/toogleButton';
import { FlexibleLayout } from '@Layouts/FlexibleLayout';
import { OutfitStyle } from '@Types/outfitStyle';
import { forwardRef, useState } from 'react';
import { MdChevronLeft } from 'react-icons/md';

type SelectStyleViewProp = {
  defaultStyles: OutfitStyle[];
  onClose: (styles: OutfitStyle[]) => void;
};

export const SelectStyleView = forwardRef(({ defaultStyles = [], onClose }: SelectStyleViewProp, ref) => {
  const [selectedStyles, setSelectedStyles] = useState<OutfitStyle[]>(defaultStyles);

  return (
    <AnimatedDialog animateType="slideInFromRight">
      <FlexibleLayout.Root className="border-l shadow-xl">
        <FlexibleLayout.Header>
          {/* TODO: 취소? 저장? 경고? */}
          <Header onBack={() => onClose(defaultStyles)} />
        </FlexibleLayout.Header>

        <FlexibleLayout.Content className="space-y-3">
          <p>스타일은 복수선택 가능하며 사진 필터링에 이용됩니다.</p>
          <ul className="flex flex-row flex-wrap gap-x-2 gap-y-3">
            {OUTFIT_STYLE_LIST.map((outfitStyle, index) => (
              <li key={outfitStyle}>
                <ToggleButton
                  selected={selectedStyles.includes(index)}
                  onSelect={(isSelected) => {
                    if (isSelected) {
                      setSelectedStyles((prevStyles) => [...prevStyles, index]);
                    } else {
                      setSelectedStyles((prevStyles) => prevStyles.filter((value) => value !== index));
                    }
                  }}>
                  {outfitStyle}
                </ToggleButton>
              </li>
            ))}
          </ul>
        </FlexibleLayout.Content>

        <FlexibleLayout.Footer>
          <DoneSelectStylesButton onClick={() => onClose(selectedStyles)} />
        </FlexibleLayout.Footer>
      </FlexibleLayout.Root>
    </AnimatedDialog>
  );
});

function Header({ onBack }: { onBack: () => void }) {
  return (
    <header className="relative px-5 py-4">
      <button className="absolute left-4 top-1/2 -translate-y-1/2 cursor-pointer rounded-lg p-2 hover:bg-gray-200" onClick={onBack}>
        <MdChevronLeft className="size-6" />
      </button>

      <p className="text-center text-2xl font-semibold">스타일 선택</p>
    </header>
  );
}

function DoneSelectStylesButton({ onClick }: { onClick: () => void }) {
  return (
    <div className="flex p-5">
      <button className="flex-1 rounded-lg bg-black py-2 text-xl text-white" onClick={onClick}>
        스타일 선택 완료
      </button>
    </div>
  );
}
