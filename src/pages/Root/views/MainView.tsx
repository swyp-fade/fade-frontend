import { useUser } from '@Hooks/auth';

export function MainView() {
  const user = useUser();

  if (!user) {
    throw new Error('이 타이밍에 user가 없으면 안돼 in MainView');
  }

  return <>{user.accountId}어서오시오. 메인이오.</>;
}
