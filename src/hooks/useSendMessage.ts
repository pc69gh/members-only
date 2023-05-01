import { useUser } from '@auth0/nextjs-auth0/client';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { RefObject, useCallback } from 'react';

export const useSendMessage = (
  inputRef: RefObject<HTMLInputElement>,
  table: string,
  attachment: string | null
) => {
  const supabase = useSupabaseClient();
  const { user: auth0User, error, isLoading } = useUser();
  return useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!inputRef.current || error || isLoading) return;
      const inputValue = inputRef.current.value;
      inputRef.current.value = '';

      (async () => {
        const { error } = await supabase.from(table).insert([
          {
            content: inputValue,
            user_id: auth0User?.sub,
            address: auth0User?.nickname,
            attachment: attachment,
          },
        ]);
        if (error) {
          const code = error.code;
          if (code === 'PGRST301') {
            window.location.href = '/api/auth/logout';
          }
        }
      })();
    },
    [
      attachment,
      auth0User?.nickname,
      auth0User?.sub,
      error,
      inputRef,
      isLoading,
      supabase,
      table,
    ]
  );
};
