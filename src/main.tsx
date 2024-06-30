import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';

export async function enableMocking() {
  if (import.meta.env.PROD) {
    return;
  }

  const { worker } = await import('./__mock__/instance.ts');

  return worker.start();
}

enableMocking().then(() => {
  ReactDOM.createRoot(document.getElementById('root')!).render(<App />);
});
