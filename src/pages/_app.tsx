import { UserProvider } from '@auth0/nextjs-auth0/client';
import { getDefaultProvider } from 'ethers';
import { AppProps } from 'next/app';
import { CookiesProvider } from 'react-cookie';
import { createClient, WagmiConfig } from 'wagmi';

const client = createClient({
  autoConnect: true,
  provider: getDefaultProvider(),
});

import '@/styles/globals.css';
// !STARTERCONF This is for demo purposes, remove @/styles/colors.css import immediately
import '@/styles/colors.css';

/**
 * !STARTERCONF info
 * ? `Layout` component is called in every page using `np` snippets. If you have consistent layout across all page, you can add it here too
 */

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <CookiesProvider>
      <WagmiConfig client={client}>
        <UserProvider>
          <Component {...pageProps} />
        </UserProvider>
      </WagmiConfig>
    </CookiesProvider>
  );
}

export default MyApp;
