import { useEffect, useState } from 'react';
import { useAccount, useConnect } from 'wagmi';
import { InjectedConnector } from 'wagmi/connectors/injected';

import { getTokenBalance } from '@/lib/zdk';

export const useHasBread = () => {
  const [hasBread, setHasBread] = useState(false);
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
        '0x135c4e5e427ebed0f8bf7966cec4117b1cae2137',
        '0x48ba3ba473a8557496d62e349993b8b00c8041fb',
      ]);

      if (tokens.nodes.length > 0) {
        setHasBread(true);
      }
    })();

    return () => {
      void 0;
    };
  }, [address, isConnected]);

  return hasBread;
};
