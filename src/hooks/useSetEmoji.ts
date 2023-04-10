import { RefObject, useCallback } from 'react';

export const useSetEmoji = (inputRef: RefObject<HTMLInputElement>) => {
  const setEmoji = useCallback(
    (emoji: string) => {
      if (!inputRef.current) return;

      inputRef.current.value += `:${emoji}:`;
    },
    [inputRef]
  );
  return setEmoji;
};
