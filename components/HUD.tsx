"use client";

import { useEffect, useState } from "react";
import { Eye, Footprints, Loader2, Search } from "lucide-react";
import { useGallery } from "@/store/useGallery";
import { cn, shortAddr } from "@/lib/utils";

export function HUD() {
  const owner = useGallery((s) => s.owner);
  const setOwner = useGallery((s) => s.setOwner);
  const setNfts = useGallery((s) => s.setNfts);
  const source = useGallery((s) => s.source);
  const controlMode = useGallery((s) => s.controlMode);
  const setControlMode = useGallery((s) => s.setControlMode);
  const locked = useGallery((s) => s.locked);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);

  const load = async (addr?: string) => {
    setLoading(true);
    try {
      const url = addr ? `/api/nfts?owner=${encodeURIComponent(addr)}` : "/api/nfts";
      const res = await fetch(url);
      const data = (await res.json()) as {
        nfts: { id: string; name: string; collection: string; image: string }[];
        source: "mock" | "alchemy";
      };
      setNfts(data.nfts as never[], data.source);
      if (addr) setOwner(addr);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const def = process.env.NEXT_PUBLIC_DEFAULT_OWNER;
    void load(def);
  }, []);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const v = input.trim();
    if (!v) return;
    void load(v);
  };

  return (
    <>
      <header className="pointer-events-none fixed inset-x-0 top-0 z-40 flex items-start justify-between p-4">
        <div className="pointer-events-auto cyber-panel cyber-corner rounded-md px-4 py-3 font-mono text-xs">
          <div className="neon-text text-[10px] uppercase tracking-[0.3em]">// Neon Vault</div>
          <div className="mt-1 text-cyber-cyan text-base font-semibold tracking-wider">
            3D NFT GALLERY
          </div>
          <div className="mt-1 text-white/50">
            {loading ? (
              <span className="inline-flex items-center gap-1.5">
                <Loader2 className="h-3 w-3 animate-spin" />
                booting modules…
              </span>
            ) : (
              <span>
                <span className="text-cyber-magenta">{source.toUpperCase()}</span>
                {owner ? <span className="ml-2 text-white/40">owner: {shortAddr(owner)}</span> : null}
              </span>
            )}
          </div>
        </div>

        <form
          onSubmit={onSubmit}
          className="pointer-events-auto cyber-panel cyber-corner flex items-center gap-2 rounded-md px-3 py-2 font-mono text-xs"
        >
          <Search className="h-4 w-4 text-cyber-cyan" />
          <input
            type="text"
            placeholder="0x… address or .eth"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-64 bg-transparent text-white placeholder:text-white/30 focus:outline-none"
          />
          <button
            type="submit"
            className="rounded border border-cyber-cyan/40 px-2 py-0.5 text-[10px] uppercase tracking-widest text-cyber-cyan hover:bg-cyber-cyan/10"
          >
            ENTER
          </button>
        </form>
      </header>

      {/* control mode switch */}
      <footer className="pointer-events-none fixed inset-x-0 bottom-0 z-40 flex items-end justify-between p-4">
        <div className="pointer-events-auto cyber-panel cyber-corner flex gap-1 rounded-md p-1 font-mono text-[10px] uppercase tracking-widest">
          <button
            onClick={() => setControlMode("orbit")}
            className={cn(
              "flex items-center gap-1.5 rounded px-3 py-1.5 transition",
              controlMode === "orbit"
                ? "bg-cyber-cyan/15 text-cyber-cyan"
                : "text-white/40 hover:text-white/70"
            )}
          >
            <Eye className="h-3 w-3" />
            Orbit
          </button>
          <button
            onClick={() => setControlMode("fps")}
            className={cn(
              "flex items-center gap-1.5 rounded px-3 py-1.5 transition",
              controlMode === "fps"
                ? "bg-cyber-magenta/15 text-cyber-magenta"
                : "text-white/40 hover:text-white/70"
            )}
          >
            <Footprints className="h-3 w-3" />
            Walk
          </button>
        </div>

        <div className="pointer-events-none cyber-panel cyber-corner rounded-md px-3 py-2 font-mono text-[10px] uppercase tracking-widest text-white/40">
          {controlMode === "orbit"
            ? "DRAG to look · SCROLL to zoom · CLICK frame for details"
            : locked
            ? "WASD move · MOUSE look · ESC to release"
            : "CLICK the scene to lock pointer · WASD to walk"}
        </div>
      </footer>

      {controlMode === "fps" && locked && <div className="crosshair" />}
    </>
  );
}
