import type { NFT } from "@/types/nft";

const placeholder = (seed: string) =>
  `https://picsum.photos/seed/${encodeURIComponent(seed)}/640/640`;

export const MOCK_NFTS: NFT[] = [
  { id: "01", name: "Neon Specter #001", collection: "Neon Specters", image: placeholder("neon-1"), description: "A wandering soul through the synthwave streets.", traits: [{ trait_type: "Rarity", value: "Legendary" }, { trait_type: "Aura", value: "Cyan" }] },
  { id: "02", name: "Chrome Samurai", collection: "Edge Runners", image: placeholder("chrome-2"), description: "Blade forged from neon and code.", traits: [{ trait_type: "Class", value: "Samurai" }, { trait_type: "Aura", value: "Magenta" }] },
  { id: "03", name: "Glitch Doll", collection: "ERR0R", image: placeholder("glitch-3"), description: "Reality.exe has stopped responding.", traits: [{ trait_type: "Glitch", value: "High" }] },
  { id: "04", name: "Void Walker", collection: "Edge Runners", image: placeholder("void-4"), description: "She walks where signal cannot reach.", traits: [{ trait_type: "Class", value: "Walker" }] },
  { id: "05", name: "Hologirl #777", collection: "Hologirls", image: placeholder("holo-5"), description: "Projected love, infinite recursion.", traits: [{ trait_type: "Series", value: "777" }] },
  { id: "06", name: "Neuro Mask", collection: "Wires", image: placeholder("mask-6"), description: "Wear the bandwidth.", traits: [{ trait_type: "Type", value: "Mask" }] },
  { id: "07", name: "Replicant 12", collection: "Replicants", image: placeholder("rep-7"), description: "More human than human.", traits: [{ trait_type: "Generation", value: "12" }] },
  { id: "08", name: "Synth Cat", collection: "PetNet", image: placeholder("cat-8"), description: "Purrs in binary.", traits: [{ trait_type: "Species", value: "Cat" }] },
  { id: "09", name: "Megacity Skyline", collection: "Worlds", image: placeholder("city-9"), description: "Forever night, forever lit.", traits: [{ trait_type: "Scene", value: "City" }] },
  { id: "10", name: "Datastream", collection: "Worlds", image: placeholder("data-10"), description: "Every drop a transaction.", traits: [{ trait_type: "Scene", value: "Rain" }] },
  { id: "11", name: "Hex Demon", collection: "ERR0R", image: placeholder("demon-11"), description: "Summoned at line 666.", traits: [{ trait_type: "Type", value: "Demon" }] },
  { id: "12", name: "Iris Lens", collection: "Optics", image: placeholder("iris-12"), description: "Sees what isn't there.", traits: [{ trait_type: "Type", value: "Lens" }] },
];
