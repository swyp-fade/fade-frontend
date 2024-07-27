import testImage from '@Assets/test_fashion_image.jpg';
import { Button } from '@Components/ui/button';
import { Image } from '@Components/ui/image';
import { useModalActions } from '@Hooks/modal';
import { useState } from 'react';
import { FilterType, SelectFilterDialog, SelectFilterDialogProps } from './SelectFilterDialog';

export function AllArchivingView() {
  return (
    <div className="w-full border">
      {/* TODO: 나중에 스크롤 애니메이션 달아보기 */}
      <div className="w-full bg-white p-5">
        <SelectFilterButton />
      </div>

      <div className="grid w-full grid-cols-3 gap-1">
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

function SelectFilterButton() {
  const [filters, setFilters] = useState<FilterType>({
    gender: null,
    selectedStyles: [],
  });

  const { showModal } = useModalActions();

  const handleClick = async () => {
    const selectFilterResult = await showModal<FilterType>({
      type: 'fullScreenDialog',
      animateType: 'slideInFromRight',
      Component: SelectFilterDialog,
      props: { defaultFilter: filters } as SelectFilterDialogProps,
    });

    setFilters(
      selectFilterResult || {
        gender: null,
        selectedStyles: [],
      }
    );
  };

  return (
    <Button variants="secondary" className="w-full bg-gray-100 text-gray-900" onClick={handleClick}>
      필터
    </Button>
  );
}
