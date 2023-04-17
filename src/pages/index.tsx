import {
  Claims,
  getSession,
  Session,
  withPageAuthRequired,
} from '@auth0/nextjs-auth0';
import React, { useEffect } from 'react';
import { styleReset } from 'react95';
// original Windows95 font (optionally)
import ms_sans_serif from 'react95/dist/fonts/ms_sans_serif.woff2';
import ms_sans_serif_bold from 'react95/dist/fonts/ms_sans_serif_bold.woff2';
// pick a theme of your choice
import original from 'react95/dist/themes/original';
import { createGlobalStyle, ThemeProvider } from 'styled-components';
import { getSupabase } from 'utils/supabase';

import { BSOD } from '@/components/BSOD';
import { Chat } from '@/components/chat/Chat';
import { MenuProvider } from '@/components/context/Menu';
import Layout from '@/components/layout/Layout';

const GlobalStyles = createGlobalStyle`
  ${styleReset}
  @font-face {
    font-family: 'ms_sans_serif';
    src: url('${ms_sans_serif}') format('woff2');
    font-weight: 400;
    font-style: normal
  }
  @font-face {
    font-family: 'ms_sans_serif';
    src: url('${ms_sans_serif_bold}') format('woff2');
    font-weight: bold;
    font-style: normal
  }
  body {
    font-family: 'ms_sans_serif';
  }
`;

const App = ({
  messages,
  user,
}: {
  messages: {
    user: string;
    message: string;
  }[];
  user: Claims;
}) => {
  const [rows, setRows] = React.useState(messages);

  const [error, setError] = React.useState<string>();

  useEffect(() => {
    if (!user.accessToken.userId) {
      setError('you have no $bread or $cinnabunz. please act accordingly.');
      return;
    }

    const supabase = getSupabase(user.accessToken);
    (async () => {
      const channel = supabase.channel('custom-insert-channel');
      channel.socket.accessToken = user.accessToken;
      channel
        .on(
          'postgres_changes',
          { event: 'INSERT', schema: 'public', table: 'messages' },
          (payload) => {
            if (payload.new) {
              setRows((prev) => [
                ...prev,
                {
                  user: payload.new.address,
                  message: payload.new.content,
                },
              ]);
            }
          }
        )
        .subscribe();
    })();
  }, [user.accessToken]);

  return (
    <MenuProvider>
      <GlobalStyles />
      <ThemeProvider theme={original}>
        {error ? (
          <BSOD message={error} />
        ) : (
          <Layout>
            <Chat messages={rows} />
          </Layout>
        )}
      </ThemeProvider>
    </MenuProvider>
  );
};

export const getServerSideProps = withPageAuthRequired({
  async getServerSideProps({ req, res }) {
    const session = (await getSession(req, res)) as Session;

    const supabase = getSupabase(session.user.accessToken);

    const all = await supabase.from('messages').select('*');

    if (!all.data) {
      return {
        props: {
          messages: [],
        },
      };
    }

    return {
      props: {
        messages: all.data?.map((row) => ({
          user: row.address,
          message: row.content,
        })),
      },
    };
  },
});

export default App;
