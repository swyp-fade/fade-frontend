import { getBase64Image, validateLocalImageFile } from '@Utils/index';
import { ChangeEvent, useRef, useState } from 'react';
import { MdAddPhotoAlternate } from 'react-icons/md';
import { UploadGuideBottomSheet } from './UploadGuideBottomSheet';

export function InputImageFile(props: { value: string; onChange: (value: string) => void }) {
  const [isGuideOpened, setIsGuideOpened] = useState(false);

  const [imageData, setImageData] = useState<string | null>(null); // base64 data
  const inputRef = useRef<HTMLInputElement>(null);

  const hasImageData = imageData !== null;
  const hasNoImageData = imageData === null;

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const doneSelectImageFile = event.currentTarget.files !== null;

    if (!doneSelectImageFile) {
      return;
    }

    const currentImageFile = event.currentTarget.files![0];
    const { isValid, message } = validateLocalImageFile(currentImageFile);

    if (!isValid) {
      alert(message);
      return;
    }

    getBase64Image(currentImageFile)
      .then((imageData) => {
        inputRef.current!.value = '';
        setImageData(imageData);
        props.onChange(imageData);
      })
      .catch((error) => console.error(error));
  };

  const selectImageFile = () => {
    inputRef.current!.click();
  };

  const handleSelectImageClick = () => {
    if (hasNoImageData) {
      return setIsGuideOpened(true);
    }

    selectImageFile();
  };

  return (
    <>
      <UploadGuideBottomSheet isOpened={isGuideOpened} onOpenChagne={setIsGuideOpened} onAfterClose={() => selectImageFile()} />

      <div className="m group flex aspect-[2.2/1] cursor-pointer items-center justify-center overflow-hidden rounded-lg bg-gray-200" onClick={handleSelectImageClick}>
        {hasNoImageData && (
          <MdAddPhotoAlternate className="size-20 text-gray-500 transition-transform pointerdevice:group-hover:scale-125 pointerdevice:group-active:scale-95" />
        )}
        {hasImageData && <img src={imageData} className="h-full object-contain" />}
        <input ref={inputRef} type="file" id="image" name="image" accept=".jpg, jpeg, .png, .webp" onChange={handleChange} onClick={(e) => e.stopPropagation()} hidden />
      </div>
    </>
  );
}
