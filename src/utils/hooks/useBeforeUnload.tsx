import { useEffect } from 'react';

export function useBeforeUnload(isDirty: boolean) {
  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (!isDirty) return;
      event.preventDefault();
      event.returnValue =
        'Your changes will not be saved if you leave the page.';
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    // Clean up event listener on component unmount
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isDirty]);
}
