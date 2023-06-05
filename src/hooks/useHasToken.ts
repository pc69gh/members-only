import { useUser } from '@auth0/nextjs-auth0/client';
import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';

import { getTokenBalance } from '@/lib/zdk';

export const useHasToken = (token: string | string[]) => {
  const [hasToken, setHasToken] = useState(false);
  const { address, isConnected } = useAccount();
  const { user } = useUser();

  useEffect(() => {
    if (!user || !user.nickname) return;

    (async () => {
      const { tokens } = await getTokenBalance(
        user.nickname as string,
        Array.isArray(token) ? token : [token]
      );

      if (tokens.nodes.length > 0) {
        setHasToken(true);
      }
    })();

    return () => {
      void 0;
    };
  }, [address, isConnected, user, token]);

  return hasToken;
};
