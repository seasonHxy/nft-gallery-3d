import { Gallery } from "@/components/Gallery";
import { HUD } from "@/components/HUD";
import { DetailPanel } from "@/components/DetailPanel";

export default function Page() {
  return (
    <main className="relative h-screen w-screen overflow-hidden bg-cyber-bg">
      <Gallery />
      <HUD />
      <DetailPanel />
      <div className="scanline" />
    </main>
  );
}
