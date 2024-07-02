import { QueryClient } from '@tanstack/react-query';

export async function loader({ queryClient }: { queryClient: QueryClient }) {
  return '굿...';
}

export default function Page() {
  return <div>안녕하시오 ..</div>;
}
