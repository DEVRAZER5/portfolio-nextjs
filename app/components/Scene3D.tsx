"use client";

import { useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";

const COLORS = ["#3498db", "#e67e22", "#2ecc71", "#9b59b6"];

function Shape() {
  const meshRef = useRef<THREE.Mesh>(null);
  const [colorIndex, setColorIndex] = useState(0);
  const [wireframe, setWireframe] = useState(false);

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.25;
      meshRef.current.rotation.y += delta * 0.35;
    }
  });

  return (
    <mesh
      ref={meshRef}
      onClick={(e) => {
        e.stopPropagation();
        setColorIndex((i) => (i + 1) % COLORS.length);
      }}
      onDoubleClick={(e) => {
        e.stopPropagation();
        setWireframe((w) => !w);
      }}
    >
      <icosahedronGeometry args={[1.4, 0]} />
      <meshStandardMaterial
        color={COLORS[colorIndex]}
        wireframe={wireframe}
        roughness={0.3}
        metalness={0.2}
      />
    </mesh>
  );
}

export default function Scene3D() {
  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 4.5], fov: 45 }}
      style={{ width: "100%", height: "100%" }}
    >
      <ambientLight intensity={0.6} />
      <directionalLight position={[3, 3, 3]} intensity={1} />
      <Shape />
      <OrbitControls enablePan={false} enableZoom={false} makeDefault />
    </Canvas>
  );
}
