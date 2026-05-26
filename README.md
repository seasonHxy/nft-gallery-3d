# NEON VAULT — 3D NFT Gallery

A cyberpunk 3D walkthrough gallery for NFTs. Built with **Next.js 14 + React Three Fiber + Alchemy NFT API**. Designed to deploy to **Vercel** in one click.

![preview placeholder](public/preview.png)

## Features

- **Procedural cyber room** — code-generated, no GLB downloads needed: dark panels, neon cornices, vertical light strips, holographic centerpiece
- **12 NFT frames** on 4 walls with emissive cyan/magenta borders
- **Orbit & Walk modes** — `Orbit` for an overview, `Walk` (WASD + mouse, pointer-lock) for first-person
- **Alchemy NFT API** — paste any ETH address (mainnet/Base/Polygon/Arb/OP) to load that wallet's NFTs; auto-falls back to mock data if the key is missing or the wallet is empty
- **Postprocessing** — Bloom + Chromatic Aberration + Vignette for the synthwave look
- **Edge runtime API route** — fast, cacheable, key stays server-side

## Stack

| Layer | Library |
|---|---|
| Framework | Next.js 14 (App Router) |
| 3D | three.js + @react-three/fiber + @react-three/drei |
| FX | @react-three/postprocessing |
| State | Zustand |
| Style | Tailwind CSS |
| Data | Alchemy NFT API v3 |

## Quick start

```bash
pnpm install        # or: npm install
cp .env.example .env.local
# fill ALCHEMY_API_KEY — free at https://dashboard.alchemy.com/
pnpm dev            # http://localhost:3000
```

Without an API key, the app runs on mock data (picsum.photos placeholders).

## Environment variables

| Key | Required | Default | Note |
|---|---|---|---|
| `ALCHEMY_API_KEY` | optional | — | Without it, the API route returns mock data |
| `ALCHEMY_NETWORK` | optional | `eth-mainnet` | `eth-mainnet` / `base-mainnet` / `polygon-mainnet` / `arb-mainnet` / `opt-mainnet` |
| `NEXT_PUBLIC_DEFAULT_OWNER` | optional | — | Address to pre-load on first paint |

## Deploy to Vercel

1. Push this repo to GitHub.
2. Import the repo at [vercel.com/new](https://vercel.com/new).
3. Add `ALCHEMY_API_KEY` (and optionally `ALCHEMY_NETWORK`, `NEXT_PUBLIC_DEFAULT_OWNER`) under **Project → Settings → Environment Variables**.
4. Hit Deploy. No build settings to change.

```bash
# Or via CLI:
npx vercel
npx vercel --prod
```

## Project structure

```
app/
  layout.tsx              # root
  page.tsx                # entry, mounts Canvas + HUD + DetailPanel
  globals.css             # cyber theme tokens + scanline overlay
  api/nfts/route.ts       # edge route, proxies Alchemy or returns mock
components/
  Gallery.tsx             # <Canvas> + lights + fog + postprocessing
  CyberRoom.tsx           # procedural walls / ceiling / pillars / hologram
  NeonFloor.tsx           # tron-like grid floor
  NFTFrame.tsx            # picture frame component + 12-slot wall map
  Particles.tsx           # rising dust points
  Controls.tsx            # Orbit + PointerLock with WASD walking
  HUD.tsx                 # top header, address search, mode toggle
  DetailPanel.tsx         # right-side info panel
lib/
  alchemy.ts              # NFT API client + normalizer
  utils.ts                # cn + shortAddr helpers
data/mockNfts.ts          # fallback set of 12
store/useGallery.ts       # zustand store
types/nft.ts
```

## Customization

- **Add/move frames** — edit the `SLOTS` array in `components/NFTFrame.tsx`
- **Change colors** — `tailwind.config.ts` (`cyber.*`) and the `accent` colors inside each 3D component
- **Add a real GLB room** — drop a `.glb` in `public/`, swap `<CyberRoom />` for `useGLTF("/room.glb")` from drei, name your frame anchors as Empties in Blender and walk the scene to find them
- **Replace Alchemy** — swap `lib/alchemy.ts` for any provider that returns `{ image, name, collection }`

## Performance notes

- `dpr={[1, 1.75]}` caps DPR on retina to stay smooth on M1 Air-class hardware
- All neon surfaces use `meshBasicMaterial color={…} toneMapped={false}` so Bloom picks them up cheaply
- Particle count = 120; bump down to ~50 for mobile if needed
- Textures are loaded with `crossOrigin="anonymous"` via TextureLoader and gracefully degrade to a `// SIGNAL LOST` placeholder on failure

## License

MIT. Mock images via [Lorem Picsum](https://picsum.photos/).
