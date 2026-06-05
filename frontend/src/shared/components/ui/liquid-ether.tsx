"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export interface LiquidEtherProps {
  colors?: string[];
  mouseForce?: number;
  cursorSize?: number;
  isViscous?: boolean;
  viscous?: number;
  iterationsViscous?: number;
  iterationsPoisson?: number;
  resolution?: number;
  dt?: number;
  BFECC?: boolean;
  isBounce?: boolean;
  autoDemo?: boolean;
  autoSpeed?: number;
  autoIntensity?: number;
  takeoverDuration?: number;
  autoResumeDelay?: number;
  autoRampDuration?: number;
  className?: string;
  style?: React.CSSProperties;
}

// ─── GLSL ────────────────────────────────────────────────────────────────────

const VERT = `attribute vec3 position;attribute vec2 uv;varying vec2 vUv;void main(){vUv=uv;gl_Position=vec4(position,1.0);}`;
const FACE_VERT = `attribute vec3 position;uniform vec2 px;uniform vec2 boundarySpace;varying vec2 vUv;void main(){vec3 p=position;vec2 s=1.0-boundarySpace*2.0;p.xy=p.xy*s;vUv=vec2(0.5)+(p.xy)*0.5;gl_Position=vec4(p,1.0);}`;
const MOUSE_VERT = `attribute vec3 position;attribute vec2 uv;uniform vec2 center;uniform vec2 scale;uniform vec2 px;varying vec2 vUv;void main(){vec2 p=position.xy*scale*2.0*px+center;vUv=uv;gl_Position=vec4(p,0.0,1.0);}`;

const ADVECT = `precision highp float;uniform sampler2D velocity;uniform float dt;uniform bool isBFECC;uniform vec2 fboSize;uniform vec2 px;varying vec2 vUv;void main(){vec2 r=max(fboSize.x,fboSize.y)/fboSize;if(!isBFECC){vec2 v=texture2D(velocity,vUv).xy;gl_FragColor=vec4(texture2D(velocity,vUv-v*dt*r).xy,0.0,0.0);}else{vec2 v0=texture2D(velocity,vUv).xy;vec2 s0=vUv-v0*dt*r;vec2 v1=texture2D(velocity,s0).xy;vec2 s1=s0+v1*dt*r;vec2 err=s1-vUv;vec2 s2=vUv-err/2.0;vec2 v2=texture2D(velocity,s2).xy;gl_FragColor=vec4(texture2D(velocity,s2-v2*dt*r).xy,0.0,0.0);}}`;
const FORCE = `precision highp float;uniform vec2 force;uniform vec2 center;uniform vec2 scale;uniform vec2 px;varying vec2 vUv;void main(){vec2 c=(vUv-0.5)*2.0;float d=1.0-min(length(c),1.0);d*=d;gl_FragColor=vec4(force*d,0.0,1.0);}`;
const DIV = `precision highp float;uniform sampler2D velocity;uniform float dt;uniform vec2 px;varying vec2 vUv;void main(){float x0=texture2D(velocity,vUv-vec2(px.x,0.0)).x;float x1=texture2D(velocity,vUv+vec2(px.x,0.0)).x;float y0=texture2D(velocity,vUv-vec2(0.0,px.y)).y;float y1=texture2D(velocity,vUv+vec2(0.0,px.y)).y;gl_FragColor=vec4((x1-x0+y1-y0)/2.0/dt);}`;
const POISSON = `precision highp float;uniform sampler2D pressure;uniform sampler2D divergence;uniform vec2 px;varying vec2 vUv;void main(){float p0=texture2D(pressure,vUv+vec2(px.x*2.0,0.0)).r;float p1=texture2D(pressure,vUv-vec2(px.x*2.0,0.0)).r;float p2=texture2D(pressure,vUv+vec2(0.0,px.y*2.0)).r;float p3=texture2D(pressure,vUv-vec2(0.0,px.y*2.0)).r;float d=texture2D(divergence,vUv).r;gl_FragColor=vec4((p0+p1+p2+p3)/4.0-d);}`;
const PRESSURE = `precision highp float;uniform sampler2D pressure;uniform sampler2D velocity;uniform vec2 px;uniform float dt;varying vec2 vUv;void main(){float p0=texture2D(pressure,vUv+vec2(px.x,0.0)).r;float p1=texture2D(pressure,vUv-vec2(px.x,0.0)).r;float p2=texture2D(pressure,vUv+vec2(0.0,px.y)).r;float p3=texture2D(pressure,vUv-vec2(0.0,px.y)).r;vec2 v=texture2D(velocity,vUv).xy;gl_FragColor=vec4(v-vec2(p0-p1,p2-p3)*0.5*dt,0.0,1.0);}`;
const VISCOUS = `precision highp float;uniform sampler2D velocity;uniform sampler2D vel_new;uniform float v;uniform vec2 px;uniform float dt;varying vec2 vUv;void main(){vec2 o=texture2D(velocity,vUv).xy;vec2 n0=texture2D(vel_new,vUv+vec2(px.x*2.0,0.0)).xy;vec2 n1=texture2D(vel_new,vUv-vec2(px.x*2.0,0.0)).xy;vec2 n2=texture2D(vel_new,vUv+vec2(0.0,px.y*2.0)).xy;vec2 n3=texture2D(vel_new,vUv-vec2(0.0,px.y*2.0)).xy;gl_FragColor=vec4((4.0*o+v*dt*(n0+n1+n2+n3))/(4.0*(1.0+v*dt)),0.0,0.0);}`;
const COLOR = `precision highp float;uniform sampler2D velocity;uniform sampler2D palette;varying vec2 vUv;void main(){vec2 vel=texture2D(velocity,vUv).xy;float len=clamp(length(vel),0.0,1.0);vec4 c=texture2D(palette,vec2(len,0.5));gl_FragColor=vec4(c.rgb*len,len);}`;

// ─── helpers ────────────────────────────────────────────────────────────────

function makePalette(stops: string[]) {
  const arr = stops.length > 1 ? stops : [stops[0], stops[0]];
  const data = new Uint8Array(arr.length * 4);
  arr.forEach((s, i) => {
    const c = new THREE.Color(s);
    data[i * 4] = c.r * 255 | 0;
    data[i * 4 + 1] = c.g * 255 | 0;
    data[i * 4 + 2] = c.b * 255 | 0;
    data[i * 4 + 3] = 255;
  });
  const tex = new THREE.DataTexture(data, arr.length, 1, THREE.RGBAFormat);
  tex.magFilter = tex.minFilter = THREE.LinearFilter;
  tex.wrapS = tex.wrapT = THREE.ClampToEdgeWrapping;
  tex.generateMipmaps = false;
  tex.needsUpdate = true;
  return tex;
}

function makeFBO(w: number, h: number) {
  const isIOS = /iPad|iPhone|iPod/i.test(navigator.userAgent);
  return new THREE.WebGLRenderTarget(w, h, {
    type: isIOS ? THREE.HalfFloatType : THREE.FloatType,
    depthBuffer: false,
    stencilBuffer: false,
    minFilter: THREE.LinearFilter,
    magFilter: THREE.LinearFilter,
    wrapS: THREE.ClampToEdgeWrapping,
    wrapT: THREE.ClampToEdgeWrapping,
  });
}

function makePass(vert: string, frag: string, uniforms: Record<string, { value: unknown }>) {
  const geo = new THREE.BufferGeometry();
  const verts = new Float32Array([-1, -1, 0, 1, -1, 0, -1, 1, 0, 1, 1, 0]);
  const uvs = new Float32Array([0, 0, 1, 0, 0, 1, 1, 1]);
  geo.setAttribute("position", new THREE.BufferAttribute(verts, 3));
  geo.setAttribute("uv", new THREE.BufferAttribute(uvs, 2));
  geo.setIndex([0, 1, 2, 1, 3, 2]);
  const mat = new THREE.RawShaderMaterial({ vertexShader: vert, fragmentShader: frag, uniforms, depthTest: false, depthWrite: false });
  const mesh = new THREE.Mesh(geo, mat);
  const scene = new THREE.Scene();
  scene.add(mesh);
  const cam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  return { scene, cam, mat, uniforms: mat.uniforms };
}

function makeForcePass(uniforms: Record<string, { value: unknown }>) {
  const geo = new THREE.BufferGeometry();
  const verts = new Float32Array([-0.5, -0.5, 0, 0.5, -0.5, 0, -0.5, 0.5, 0, 0.5, 0.5, 0]);
  const uvs = new Float32Array([0, 0, 1, 0, 0, 1, 1, 1]);
  geo.setAttribute("position", new THREE.BufferAttribute(verts, 3));
  geo.setAttribute("uv", new THREE.BufferAttribute(uvs, 2));
  geo.setIndex([0, 1, 2, 1, 3, 2]);
  const mat = new THREE.RawShaderMaterial({
    vertexShader: MOUSE_VERT, fragmentShader: FORCE, uniforms,
    blending: THREE.AdditiveBlending, depthTest: false, depthWrite: false,
  });
  const mesh = new THREE.Mesh(geo, mat);
  const scene = new THREE.Scene();
  scene.add(mesh);
  const cam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  return { scene, cam, mat };
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function LiquidEther({
  mouseForce = 20,
  cursorSize = 100,
  isViscous = false,
  viscous = 30,
  iterationsViscous = 32,
  iterationsPoisson = 32,
  dt = 0.014,
  BFECC = true,
  resolution = 0.5,
  isBounce = false,
  colors = ["#8b5cf6", "#7c3aed", "#6d28d9", "#0891b2", "#a78bfa"],
  autoDemo = true,
  autoSpeed = 0.5,
  autoIntensity = 2.2,
  autoResumeDelay = 3000,
  autoRampDuration = 0.6,
  className = "",
  style = {},
}: LiquidEtherProps) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container || typeof window === "undefined") return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let W = Math.max(1, container.clientWidth);
    let H = Math.max(1, container.clientHeight);
    let simW = Math.max(1, Math.round(resolution * W));
    let simH = Math.max(1, Math.round(resolution * H));

    // ── renderer ──
    const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true, premultipliedAlpha: false });
    renderer.autoClear = false;
    renderer.setPixelRatio(dpr);
    renderer.setSize(W, H);
    Object.assign(renderer.domElement.style, {
      position: "absolute", inset: "0", width: "100%", height: "100%",
      pointerEvents: "none", display: "block",
    });
    container.prepend(renderer.domElement);

    const paletteTex = makePalette(colors);
    const cellScale = new THREE.Vector2(1 / simW, 1 / simH);
    const fboSize = new THREE.Vector2(simW, simH);
    const zero2 = new THREE.Vector2(0, 0);

    // ── FBOs ──
    let vel0 = makeFBO(simW, simH);
    let vel1 = makeFBO(simW, simH);
    let vv0 = makeFBO(simW, simH); // viscous ping
    let vv1 = makeFBO(simW, simH); // viscous pong
    let divFBO = makeFBO(simW, simH);
    let p0 = makeFBO(simW, simH);
    let p1 = makeFBO(simW, simH);
    const allFBOs = () => [vel0, vel1, vv0, vv1, divFBO, p0, p1];

    // ── Passes — created ONCE ──
    const advect = makePass(FACE_VERT, ADVECT, {
      boundarySpace: { value: cellScale },
      px: { value: cellScale },
      fboSize: { value: fboSize },
      velocity: { value: vel0.texture },
      dt: { value: dt },
      isBFECC: { value: BFECC },
    });

    const forceUniforms = {
      px: { value: cellScale },
      force: { value: new THREE.Vector2(0, 0) },
      center: { value: new THREE.Vector2(0, 0) },
      scale: { value: new THREE.Vector2(cursorSize, cursorSize) },
    };
    const forcePass = makeForcePass(forceUniforms);

    const divPass = makePass(FACE_VERT, DIV, {
      boundarySpace: { value: zero2 },
      velocity: { value: vel1.texture },
      px: { value: cellScale },
      dt: { value: dt },
    });

    const poissonPass = makePass(FACE_VERT, POISSON, {
      boundarySpace: { value: zero2 },
      pressure: { value: p0.texture },
      divergence: { value: divFBO.texture },
      px: { value: cellScale },
    });

    const pressurePass = makePass(FACE_VERT, PRESSURE, {
      boundarySpace: { value: zero2 },
      pressure: { value: p0.texture },
      velocity: { value: vel1.texture },
      px: { value: cellScale },
      dt: { value: dt },
    });

    const viscousPass = makePass(FACE_VERT, VISCOUS, {
      boundarySpace: { value: zero2 },
      velocity: { value: vel1.texture },
      vel_new: { value: vv0.texture },
      v: { value: viscous },
      px: { value: cellScale },
      dt: { value: dt },
    });

    const colorPass = makePass(VERT, COLOR, {
      velocity: { value: vel0.texture },
      palette: { value: paletteTex },
    });

    function render(pass: ReturnType<typeof makePass>, target: THREE.WebGLRenderTarget | null) {
      renderer.setRenderTarget(target);
      renderer.render(pass.scene, pass.cam);
    }

    // ── Mouse ──
    const mouse = { x: 0, y: 0, px: 0, py: 0, dx: 0, dy: 0, moved: false };
    let lastInteract = performance.now();
    let isAutoActive = false;
    let autoX = 0, autoY = 0;
    let autoTX = (Math.random() * 2 - 1) * 0.8;
    let autoTY = (Math.random() * 2 - 1) * 0.8;
    let autoActivated = 0;

    function onMove(e: MouseEvent) {
      if (!container) return;
      const r = container.getBoundingClientRect();
      if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) return;
      lastInteract = performance.now();
      isAutoActive = false;
      mouse.px = mouse.x; mouse.py = mouse.y;
      mouse.x = ((e.clientX - r.left) / r.width) * 2 - 1;
      mouse.y = -(((e.clientY - r.top) / r.height) * 2 - 1);
      mouse.dx = mouse.x - mouse.px;
      mouse.dy = mouse.y - mouse.py;
      mouse.moved = true;
    }
    function onTouch(e: TouchEvent) {
      if (e.touches.length !== 1) return;
      const t = e.touches[0];
      const synth = new MouseEvent("mousemove", { clientX: t.clientX, clientY: t.clientY });
      onMove(synth);
    }
    window.addEventListener("mousemove", onMove);
    window.addEventListener("touchmove", onTouch, { passive: true });

    // ── Resize ──
    function resize() {
      if (!container) return;
      W = Math.max(1, container.clientWidth);
      H = Math.max(1, container.clientHeight);
      renderer.setSize(W, H, false);
      simW = Math.max(1, Math.round(resolution * W));
      simH = Math.max(1, Math.round(resolution * H));
      cellScale.set(1 / simW, 1 / simH);
      fboSize.set(simW, simH);
      allFBOs().forEach((f) => f.setSize(simW, simH));
    }
    const ro = new ResizeObserver(() => resize());
    ro.observe(container);

    // ── Loop ──
    let raf = 0;
    let lastT = performance.now();
    const rampMs = autoRampDuration * 1000;

    function loop() {
      raf = requestAnimationFrame(loop);
      const now = performance.now();
      const frameDt = Math.min((now - lastT) / 1000, 0.05);
      lastT = now;

      // auto demo
      if (autoDemo && now - lastInteract > autoResumeDelay) {
        if (!isAutoActive) {
          isAutoActive = true;
          autoX = mouse.x; autoY = mouse.y;
          autoActivated = now;
        }
        const ramp = Math.min(1, (now - autoActivated) / rampMs);
        const eased = ramp * ramp * (3 - 2 * ramp);
        const dist = Math.hypot(autoTX - autoX, autoTY - autoY);
        if (dist < 0.04) { autoTX = (Math.random() * 2 - 1) * 0.8; autoTY = (Math.random() * 2 - 1) * 0.8; }
        const step = Math.min(autoSpeed * frameDt * eased, dist);
        if (dist > 0.001) {
          autoX += ((autoTX - autoX) / dist) * step;
          autoY += ((autoTY - autoY) / dist) * step;
        }
        mouse.dx = (autoX - mouse.x) * autoIntensity;
        mouse.dy = (autoY - mouse.y) * autoIntensity;
        mouse.x = autoX; mouse.y = autoY;
        mouse.moved = true;
      }

      const bSpace = isBounce ? zero2 : cellScale;

      // 1. Advection
      advect.uniforms.velocity.value = vel0.texture;
      advect.uniforms.boundarySpace.value = bSpace;
      advect.uniforms.isBFECC.value = BFECC;
      advect.uniforms.dt.value = dt;
      render(advect, vel1);

      // 2. External force
      if (mouse.moved) {
        const fx = (mouse.dx / 2) * mouseForce;
        const fy = (mouse.dy / 2) * mouseForce;
        const csx = cursorSize * cellScale.x;
        const csy = cursorSize * cellScale.y;
        forceUniforms.force.value.set(fx, fy);
        forceUniforms.center.value.set(
          Math.min(Math.max(mouse.x, -1 + csx + cellScale.x * 2), 1 - csx - cellScale.x * 2),
          Math.min(Math.max(mouse.y, -1 + csy + cellScale.y * 2), 1 - csy - cellScale.y * 2)
        );
        forceUniforms.scale.value.set(cursorSize, cursorSize);
        render(forcePass as unknown as ReturnType<typeof makePass>, vel1);
        mouse.moved = false;
      }

      // 3. Viscous (optional)
      let velForDiv = vel1;
      if (isViscous) {
        for (let i = 0; i < iterationsViscous; i++) {
          const [inp, out] = i % 2 === 0 ? [vv0, vv1] : [vv1, vv0];
          viscousPass.uniforms.velocity.value = vel1.texture;
          viscousPass.uniforms.vel_new.value = inp.texture;
          render(viscousPass, out);
        }
        velForDiv = iterationsViscous % 2 === 0 ? vv1 : vv0;
      }

      // 4. Divergence
      divPass.uniforms.velocity.value = velForDiv.texture;
      divPass.uniforms.boundarySpace.value = bSpace;
      render(divPass, divFBO);

      // 5. Poisson pressure
      for (let i = 0; i < iterationsPoisson; i++) {
        const [inp, out] = i % 2 === 0 ? [p0, p1] : [p1, p0];
        poissonPass.uniforms.pressure.value = inp.texture;
        poissonPass.uniforms.divergence.value = divFBO.texture;
        render(poissonPass, out);
      }
      const finalPressure = iterationsPoisson % 2 === 0 ? p1 : p0;

      // 6. Subtract pressure
      pressurePass.uniforms.pressure.value = finalPressure.texture;
      pressurePass.uniforms.velocity.value = velForDiv.texture;
      render(pressurePass, vel0);

      // 7. Render to screen
      colorPass.uniforms.velocity.value = vel0.texture;
      renderer.setRenderTarget(null);
      renderer.render(colorPass.scene, colorPass.cam);
    }

    loop();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("touchmove", onTouch);
      allFBOs().forEach((f) => f.dispose());
      paletteTex.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      ref={mountRef}
      className={`pointer-events-none absolute inset-0 ${className}`}
      style={style}
      aria-hidden
    />
  );
}
