export type NFT = {
  id: string;
  name: string;
  collection: string;
  image: string;
  description?: string;
  tokenId?: string;
  contract?: string;
  owner?: string;
  traits?: { trait_type: string; value: string }[];
};
