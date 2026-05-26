"use client";

import { Canvas } from "@react-three/fiber";
import { Environment, Preload } from "@react-three/drei";
import { EffectComposer, Bloom, Vignette, ChromaticAberration } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import { Vector2 } from "three";
import { Suspense } from "react";

import { CyberRoom } from "./CyberRoom";
import { NeonFloor } from "./NeonFloor";
import { Particles } from "./Particles";
import { Frames } from "./NFTFrame";
import { Controls } from "./Controls";

export function Gallery() {
  return (
    <div className="absolute inset-0">
      <Canvas
        dpr={[1, 1.75]}
        gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
        camera={{ position: [0, 1.6, 6], fov: 60, near: 0.1, far: 100 }}
        shadows={false}
      >
        <color attach="background" args={["#05060d"]} />
        <fog attach="fog" args={["#05060d", 10, 30]} />

        {/* Lights — bare minimum, the room is mostly emissive */}
        <ambientLight intensity={0.25} />
        <pointLight position={[0, 4, 0]} intensity={1.2} color="#00f0ff" distance={20} decay={2} />
        <pointLight position={[-8, 3, -8]} intensity={0.8} color="#ff2ec4" distance={18} decay={2} />
        <pointLight position={[8, 3, 8]} intensity={0.8} color="#8b5cf6" distance={18} decay={2} />

        <Suspense fallback={null}>
          <Environment preset="night" />
          <CyberRoom />
          <NeonFloor />
          <Particles count={120} />
          <Frames />
          <Preload all />
        </Suspense>

        <Controls />

        <EffectComposer multisampling={0}>
          <Bloom
            intensity={0.9}
            luminanceThreshold={0.15}
            luminanceSmoothing={0.5}
            mipmapBlur
          />
          <ChromaticAberration
            offset={new Vector2(0.0008, 0.0008)}
            radialModulation={false}
            modulationOffset={0}
            blendFunction={BlendFunction.NORMAL}
          />
          <Vignette eskil={false} offset={0.2} darkness={0.85} />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
