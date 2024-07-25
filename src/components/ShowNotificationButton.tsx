import { useModalActions } from '@Hooks/modal';
import { MdOutlineNotificationsNone } from 'react-icons/md';
import { NotificationDialog } from './NotificationDialog';

export function ShowNotificationButton() {
  const { showModal } = useModalActions();

  const handleClick = async () => {
    await showModal({ type: 'fullScreenDialog', animateType: 'slideInFromRight', Component: NotificationDialog });
  };

  return (
    <button className="group relative cursor-pointer rounded-lg p-2 touchdevice:active:bg-gray-100 pointerdevice:hover:bg-gray-100" onClick={handleClick}>
      <MdOutlineNotificationsNone className="size-6 transition-transform touchdevice:group-active:scale-95 pointerdevice:group-active:scale-95" />
    </button>
  );
}
