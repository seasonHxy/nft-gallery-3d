/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**.ipfs.nftstorage.link" },
      { protocol: "https", hostname: "ipfs.io" },
      { protocol: "https", hostname: "**.alchemyapi.io" },
      { protocol: "https", hostname: "nft-cdn.alchemy.com" },
      { protocol: "https", hostname: "**.cloudfront.net" },
      { protocol: "https", hostname: "i.seadn.io" },
    ],
  },
  transpilePackages: ["three"],
};

export default nextConfig;
