import { useUser } from '@auth0/nextjs-auth0/client';
import { useEffect, useState } from 'react';
import { useAccount, useConnect } from 'wagmi';
import { InjectedConnector } from 'wagmi/connectors/injected';

import { getTokenBalance } from '@/lib/zdk';

export const useHasLobster = () => {
  const [gotLawb, tellMeYouGotsLawb] = useState(false);
  const { address, isConnected } = useAccount();
  const { user: auth0User, error, isLoading } = useUser();
  const { connect } = useConnect({
    connector: new InjectedConnector(),
  });

  useEffect(() => {
    connect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    (async () => {
      if (error || isLoading || !auth0User || !auth0User.nickname) return;
      const { tokens } = await getTokenBalance(auth0User.nickname, [
        '0x0ef7bA09C38624b8E9cc4985790a2f5dBFc1dC42',
      ]);

      if (tokens.nodes.length > 0) {
        tellMeYouGotsLawb(true);
      }
    })();

    return () => {
      void 0;
    };
  }, [address, auth0User, error, isConnected, isLoading]);

  return gotLawb;
};
