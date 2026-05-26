"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import { Group, Mesh, Texture, TextureLoader } from "three";
import { useGallery } from "@/store/useGallery";
import type { NFT } from "@/types/nft";
import { ROOM } from "./CyberRoom";

const FRAME_Y = 2.3;
const INSET = 0.06;

type Slot = {
  pos: [number, number, number];
  rotY: number;
  accent: "cyan" | "magenta";
};

const SLOTS: Slot[] = [
  // North wall (z = -LENGTH/2), faces +Z
  { pos: [-5, FRAME_Y, -ROOM.LENGTH / 2 + INSET], rotY: 0, accent: "cyan" },
  { pos: [0, FRAME_Y, -ROOM.LENGTH / 2 + INSET], rotY: 0, accent: "magenta" },
  { pos: [5, FRAME_Y, -ROOM.LENGTH / 2 + INSET], rotY: 0, accent: "cyan" },
  // South wall (z = +LENGTH/2), faces -Z
  { pos: [-5, FRAME_Y, ROOM.LENGTH / 2 - INSET], rotY: Math.PI, accent: "magenta" },
  { pos: [0, FRAME_Y, ROOM.LENGTH / 2 - INSET], rotY: Math.PI, accent: "cyan" },
  { pos: [5, FRAME_Y, ROOM.LENGTH / 2 - INSET], rotY: Math.PI, accent: "magenta" },
  // East wall (x = +WIDTH/2), faces -X
  { pos: [ROOM.WIDTH / 2 - INSET, FRAME_Y, -7], rotY: -Math.PI / 2, accent: "cyan" },
  { pos: [ROOM.WIDTH / 2 - INSET, FRAME_Y, 0], rotY: -Math.PI / 2, accent: "magenta" },
  { pos: [ROOM.WIDTH / 2 - INSET, FRAME_Y, 7], rotY: -Math.PI / 2, accent: "cyan" },
  // West wall (x = -WIDTH/2), faces +X
  { pos: [-ROOM.WIDTH / 2 + INSET, FRAME_Y, -7], rotY: Math.PI / 2, accent: "magenta" },
  { pos: [-ROOM.WIDTH / 2 + INSET, FRAME_Y, 0], rotY: Math.PI / 2, accent: "cyan" },
  { pos: [-ROOM.WIDTH / 2 + INSET, FRAME_Y, 7], rotY: Math.PI / 2, accent: "magenta" },
];

export function Frames() {
  const nfts = useGallery((s) => s.nfts);
  return (
    <group>
      {nfts.slice(0, SLOTS.length).map((nft, i) => (
        <Frame key={nft.id} nft={nft} slot={SLOTS[i]} />
      ))}
    </group>
  );
}

function useTexture(url: string) {
  const [tex, setTex] = useState<Texture | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setTex(null);
    setFailed(false);
    const loader = new TextureLoader();
    loader.setCrossOrigin("anonymous");
    let cancelled = false;
    loader.load(
      url,
      (t) => {
        if (cancelled) return;
        t.anisotropy = 8;
        setTex(t);
      },
      undefined,
      () => {
        if (!cancelled) setFailed(true);
      }
    );
    return () => {
      cancelled = true;
    };
  }, [url]);

  return { tex, failed };
}

function Frame({ nft, slot }: { nft: NFT; slot: Slot }) {
  const setSelectedId = useGallery((s) => s.setSelectedId);
  const selectedId = useGallery((s) => s.selectedId);
  const isSelected = selectedId === nft.id;

  const [hovered, setHovered] = useState(false);
  const groupRef = useRef<Group>(null);
  const imageRef = useRef<Mesh>(null);

  const { tex, failed } = useTexture(nft.image);

  const accent = slot.accent === "cyan" ? "#00f0ff" : "#ff2ec4";
  const SIZE = 1.6;
  const BORDER_THICK = 0.05;

  useFrame((state) => {
    const g = groupRef.current;
    if (!g) return;
    const target = hovered || isSelected ? 1.06 : 1;
    g.scale.x += (target - g.scale.x) * 0.12;
    g.scale.y += (target - g.scale.y) * 0.12;
    g.scale.z += (target - g.scale.z) * 0.12;

    // Subtle bobbing — only on the frame relative to its slot, ignore for clarity
    // (kept static so it stays flush to the wall)
    // selected frames get a pulsing emissive — handled via material below
    const i = imageRef.current;
    if (i && (hovered || isSelected)) {
      const pulse = 1 + Math.sin(state.clock.elapsedTime * 4) * 0.05;
      i.scale.z = pulse;
    } else if (i) {
      i.scale.z = 1;
    }
  });

  const borders = useMemo(
    () => [
      { pos: [0, SIZE / 2 + BORDER_THICK / 2, 0.005], size: [SIZE + BORDER_THICK * 2, BORDER_THICK, 0.02] },
      { pos: [0, -SIZE / 2 - BORDER_THICK / 2, 0.005], size: [SIZE + BORDER_THICK * 2, BORDER_THICK, 0.02] },
      { pos: [-SIZE / 2 - BORDER_THICK / 2, 0, 0.005], size: [BORDER_THICK, SIZE, 0.02] },
      { pos: [SIZE / 2 + BORDER_THICK / 2, 0, 0.005], size: [BORDER_THICK, SIZE, 0.02] },
    ],
    []
  );

  return (
    <group ref={groupRef} position={slot.pos} rotation={[0, slot.rotY, 0]}>
      {/* Back panel */}
      <mesh position={[0, 0, -0.04]}>
        <boxGeometry args={[SIZE + 0.2, SIZE + 0.2, 0.06]} />
        <meshStandardMaterial color="#020308" roughness={0.5} metalness={0.6} />
      </mesh>

      {/* Image plane (clickable) */}
      <mesh
        ref={imageRef}
        position={[0, 0, 0.001]}
        onClick={(e) => {
          e.stopPropagation();
          setSelectedId(nft.id);
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          setHovered(false);
          document.body.style.cursor = "auto";
        }}
      >
        <planeGeometry args={[SIZE, SIZE]} />
        {tex ? (
          <meshBasicMaterial map={tex} toneMapped={false} />
        ) : (
          <meshBasicMaterial color={failed ? "#1a0b2e" : "#0a0e1c"} />
        )}
      </mesh>

      {/* Loading / failed overlay */}
      {!tex && (
        <Text
          position={[0, 0, 0.01]}
          fontSize={0.12}
          color={failed ? "#ff2ec4" : "#00f0ff"}
          anchorX="center"
          anchorY="middle"
        >
          {failed ? "// SIGNAL LOST" : "// LOADING..."}
        </Text>
      )}

      {/* Neon border */}
      {borders.map((b, i) => (
        <mesh key={i} position={b.pos as [number, number, number]}>
          <boxGeometry args={b.size as [number, number, number]} />
          <meshBasicMaterial color={accent} toneMapped={false} />
        </mesh>
      ))}

      {/* Label below frame */}
      <Text
        position={[0, -SIZE / 2 - 0.22, 0.02]}
        fontSize={0.1}
        color={accent}
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.005}
        outlineColor="#000"
      >
        {nft.name.slice(0, 28).toUpperCase()}
      </Text>
      <Text
        position={[0, -SIZE / 2 - 0.35, 0.02]}
        fontSize={0.06}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.003}
        outlineColor="#000"
      >
        {nft.collection.slice(0, 32)}
      </Text>
    </group>
  );
}
