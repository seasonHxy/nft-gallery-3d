"use client";

import { Grid } from "@react-three/drei";

export function NeonFloor() {
  return (
    <group>
      <mesh position={[0, -0.001, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[60, 60]} />
        <meshStandardMaterial color="#02030a" roughness={0.25} metalness={0.85} />
      </mesh>

      <Grid
        position={[0, 0.002, 0]}
        args={[60, 60]}
        cellSize={1}
        cellThickness={0.6}
        cellColor="#0e2a4e"
        sectionSize={4}
        sectionThickness={1.3}
        sectionColor="#00f0ff"
        fadeDistance={30}
        fadeStrength={1.2}
        followCamera={false}
        infiniteGrid
      />
    </group>
  );
}
