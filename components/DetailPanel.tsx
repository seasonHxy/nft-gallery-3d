"use client";

import { X } from "lucide-react";
import { useGallery, useSelectedNft } from "@/store/useGallery";
import { cn } from "@/lib/utils";

export function DetailPanel() {
  const nft = useSelectedNft();
  const setSelectedId = useGallery((s) => s.setSelectedId);
  const open = !!nft;

  return (
    <aside
      className={cn(
        "fixed right-4 top-24 bottom-24 z-50 w-[360px] max-w-[90vw]",
        "transition-all duration-300",
        open ? "translate-x-0 opacity-100" : "translate-x-[110%] opacity-0 pointer-events-none"
      )}
    >
      <div className="cyber-panel cyber-corner relative flex h-full flex-col overflow-hidden rounded-md">
        <button
          onClick={() => setSelectedId(null)}
          className="absolute right-3 top-3 z-10 rounded border border-cyber-cyan/30 bg-black/40 p-1 text-cyber-cyan transition hover:bg-cyber-cyan/15"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>

        {nft && (
          <>
            <div className="relative aspect-square w-full overflow-hidden border-b border-cyber-cyan/20 bg-black">
              <img
                src={nft.image}
                alt={nft.name}
                className="h-full w-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.opacity = "0.2";
                }}
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-2 left-3 font-mono text-[10px] uppercase tracking-widest neon-text">
                ID · {nft.id.slice(0, 12)}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-5 font-mono text-sm">
              <div className="text-[10px] uppercase tracking-[0.3em] text-cyber-magenta">
                {nft.collection}
              </div>
              <h2 className="mt-1 text-xl font-semibold text-white">{nft.name}</h2>

              {nft.description && (
                <p className="mt-3 text-xs leading-relaxed text-white/60">{nft.description}</p>
              )}

              {nft.traits && nft.traits.length > 0 && (
                <div className="mt-5">
                  <div className="text-[10px] uppercase tracking-widest text-cyber-cyan/70">
                    // TRAITS
                  </div>
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    {nft.traits.map((t, i) => (
                      <div
                        key={i}
                        className="rounded border border-cyber-cyan/15 bg-black/30 p-2"
                      >
                        <div className="text-[9px] uppercase tracking-widest text-white/40">
                          {t.trait_type}
                        </div>
                        <div className="mt-0.5 text-xs text-cyber-cyan">{t.value}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {nft.contract && nft.tokenId && (
                <div className="mt-5 border-t border-cyber-cyan/10 pt-4 text-[10px] text-white/40">
                  <div>contract · {nft.contract}</div>
                  <div>token · #{nft.tokenId}</div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </aside>
  );
}
