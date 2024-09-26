import { useModalActions } from '@Hooks/modal';
import { queryClient } from '@Libs/queryclient';
import { MdEdit } from 'react-icons/md';
import { UploadBoNModal } from './UploadBoNModal';
import { BoNDetailModal } from './BonDetailModal/modal';
import { bonQueryKeys } from '../service';

export function CreateBoNPostButton() {
  const { showModal } = useModalActions();

  const handleClick = async () => {
    const bonId = await showModal({
      type: 'fullScreenDialog',
      animateType: 'slideUp',
      Component: UploadBoNModal,
    });

    if (typeof bonId === 'number') {
      showModal({
        type: 'fullScreenDialog',
        animateType: 'slideInFromRight',
        props: { bonId },
        Component: BoNDetailModal,
      });

      queryClient.invalidateQueries({
        queryKey: bonQueryKeys.all(),
        refetchType: 'all',
      });
    }
  };

  return (
    <div className="absolute bottom-20 right-5">
      <button type="button" className="block rounded-full bg-gray-900 p-4 shadow-bento" onClick={handleClick}>
        <MdEdit className="size-6 text-white" />
      </button>
    </div>
  );
}
