import { useHeaderStore } from '@Stores/header';

export function Header() {
  const leftSlot = useHeaderStore((state) => state.leftSlot);
  const rightSlot = useHeaderStore((state) => state.rightSlot);
  const title = useHeaderStore((state) => state.title);

  const isTitleString = typeof title === 'string';
  const isTitleSlot = typeof title === 'function';

  return (
    <header className="relative py-2">
      {leftSlot && <div className="absolute left-3 top-1/2 -translate-y-1/2">{leftSlot()}</div>}
      {isTitleString && <p className="text-center text-2xl font-semibold">{title}</p>}
      {isTitleSlot && <div className="mx-auto w-fit">{title()}</div>}
      {rightSlot && <div className="absolute right-3 top-1/2 -translate-y-1/2">{rightSlot()}</div>}
    </header>
  );
}
