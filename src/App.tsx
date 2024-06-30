import { useEffect } from 'react';

export default function App() {
  useEffect(() => {
    fetch('https://example.com/user')
      .then((response) => response.json())
      .then((response) => {
        console.log(response);
      });
  }, []);

  return <main>hihi</main>;
}
