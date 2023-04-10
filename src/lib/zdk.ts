import {
  SortDirection,
  TokenSortKey,
  ZDK,
  ZDKChain,
  ZDKNetwork,
} from '@zoralabs/zdk';

const networkInfo = {
  network: ZDKNetwork.Ethereum,
  chain: ZDKChain.Mainnet,
};

const API_ENDPOINT = 'https://api.zora.co/graphql';

const zdk = new ZDK({
  endpoint: API_ENDPOINT,
  networks: [networkInfo],
});

export const getTokenBalance = async (owner: string, collections: string[]) => {
  const args = {
    where: {
      collectionAddresses: collections,
      ownerAddresses: [owner],
    },
    sort: {
      // Optional, sorts the response by ascending tokenIds
      direct: 'ASC',
      sortKey: 'TOKEN_ID' as TokenSortKey.TokenId,
      sortDirection: 'ASC' as SortDirection.Asc,
    },
    pagination: { limit: 3 }, // Optional, limits the response size to 3 NFTs
    includeFullDetails: false, // Optional, provides more data on the NFTs such as events
    includeSalesHistory: false, // Optional, provides sales data on the NFTs
  };

  return await zdk.tokens(args);
};
