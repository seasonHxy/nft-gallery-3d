"use client";

import { OrbitControls, PointerLockControls } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import { Vector3 } from "three";
import { useGallery } from "@/store/useGallery";
import { ROOM } from "./CyberRoom";

const WALK_SPEED = 4.5;
const EYE_HEIGHT = 1.6;

export function Controls() {
  const mode = useGallery((s) => s.controlMode);
  const setLocked = useGallery((s) => s.setLocked);
  const { camera } = useThree();

  const keys = useRef({ w: false, a: false, s: false, d: false });
  const forward = useRef(new Vector3());
  const right = useRef(new Vector3());
  const move = useRef(new Vector3());

  useEffect(() => {
    if (mode !== "fps") return;
    const onDown = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      if (k === "w" || k === "arrowup") keys.current.w = true;
      if (k === "a" || k === "arrowleft") keys.current.a = true;
      if (k === "s" || k === "arrowdown") keys.current.s = true;
      if (k === "d" || k === "arrowright") keys.current.d = true;
    };
    const onUp = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      if (k === "w" || k === "arrowup") keys.current.w = false;
      if (k === "a" || k === "arrowleft") keys.current.a = false;
      if (k === "s" || k === "arrowdown") keys.current.s = false;
      if (k === "d" || k === "arrowright") keys.current.d = false;
    };
    window.addEventListener("keydown", onDown);
    window.addEventListener("keyup", onUp);
    return () => {
      window.removeEventListener("keydown", onDown);
      window.removeEventListener("keyup", onUp);
      keys.current = { w: false, a: false, s: false, d: false };
    };
  }, [mode]);

  // Snap camera to walking position when entering FPS mode
  useEffect(() => {
    if (mode === "fps") {
      camera.position.set(0, EYE_HEIGHT, 6);
      camera.lookAt(0, EYE_HEIGHT, 0);
    } else {
      camera.position.set(0, 4, 12);
      camera.lookAt(0, 1.5, 0);
    }
  }, [mode, camera]);

  useFrame((_, dt) => {
    if (mode !== "fps") return;
    const k = keys.current;
    camera.getWorldDirection(forward.current);
    forward.current.y = 0;
    forward.current.normalize();
    right.current.crossVectors(forward.current, camera.up).normalize();

    move.current.set(0, 0, 0);
    if (k.w) move.current.add(forward.current);
    if (k.s) move.current.sub(forward.current);
    if (k.d) move.current.add(right.current);
    if (k.a) move.current.sub(right.current);

    if (move.current.lengthSq() > 0) {
      move.current.normalize().multiplyScalar(WALK_SPEED * dt);
      camera.position.add(move.current);
    }

    camera.position.y = EYE_HEIGHT;
    const margin = 1;
    const maxX = ROOM.WIDTH / 2 - margin;
    const maxZ = ROOM.LENGTH / 2 - margin;
    camera.position.x = Math.max(-maxX, Math.min(maxX, camera.position.x));
    camera.position.z = Math.max(-maxZ, Math.min(maxZ, camera.position.z));
  });

  if (mode === "orbit") {
    return (
      <OrbitControls
        makeDefault
        enablePan={false}
        minDistance={4}
        maxDistance={16}
        minPolarAngle={0.2}
        maxPolarAngle={Math.PI / 2.05}
        target={[0, 1.5, 0]}
      />
    );
  }

  return (
    <PointerLockControls
      onLock={() => setLocked(true)}
      onUnlock={() => setLocked(false)}
    />
  );
}
