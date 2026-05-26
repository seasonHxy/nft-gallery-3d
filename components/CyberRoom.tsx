"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Mesh } from "three";

const WIDTH = 16;
const LENGTH = 24;
const HEIGHT = 5;

export const ROOM = { WIDTH, LENGTH, HEIGHT };

export function CyberRoom() {
  return (
    <group>
      <Ceiling />

      {/* Four walls */}
      <Wall position={[0, HEIGHT / 2, -LENGTH / 2]} args={[WIDTH, HEIGHT]} rotY={0} />
      <Wall position={[0, HEIGHT / 2, LENGTH / 2]} args={[WIDTH, HEIGHT]} rotY={Math.PI} />
      <Wall position={[WIDTH / 2, HEIGHT / 2, 0]} args={[LENGTH, HEIGHT]} rotY={-Math.PI / 2} />
      <Wall position={[-WIDTH / 2, HEIGHT / 2, 0]} args={[LENGTH, HEIGHT]} rotY={Math.PI / 2} />

      {/* Wall vertical accent strips (between frame positions on long walls) */}
      <VerticalStrips />

      {/* Top & bottom neon rings */}
      <NeonRing y={HEIGHT - 0.04} color="#00f0ff" />
      <NeonRing y={0.04} color="#ff2ec4" />

      {/* Corner pillars */}
      <CornerPillar x={-WIDTH / 2 + 0.08} z={-LENGTH / 2 + 0.08} color="#00f0ff" />
      <CornerPillar x={WIDTH / 2 - 0.08} z={-LENGTH / 2 + 0.08} color="#00f0ff" />
      <CornerPillar x={-WIDTH / 2 + 0.08} z={LENGTH / 2 - 0.08} color="#ff2ec4" />
      <CornerPillar x={WIDTH / 2 - 0.08} z={LENGTH / 2 - 0.08} color="#ff2ec4" />

      <CenterHologram />
    </group>
  );
}

function Wall({
  position,
  args,
  rotY,
}: {
  position: [number, number, number];
  args: [number, number];
  rotY: number;
}) {
  return (
    <mesh position={position} rotation={[0, rotY, 0]}>
      <planeGeometry args={args} />
      <meshStandardMaterial color="#0a0e1c" roughness={0.45} metalness={0.7} />
    </mesh>
  );
}

function Ceiling() {
  return (
    <mesh position={[0, HEIGHT, 0]} rotation={[Math.PI / 2, 0, 0]}>
      <planeGeometry args={[WIDTH, LENGTH]} />
      <meshStandardMaterial color="#06080f" roughness={0.95} metalness={0.2} />
    </mesh>
  );
}

function NeonRing({ y, color }: { y: number; color: string }) {
  const thick = 0.05;
  return (
    <group position={[0, y, 0]}>
      <mesh position={[0, 0, -LENGTH / 2 + 0.02]}>
        <boxGeometry args={[WIDTH, thick, thick]} />
        <meshBasicMaterial color={color} toneMapped={false} />
      </mesh>
      <mesh position={[0, 0, LENGTH / 2 - 0.02]}>
        <boxGeometry args={[WIDTH, thick, thick]} />
        <meshBasicMaterial color={color} toneMapped={false} />
      </mesh>
      <mesh position={[-WIDTH / 2 + 0.02, 0, 0]}>
        <boxGeometry args={[thick, thick, LENGTH]} />
        <meshBasicMaterial color={color} toneMapped={false} />
      </mesh>
      <mesh position={[WIDTH / 2 - 0.02, 0, 0]}>
        <boxGeometry args={[thick, thick, LENGTH]} />
        <meshBasicMaterial color={color} toneMapped={false} />
      </mesh>
    </group>
  );
}

function CornerPillar({ x, z, color }: { x: number; z: number; color: string }) {
  return (
    <mesh position={[x, HEIGHT / 2, z]}>
      <boxGeometry args={[0.06, HEIGHT, 0.06]} />
      <meshBasicMaterial color={color} toneMapped={false} />
    </mesh>
  );
}

function VerticalStrips() {
  // strips between frame positions on east/west walls (z = ±3.5)
  const zs = [-3.5, 3.5];
  const xPairs: [number, string][] = [
    [WIDTH / 2 - 0.03, "#ff2ec4"],
    [-WIDTH / 2 + 0.03, "#00f0ff"],
  ];
  return (
    <group>
      {xPairs.flatMap(([x, color]) =>
        zs.map((z) => (
          <mesh key={`${x}-${z}`} position={[x, HEIGHT / 2, z]}>
            <boxGeometry args={[0.03, HEIGHT - 0.4, 0.03]} />
            <meshBasicMaterial color={color} toneMapped={false} />
          </mesh>
        ))
      )}
    </group>
  );
}

function CenterHologram() {
  const ref = useRef<Mesh>(null);
  const innerRef = useRef<Mesh>(null);

  useFrame((state, dt) => {
    if (ref.current) {
      ref.current.rotation.y += dt * 0.35;
      ref.current.rotation.x += dt * 0.15;
      ref.current.position.y = 2.6 + Math.sin(state.clock.elapsedTime * 0.8) * 0.12;
    }
    if (innerRef.current) {
      innerRef.current.rotation.y -= dt * 0.7;
      innerRef.current.rotation.z += dt * 0.3;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* Pedestal */}
      <mesh position={[0, 0.05, 0]}>
        <cylinderGeometry args={[0.7, 0.85, 0.1, 32]} />
        <meshStandardMaterial color="#0a0e1c" roughness={0.3} metalness={0.9} />
      </mesh>
      <mesh position={[0, 0.105, 0]}>
        <torusGeometry args={[0.72, 0.012, 8, 64]} />
        <meshBasicMaterial color="#00f0ff" toneMapped={false} />
      </mesh>

      {/* Outer wireframe icosahedron */}
      <mesh ref={ref} position={[0, 2.6, 0]}>
        <icosahedronGeometry args={[0.6, 0]} />
        <meshBasicMaterial color="#00f0ff" wireframe toneMapped={false} />
      </mesh>

      {/* Inner solid icosahedron */}
      <mesh ref={innerRef} position={[0, 2.6, 0]}>
        <icosahedronGeometry args={[0.35, 0]} />
        <meshBasicMaterial color="#ff2ec4" wireframe toneMapped={false} />
      </mesh>

      {/* Holographic beam from pedestal */}
      <mesh position={[0, 1.4, 0]}>
        <cylinderGeometry args={[0.05, 0.4, 2.4, 24, 1, true]} />
        <meshBasicMaterial
          color="#00f0ff"
          transparent
          opacity={0.05}
          toneMapped={false}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}
