import { RefObject, useCallback } from 'react';

export const useSendMessage = (inputRef: RefObject<HTMLInputElement>) => {
  return useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!inputRef.current) return;
      const inputValue = inputRef.current.value;
      inputRef.current.value = '';

      (async () => {
        const resp = await fetch('/api/message/send', {
          method: 'POST',
          body: JSON.stringify({
            message: inputValue,
          }),
        });
        if (!resp.ok) {
          const reader = resp.body?.getReader();
          if (reader) {
            const { value } = await reader.read();
            const decoder = new TextDecoder('utf-8');
            const val = decoder.decode(value);
            const code = JSON.parse(val).code;
            if (code === 'PGRST301') {
              window.location.href = '/api/auth/logout';
            }
          }
        }
      })();
    },
    [inputRef]
  );
};
