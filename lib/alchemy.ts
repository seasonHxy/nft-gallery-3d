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

  // Over-fetch so we can survive items with missing images, but keep payload
  // under Next's 2MB fetch-cache limit (pranksy-style mega-wallets hit it fast).
  const fetchSize = Math.min(Math.max(limit * 2, 24), 30);

  const url = new URL(`https://${network}.g.alchemy.com/nft/v3/${key}/getNFTsForOwner`);
  url.searchParams.set("owner", owner);
  url.searchParams.set("withMetadata", "true");
  url.searchParams.set("pageSize", String(fetchSize));

  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 15_000);
  let res: Response;
  try {
    res = await fetch(url.toString(), {
      next: { revalidate: 60 },
      signal: ctrl.signal,
    });
  } finally {
    clearTimeout(timer);
  }
  if (!res.ok) {
    throw new Error(`Alchemy ${res.status}: ${await res.text()}`);
  }
  const data = (await res.json()) as { ownedNfts?: AlchemyNft[] };

  const valid = (data.ownedNfts ?? [])
    .map(toNft)
    .filter((x): x is NFT => x !== null);

  // De-duplicate by collection so 12 frames feel diverse instead of all the same collection
  const seenCollections = new Map<string, number>();
  const diverse: NFT[] = [];
  const leftovers: NFT[] = [];
  for (const nft of valid) {
    const c = nft.collection ?? "Unknown";
    const count = seenCollections.get(c) ?? 0;
    if (count < 2) {
      diverse.push(nft);
      seenCollections.set(c, count + 1);
    } else {
      leftovers.push(nft);
    }
    if (diverse.length >= limit) break;
  }
  // Top up with leftovers if diversity gave us fewer than limit
  const result = [...diverse, ...leftovers].slice(0, limit);
  return result;
}
