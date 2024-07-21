import { PropsWithChildren } from 'react';

export function ToggleButton({
  children,
  selected,
  onSelect,
}: PropsWithChildren<{
  selected: boolean;
  onSelect?: (isSelected: boolean) => void;
}>) {
  return (
    <button
      type="button"
      className="rounded-[1rem] border border-gray-200 px-5 py-2 transition-colors data-[selected=true]:border-purple-100 data-[selected=true]:bg-purple-50 pointerdevice:hover:data-[selected=false]:bg-gray-50"
      data-selected={selected}
      onClick={() => onSelect && onSelect(!selected)}>
      {children}
    </button>
  );
}
