"use client";

import { create } from "zustand";
import type { NFT } from "@/types/nft";

type GalleryState = {
  nfts: NFT[];
  selectedId: string | null;
  source: "mock" | "alchemy" | "loading";
  owner: string;
  controlMode: "orbit" | "fps";
  locked: boolean;
  setNfts: (nfts: NFT[], source: "mock" | "alchemy") => void;
  setSelectedId: (id: string | null) => void;
  setOwner: (owner: string) => void;
  setControlMode: (mode: "orbit" | "fps") => void;
  setLocked: (v: boolean) => void;
};

export const useGallery = create<GalleryState>((set) => ({
  nfts: [],
  selectedId: null,
  source: "loading",
  owner: "",
  controlMode: "orbit",
  locked: false,
  setNfts: (nfts, source) => set({ nfts, source }),
  setSelectedId: (id) => set({ selectedId: id }),
  setOwner: (owner) => set({ owner }),
  setControlMode: (mode) => set({ controlMode: mode }),
  setLocked: (v) => set({ locked: v }),
}));

export const useSelectedNft = () => {
  const nfts = useGallery((s) => s.nfts);
  const id = useGallery((s) => s.selectedId);
  return nfts.find((n) => n.id === id) ?? null;
};
