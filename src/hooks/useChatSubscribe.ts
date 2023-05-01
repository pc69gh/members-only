import { useSupabaseClient } from '@supabase/auth-helpers-react';
import React, { useEffect } from 'react';

export type Message = {
  user: string;
  message: string;
  attachment: string | null;
};

export const useChatSubscribe = (chat: string, auth0Token: string) => {
  const supabase = useSupabaseClient();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [rows, setRows] = React.useState<Message[]>([]);

  useEffect(() => {
    (async () => {
      const all = await supabase.from(chat).select('*');
      if (all.data) {
        setRows(
          all.data.map((row) => ({
            user: row.address,
            message: row.content,
            attachment: row.attachment,
          }))
        );
      }
      const channel = supabase.channel('custom-insert-channel');
      channel.socket.accessToken = auth0Token;
      channel
        .on(
          'postgres_changes',
          { event: 'INSERT', schema: 'public', table: chat },
          (payload) => {
            if (payload.new) {
              setRows((prev) => [
                ...prev,
                {
                  user: payload.new.address,
                  message: payload.new.content,
                  attachment: payload.new.attachment,
                },
              ]);
            }
          }
        )
        .subscribe();
    })();
  }, [auth0Token, chat, supabase]);

  return { rows };
};
