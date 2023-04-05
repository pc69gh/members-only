import { useUser } from '@auth0/nextjs-auth0/client';
import React from 'react';
import { styleReset } from 'react95';
// original Windows95 font (optionally)
import ms_sans_serif from 'react95/dist/fonts/ms_sans_serif.woff2';
import ms_sans_serif_bold from 'react95/dist/fonts/ms_sans_serif_bold.woff2';
// pick a theme of your choice
import original from 'react95/dist/themes/original';
import { createGlobalStyle, ThemeProvider } from 'styled-components';

import { Chat } from '@/components/Chat';
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

const App = () => {
  const { user, error, isLoading } = useUser();
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error.message}</div>;
  return (
    <MenuProvider>
      <GlobalStyles />
      <ThemeProvider theme={original}>
        <Layout>{user && <Chat />}</Layout>
      </ThemeProvider>
    </MenuProvider>
  );
};

export default App;
