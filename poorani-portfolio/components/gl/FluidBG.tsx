"use client";
import { useEffect, useRef } from "react";
import { Renderer, Program, Mesh, Triangle, Vec2 } from "ogl";
import { prefersReduced } from "@/lib/motion";

const vertex = /* glsl */ `
attribute vec2 uv; attribute vec2 position; varying vec2 vUv;
void main(){ vUv = uv; gl_Position = vec4(position, 0., 1.); }`;

// Domain-warped fbm "ink in water", pushed around by the pointer
const fragment = /* glsl */ `
precision highp float;
uniform float uTime; uniform vec2 uRes; uniform vec2 uMouse; uniform float uHover;
uniform vec3 c0; uniform vec3 c1; uniform vec3 c2; uniform vec3 c3;
varying vec2 vUv;
float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7))) * 43758.5453); }
float noise(vec2 p){ vec2 i=floor(p), f=fract(p); vec2 u=f*f*(3.-2.*f);
  return mix(mix(hash(i),hash(i+vec2(1,0)),u.x), mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),u.x), u.y); }
float fbm(vec2 p){ float v=0., a=.5; for(int i=0;i<5;i++){ v+=a*noise(p); p*=2.02; a*=.5; } return v; }
void main(){
  vec2 uv = vUv; vec2 asp = vec2(uRes.x/uRes.y, 1.);
  vec2 p = uv*asp*2.2;
  vec2 m = uMouse*asp*2.2;
  float d = length(p - m);
  p += (p - m) * .35 * exp(-d*d*1.6) * uHover;   // pointer lens
  float t = uTime*.07;
  vec2 q = vec2(fbm(p + t), fbm(p + vec2(5.2,1.3) - t));
  vec2 r = vec2(fbm(p + 3.5*q + vec2(1.7,9.2) + t*1.3), fbm(p + 3.5*q + vec2(8.3,2.8) - t));
  float f = fbm(p + 3.*r);
  vec3 col = mix(c0, c1, smoothstep(.15,.85,f));
  col = mix(col, c2, smoothstep(.45,.95, length(q)*.9));
  col = mix(col, c3, smoothstep(.72,1., r.x) * .85);
  col = mix(c0, col, smoothstep(.0,.55,f*f*1.6 + .12));
  float vig = smoothstep(1.25,.2,length((uv-.5)*vec2(1.2,1.)));
  col *= .45 + .55*vig;
  gl_FragColor = vec4(col, 1.);
}`;

const hex = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16) / 255);

export default function FluidBG({ colors = ["#0C0A12", "#2433FF", "#FF2E7E", "#FF4A1C"], className = "" }: { colors?: string[]; className?: string }) {
  const host = useRef<HTMLDivElement>(null);
  const key = colors.join(",");
  useEffect(() => {
    const colors = key.split(",");
    const el = host.current!;
    let renderer: Renderer;
    // The fluid is soft, so it renders at half resolution and is upscaled by CSS: ~4x fewer pixels to shade.
    try { renderer = new Renderer({ dpr: 0.5, alpha: false }); } catch { return; }
    const gl = renderer.gl;
    el.appendChild(gl.canvas);
    gl.canvas.style.cssText = "width:100%;height:100%;display:block";
    const mouse = new Vec2(0.7, 0.45), target = new Vec2(0.7, 0.45);
    const program = new Program(gl, {
      vertex, fragment,
      uniforms: {
        uTime: { value: 0 }, uRes: { value: new Vec2(1, 1) }, uMouse: { value: mouse }, uHover: { value: 1 },
        c0: { value: hex(colors[0]) }, c1: { value: hex(colors[1]) }, c2: { value: hex(colors[2]) }, c3: { value: hex(colors[3]) },
      },
    });
    const mesh = new Mesh(gl, { geometry: new Triangle(gl), program });
    const resize = () => {
      const w = el.clientWidth, h = el.clientHeight;
      renderer.setSize(w, h);
      program.uniforms.uRes.value.set(w, h);
    };
    resize();
    const ro = new ResizeObserver(resize); ro.observe(el);
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      target.set((e.clientX - r.left) / r.width, 1 - (e.clientY - r.top) / r.height);
    };
    window.addEventListener("pointermove", move);
    const still = prefersReduced();
    let raf = 0, visible = true;
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; }); io.observe(el);
    const loop = (t: number) => {
      raf = requestAnimationFrame(loop);
      if (!visible || document.hidden) return;
      mouse.x += (target.x - mouse.x) * 0.05; mouse.y += (target.y - mouse.y) * 0.05;
      program.uniforms.uTime.value = still ? 12 : t * 0.001;
      renderer.render({ scene: mesh });
      if (still) cancelAnimationFrame(raf); // reduced motion: draw one frame only
    };
    // start after first paint so the shader compile doesn't block the initial render
    const startT = setTimeout(() => { raf = requestAnimationFrame(loop); }, 120);
    return () => {
      clearTimeout(startT); cancelAnimationFrame(raf); ro.disconnect(); io.disconnect();
      window.removeEventListener("pointermove", move);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
      gl.canvas.remove();
    };
  }, [key]);
  return <div ref={host} className={className} style={{ background: colors[0] }} aria-hidden="true" />;
}
