"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, type ThreeEvent } from "@react-three/fiber";
import * as THREE from "three";
import { FUNNEL } from "@/lib/data";

const RADII = [2.3, 1.75, 1.2, 0.7];
const Y = [1.6, 0.55, -0.5, -1.55];

function Particles({ count }: { count: number }) {
  const ref = useRef<THREE.Points>(null);
  const { positions, seeds, colors } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const seeds = new Float32Array(count * 2);
    const palette = FUNNEL.map((f) => new THREE.Color(f.color));
    for (let i = 0; i < count; i++) {
      seeds[i * 2] = Math.random();
      seeds[i * 2 + 1] = Math.random() * Math.PI * 2;
      const c = palette[Math.floor(Math.random() * palette.length)];
      colors.set([c.r, c.g, c.b], i * 3);
    }
    return { positions, seeds, colors };
  }, [count]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const pos = ref.current!.geometry.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < count; i++) {
      const k = (seeds[i * 2] + t * 0.06) % 1; // 0 top → 1 bottom
      const y = 2.4 - k * 4.8;
      const r = THREE.MathUtils.lerp(2.7, 0.35, Math.pow(k, 0.85)) * (0.75 + 0.35 * Math.sin(seeds[i * 2 + 1] * 3));
      const a = seeds[i * 2 + 1] + t * (0.4 + k * 1.6);
      pos.setXYZ(i, Math.cos(a) * r, y, Math.sin(a) * r);
    }
    pos.needsUpdate = true;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.045} vertexColors transparent opacity={0.9} sizeAttenuation depthWrite={false} />
    </points>
  );
}

function Rings({ active, onActive }: { active: number; onActive: (i: number) => void }) {
  const group = useRef<THREE.Group>(null);
  const meshes = useRef<(THREE.Mesh | null)[]>([]);
  useFrame(({ pointer, clock }, dt) => {
    const g = group.current!;
    g.rotation.y += dt * 0.25;
    g.rotation.x = THREE.MathUtils.lerp(g.rotation.x, 0.42 + pointer.y * 0.25, 0.05);
    g.rotation.z = THREE.MathUtils.lerp(g.rotation.z, -pointer.x * 0.2, 0.05);
    meshes.current.forEach((m, i) => {
      if (!m) return;
      const on = i === active;
      const s = THREE.MathUtils.lerp(m.scale.x, on ? 1.12 : 1, 0.1);
      m.scale.setScalar(s);
      const mat = m.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = THREE.MathUtils.lerp(mat.emissiveIntensity, on ? 1.4 : 0.25, 0.1);
      m.position.y = Y[i] + Math.sin(clock.getElapsedTime() * 1.2 + i) * 0.05;
    });
  });
  return (
    <group ref={group}>
      {FUNNEL.map((f, i) => (
        <mesh
          key={f.stage}
          ref={(m) => { meshes.current[i] = m; }}
          rotation={[Math.PI / 2, 0, 0]}
          position={[0, Y[i], 0]}
          onPointerOver={(e: ThreeEvent<PointerEvent>) => { e.stopPropagation(); onActive(i); }}
          onClick={(e: ThreeEvent<MouseEvent>) => { e.stopPropagation(); onActive(i); }}
        >
          <torusGeometry args={[RADII[i], 0.07 + i * 0.012, 24, 160]} />
          <meshStandardMaterial color={f.color} emissive={f.color} emissiveIntensity={0.25} roughness={0.3} metalness={0.4} />
        </mesh>
      ))}
      <Particles count={typeof window !== "undefined" && window.innerWidth < 768 ? 500 : 900} />
    </group>
  );
}

/** Interactive 3D marketing funnel: four stage rings with leads flowing through. */
export default function FunnelScene({ active, onActive }: { active: number; onActive: (i: number) => void }) {
  const host = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    // pause rendering when the funnel is scrolled off screen or the tab is hidden
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting));
    if (host.current) io.observe(host.current);
    const vis = () => setVisible(!document.hidden && !!host.current && host.current.getBoundingClientRect().bottom > 0);
    document.addEventListener("visibilitychange", vis);
    return () => { io.disconnect(); document.removeEventListener("visibilitychange", vis); };
  }, []);
  return (
    <div ref={host} className="w-full h-full">
    <Canvas
      frameloop={visible ? "always" : "never"}
      fallback={<div className="w-full h-full grid place-items-center label opacity-90">3D view needs WebGL. The stages are listed alongside.</div>}
      camera={{ position: [0, 0.3, 8.6], fov: 45 }}
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
    >
      <ambientLight intensity={0.5} />
      <pointLight position={[4, 4, 4]} intensity={40} color="#ffffff" />
      <pointLight position={[-4, -2, 2]} intensity={25} color="#2433FF" />
      <Rings active={active} onActive={onActive} />
    </Canvas>
    </div>
  );
}
