import {
  getSession,
  Session as Auth0Session,
  withPageAuthRequired,
} from '@auth0/nextjs-auth0';
import {
  Session as SubabaseSession,
  SessionContextProvider,
} from '@supabase/auth-helpers-react';
import { createClient } from '@supabase/supabase-js';
import jwt from 'jsonwebtoken';
import React from 'react';
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
  authorized,
  session,
  auth0Token,
}: {
  authorized: boolean;
  session: SubabaseSession;
  auth0Token: string;
}) => {
  const supabase = getSupabase(session?.access_token || '', auth0Token);

  return (
    <SessionContextProvider supabaseClient={supabase} initialSession={session}>
      <MenuProvider>
        <GlobalStyles />
        <ThemeProvider theme={original}>
          {!authorized ? (
            <BSOD message='you do not have a PC MIXTAPE.' />
          ) : (
            <Layout>
              <Chat type='mixtape' auth0Token={auth0Token} />
              {/* <Chat type='bread' /> */}
            </Layout>
          )}
        </ThemeProvider>
      </MenuProvider>
    </SessionContextProvider>
  );
};

export const getServerSideProps = withPageAuthRequired({
  async getServerSideProps({ req, res }) {
    const auth0Session = (await getSession(req, res)) as Auth0Session;
    const claims = jwt.decode(auth0Session.user.accessToken);
    const authorized = !!claims && !!(claims as jwt.JwtPayload).userId;

    const supabase = createClient(
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    let session;

    const signinResult = await supabase.auth.signInWithPassword({
      email: `${auth0Session.user.sub}@email.com`,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      password: process.env.SUPABASE_JWT_SECRET!,
    });

    if (signinResult.error) {
      const signupResult = await supabase.auth.signUp({
        email: `${auth0Session.user.sub}@email.com`,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        password: process.env.SUPABASE_JWT_SECRET!,
      });

      session = signupResult.data.session;
    } else {
      session = signinResult.data.session;
    }

    return {
      props: {
        authorized,
        session,
        auth0Token: auth0Session.user.accessToken,
      },
    };
  },
});

export default App;
