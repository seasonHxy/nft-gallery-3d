import type { NFT } from "@/types/nft";

type AlchemyNft = {
  contract?: { address?: string; name?: string };
  contractMetadata?: { name?: string };
  tokenId?: string;
  id?: { tokenId?: string };
  name?: string;
  title?: string;
  description?: string;
  image?: { cachedUrl?: string; originalUrl?: string; thumbnailUrl?: string };
  media?: { gateway?: string; thumbnail?: string }[];
  raw?: { metadata?: { image?: string; description?: string; attributes?: { trait_type: string; value: string }[] } };
  metadata?: { image?: string; description?: string; attributes?: { trait_type: string; value: string }[] };
};

function normalizeImage(raw: string | undefined): string | undefined {
  if (!raw) return undefined;
  if (raw.startsWith("ipfs://")) {
    return `https://ipfs.io/ipfs/${raw.slice(7)}`;
  }
  return raw;
}

function toNft(n: AlchemyNft, idx: number): NFT | null {
  const image =
    normalizeImage(n.image?.cachedUrl) ??
    normalizeImage(n.image?.originalUrl) ??
    normalizeImage(n.media?.[0]?.gateway) ??
    normalizeImage(n.raw?.metadata?.image) ??
    normalizeImage(n.metadata?.image);
  if (!image) return null;

  const tokenId = n.tokenId ?? n.id?.tokenId ?? String(idx);
  const contract = n.contract?.address;
  const name = n.name ?? n.title ?? `#${tokenId}`;
  const collection = n.contract?.name ?? n.contractMetadata?.name ?? "Unknown";
  const traits = n.raw?.metadata?.attributes ?? n.metadata?.attributes;

  return {
    id: `${contract ?? "x"}-${tokenId}`,
    name,
    collection,
    image,
    description: n.description ?? n.raw?.metadata?.description ?? n.metadata?.description,
    tokenId,
    contract,
    traits: traits?.slice(0, 6),
  };
}

export async function fetchAlchemyNfts(owner: string, limit = 12): Promise<NFT[]> {
  const key = process.env.ALCHEMY_API_KEY;
  const network = process.env.ALCHEMY_NETWORK ?? "eth-mainnet";
  if (!key) throw new Error("ALCHEMY_API_KEY is not set");

  const url = new URL(`https://${network}.g.alchemy.com/nft/v3/${key}/getNFTsForOwner`);
  url.searchParams.set("owner", owner);
  url.searchParams.set("withMetadata", "true");
  url.searchParams.set("pageSize", String(Math.min(limit, 100)));

  const res = await fetch(url.toString(), { next: { revalidate: 60 } });
  if (!res.ok) {
    throw new Error(`Alchemy ${res.status}: ${await res.text()}`);
  }
  const data = (await res.json()) as { ownedNfts?: AlchemyNft[] };
  return (data.ownedNfts ?? [])
    .map(toNft)
    .filter((x): x is NFT => x !== null)
    .slice(0, limit);
}
