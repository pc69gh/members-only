import { useEffect, useState } from 'react';
import { useAccount, useConnect } from 'wagmi';
import { InjectedConnector } from 'wagmi/connectors/injected';

import { getTokenBalance } from '@/lib/zdk';

export const useHasLawbster = () => {
  const [hasLawbster, setHasLawbster] = useState(false);
  const { address, isConnected } = useAccount();
  const { connect } = useConnect({
    connector: new InjectedConnector(),
  });

  useEffect(() => {
    connect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!isConnected || !address) return;

    (async () => {
      const { tokens } = await getTokenBalance(address, [
        '0x0ef7ba09c38624b8e9cc4985790a2f5dbfc1dc42',
      ]);

      if (tokens.nodes.length > 0) {
        setHasLawbster(true);
      }
    })();

    return () => {
      void 0;
    };
  }, [address, isConnected]);

  return hasLawbster;
};
