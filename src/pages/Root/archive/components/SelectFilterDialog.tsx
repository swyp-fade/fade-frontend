import { OUTFIT_STYLE_LIST } from '@/constants';
import { BackButton } from '@Components/ui/button';
import { Button } from '@Components/ui/button';
import { ToggleButton } from '@Components/ui/toogleButton';
import { FlexibleLayout } from '@Layouts/FlexibleLayout';
import { DefaultModalProps } from '@Stores/modal';
import { OutfitStyle } from '@Types/outfitStyle';
import { useState } from 'react';

export type GenderType = 'men' | 'women';
export type FilterType = { gender: GenderType | null; selectedStyles: OutfitStyle[] };
export type SelectFilterDialogProps = { defaultFilter: FilterType };

export function SelectFilterDialog({ defaultFilter, onClose }: DefaultModalProps<FilterType, SelectFilterDialogProps>) {
  const [selectedGender, setSelectedGender] = useState<FilterType['gender']>(defaultFilter.gender);
  const [selectedStyles, setSelectedStyles] = useState<OutfitStyle[]>(defaultFilter.selectedStyles);

  const clearSelectedFilter = () => {
    setSelectedGender(null);
    setSelectedStyles([]);
  };

  const handleCTAClick = () => {
    onClose({ gender: selectedGender, selectedStyles });
  };

  return (
    <FlexibleLayout.Root>
      <FlexibleLayout.Header>
        <header className="relative flex items-center justify-center border-b border-b-gray-200 py-2">
          <BackButton onClick={() => onClose(defaultFilter)} />
          <span className="mx-auto text-h3 font-semibold">필터</span>
          <ResetButton onClick={clearSelectedFilter} />
        </header>
      </FlexibleLayout.Header>

      <FlexibleLayout.Content className="p-5">
        <div className="space-y-10">
          <div className="space-y-3">
            <p className="text-h6 font-semibold">성별</p>
            <ul className="flex flex-row flex-wrap gap-x-2 gap-y-3">
              {(['men', 'women'] as GenderType[]).map((gender) => (
                <li key={gender}>
                  <ToggleButton selected={selectedGender === gender} onSelect={(isSelected) => (isSelected ? setSelectedGender(gender) : setSelectedGender(null))}>
                    {gender === 'men' && '남자'}
                    {gender === 'women' && '여자'}
                  </ToggleButton>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-3">
            <p className="text-h6 font-semibold">스타일</p>
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
          </div>
        </div>
      </FlexibleLayout.Content>

      <FlexibleLayout.Footer>
        <div className="p-5">
          <Button variants="secondary" className="w-full text-xl" onClick={handleCTAClick}>
            적용
          </Button>
        </div>
      </FlexibleLayout.Footer>
    </FlexibleLayout.Root>
  );
}

function ResetButton({ onClick }: { onClick: () => void }) {
  return (
    <Button variants="ghost" size="icon" className="absolute right-3 top-1/2 -translate-y-1/2 font-normal" onClick={onClick}>
      <span className="text-gray-600">초기화</span>
    </Button>
  );
}
