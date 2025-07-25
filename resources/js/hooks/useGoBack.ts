// hooks/useGoBack.ts
import { router } from '@inertiajs/react';

const useGoBack = () => {
  const goBack = () => {
    if (window.history.length > 1) {
      window.history.back(); // pakai native browser
    } else {
      router.visit('/'); // fallback ke home
    }
  };

  return goBack;
};

export default useGoBack;
