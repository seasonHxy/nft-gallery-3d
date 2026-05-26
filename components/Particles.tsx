"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { Points } from "three";
import { ROOM } from "./CyberRoom";

export function Particles({ count = 120 }: { count?: number }) {
  const ref = useRef<Points>(null);

  const { positions, speeds } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const speeds = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * (ROOM.WIDTH - 1);
      positions[i * 3 + 1] = Math.random() * ROOM.HEIGHT;
      positions[i * 3 + 2] = (Math.random() - 0.5) * (ROOM.LENGTH - 1);
      speeds[i] = 0.15 + Math.random() * 0.35;
    }
    return { positions, speeds };
  }, [count]);

  useFrame((_, dt) => {
    const points = ref.current;
    if (!points) return;
    const pos = points.geometry.attributes.position;
    const arr = pos.array as Float32Array;
    for (let i = 0; i < count; i++) {
      arr[i * 3 + 1] += speeds[i] * dt;
      if (arr[i * 3 + 1] > ROOM.HEIGHT) {
        arr[i * 3 + 1] = 0;
        arr[i * 3] = (Math.random() - 0.5) * (ROOM.WIDTH - 1);
        arr[i * 3 + 2] = (Math.random() - 0.5) * (ROOM.LENGTH - 1);
      }
    }
    pos.needsUpdate = true;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.035}
        color="#00f0ff"
        transparent
        opacity={0.7}
        sizeAttenuation
        toneMapped={false}
        depthWrite={false}
      />
    </points>
  );
}
