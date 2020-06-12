import { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

function useListenPath() {
  const [path, setPath] = useState('');
  const { listen } = useHistory();

  useEffect(() => {
    listen(({ pathname }) => {
      window.scrollTo(0, 0);
      setPath(pathname);
    });
  }, [path, listen]);

  return [path];
}

export default useListenPath;
