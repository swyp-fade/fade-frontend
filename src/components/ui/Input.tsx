import cn from 'classnames';
import { InputHTMLAttributes } from 'react';

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input className={cn(className, 'w-full appearance-none rounded-lg border border-gray-200 px-5 py-[.875rem] outline-none focus:border-purple-500')} {...props} />
  );
}
