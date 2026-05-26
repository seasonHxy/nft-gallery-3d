import { NextResponse } from "next/server";
import { fetchAlchemyNfts } from "@/lib/alchemy";
import { MOCK_NFTS } from "@/data/mockNfts";

export const runtime = "edge";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const owner = searchParams.get("owner")?.trim();

  if (!owner) {
    return NextResponse.json({ source: "mock", nfts: MOCK_NFTS });
  }

  if (!process.env.ALCHEMY_API_KEY) {
    return NextResponse.json({
      source: "mock",
      reason: "ALCHEMY_API_KEY not configured",
      nfts: MOCK_NFTS,
    });
  }

  try {
    const nfts = await fetchAlchemyNfts(owner, 12);
    if (nfts.length === 0) {
      return NextResponse.json({ source: "alchemy", nfts: MOCK_NFTS, reason: "owner has 0 nfts, showing mock" });
    }
    return NextResponse.json({ source: "alchemy", nfts });
  } catch (e) {
    return NextResponse.json({
      source: "mock",
      reason: e instanceof Error ? e.message : "unknown error",
      nfts: MOCK_NFTS,
    });
  }
}
