import { useHeader } from '@Hooks/useHeader';
import { MdClose, MdOutlineInfo } from 'react-icons/md';

export default function Page() {
  useHeader({
    title: '사진 업로드',
    leftSlot: () => <MdClose className="size-6" />,
    rightSlot: () => <MdOutlineInfo className="size-6" />,
  });

  return <>업로드 화면</>;
}
