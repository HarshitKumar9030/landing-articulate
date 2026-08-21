"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type CloudShaderProps = {
  className?: string;
  children?: ReactNode;
  speed?: number;
  count?: number;
  cloudColor?: string;
  skyTopColor?: string;
  skyBottomColor?: string;
};

const VERTEX_SHADER = `
attribute vec2 a_pos;
varying vec2 v_uv;
void main() {
  v_uv = a_pos * 0.5 + 0.5;
  gl_Position = vec4(a_pos, 0.0, 1.0);
}
`;

const FRAGMENT_SHADER = `
precision highp float;
varying vec2 v_uv;
uniform vec2 u_res;
uniform float u_time;
uniform float u_count;
uniform vec3 u_cloud;
uniform vec3 u_skyTop;
uniform vec3 u_skyBottom;

const mat2 ROT = mat2(0.80, 0.60, -0.60, 0.80);

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(41.31, 289.17))) * 26737.367);
}

float noise(vec2 p) {
  vec2 cell = floor(p);
  vec2 local = fract(p);
  local = local * local * (3.0 - 2.0 * local);
  float a = hash(cell);
  float b = hash(cell + vec2(1.0, 0.0));
  float c = hash(cell + vec2(0.0, 1.0));
  float d = hash(cell + vec2(1.0, 1.0));
  return mix(mix(a, b, local.x), mix(c, d, local.x), local.y);
}

float fbm(vec2 p) {
  float value = 0.0;
  float amplitude = 0.5;
  for (int i = 0; i < 4; i++) {
    value += amplitude * noise(p);
    p = ROT * p * 2.03 + 19.19;
    amplitude *= 0.5;
  }
  return value;
}

float billow(vec2 p) {
  float value = 0.0;
  float amplitude = 0.5;
  for (int i = 0; i < 5; i++) {
    value += amplitude * (1.0 - abs(2.0 * noise(p) - 1.0));
    p = ROT * p * 2.11 + 13.37;
    amplitude *= 0.5;
  }
  return value;
}

float density(vec2 point, vec2 center, vec2 radius, float seed, float time) {
  vec2 offset = point - center;
  float verticalRadius = offset.y > 0.0 ? radius.y : radius.y * 0.42;
  float envelope = 1.0 - length(vec2(offset.x / radius.x, offset.y / verticalRadius));
  if (envelope < -0.35) return 0.0;

  vec2 detailPoint = offset * (2.4 / radius.x) + seed;
  detailPoint += 0.6 * vec2(
    fbm(detailPoint * 1.4 + time * 0.04),
    fbm(detailPoint * 1.4 + 7.7 - time * 0.03)
  );
  return envelope + (billow(detailPoint * 1.6) - 0.62) * 0.62;
}

vec3 cloudPass(vec3 color, vec3 sky, vec2 point, float aspect, float time, float speed, float phase, float y, vec2 radius, float seed, float distance) {
  float centerX = mix(-radius.x - 0.25, aspect + radius.x + 0.25, fract(time * speed + phase));
  vec2 center = vec2(centerX, y + sin(time * 0.05 + phase * 6.2831) * 0.012);
  float cloudDensity = density(point, center, radius, seed, time);
  if (cloudDensity < 0.02) return color;

  float upperDensity = density(point + vec2(0.0, radius.y * 0.55), center, radius, seed, time);
  float occlusion = clamp((upperDensity - cloudDensity) * 1.1 + cloudDensity * 0.55, 0.0, 1.0);
  vec3 lit = u_cloud * 1.04;
  vec3 shadow = mix(u_cloud * 0.60, sky, 0.38);
  vec3 cloudColor = mix(lit, shadow, occlusion * 0.85);
  float alpha = smoothstep(0.02, 0.38, cloudDensity);
  float rim = smoothstep(0.02, 0.14, cloudDensity) * (1.0 - smoothstep(0.14, 0.40, cloudDensity));
  cloudColor += rim * 0.10;
  cloudColor = mix(cloudColor, sky, distance * 0.35);
  return mix(color, cloudColor, alpha * mix(1.0, 0.8, distance));
}

void main() {
  float aspect = u_res.x / u_res.y;
  vec2 point = vec2(v_uv.x * aspect, v_uv.y);
  float time = u_time;
  vec3 sky = mix(u_skyBottom, u_skyTop, v_uv.y);
  vec3 color = sky;

  color = mix(color, u_skyBottom * 1.06, smoothstep(0.35, 0.0, v_uv.y) * 0.5);
  vec2 sun = vec2(aspect * 0.78, 0.92);
  float sunDistance = length(point - sun);
  color += vec3(1.0, 0.95, 0.82) * exp(-sunDistance * sunDistance * 5.0) * 0.28;

  if (u_count > 5.5) color = cloudPass(color, sky, point, aspect, time, 0.006, 0.10, 0.84, vec2(0.20, 0.10), 43.7, 1.0);
  if (u_count > 4.5) color = cloudPass(color, sky, point, aspect, time, 0.008, 0.62, 0.73, vec2(0.24, 0.12), 71.3, 0.85);
  if (u_count > 3.5) color = cloudPass(color, sky, point, aspect, time, 0.011, 0.33, 0.60, vec2(0.34, 0.16), 17.3, 0.55);
  if (u_count > 2.5) color = cloudPass(color, sky, point, aspect, time, 0.013, 0.80, 0.47, vec2(0.30, 0.15), 29.9, 0.45);
  if (u_count > 1.5) color = cloudPass(color, sky, point, aspect, time, 0.016, 0.05, 0.35, vec2(0.46, 0.20), 91.1, 0.15);
  color = cloudPass(color, sky, point, aspect, time, 0.020, 0.48, 0.20, vec2(0.56, 0.24), 57.2, 0.0);

  gl_FragColor = vec4(color, 1.0);
}
`;

function parseColor(value: string): [number, number, number] {
  const color = value.trim();
  if (color.startsWith("#")) {
    const hex = color.slice(1);
    const normalized = hex.length === 3 ? hex.split("").map((part) => part + part).join("") : hex;
    return [
      parseInt(normalized.slice(0, 2), 16) / 255,
      parseInt(normalized.slice(2, 4), 16) / 255,
      parseInt(normalized.slice(4, 6), 16) / 255,
    ];
  }
  const rgb = color.match(/[\d.]+/g);
  return rgb && rgb.length >= 3 ? [Number(rgb[0]) / 255, Number(rgb[1]) / 255, Number(rgb[2]) / 255] : [1, 1, 1];
}

function compileShader(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

export function CloudShader({
  className,
  children,
  speed = 1,
  count = 6,
  cloudColor = "#fbf8f2",
  skyTopColor = "#3876ba",
  skyBottomColor = "#8cbfe8",
}: CloudShaderProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const paramsRef = useRef({ speed, count, cloudColor, skyTopColor, skyBottomColor });

  paramsRef.current = { speed, count, cloudColor, skyTopColor, skyBottomColor };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl", { alpha: false, antialias: false, premultipliedAlpha: false });
    if (!gl) return;

    const vertexShader = compileShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER);
    const fragmentShader = compileShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
    if (!vertexShader || !fragmentShader) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.bindAttribLocation(program, 0, "a_pos");
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;
    gl.useProgram(program);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

    const locations = {
      resolution: gl.getUniformLocation(program, "u_res"),
      time: gl.getUniformLocation(program, "u_time"),
      count: gl.getUniformLocation(program, "u_count"),
      cloud: gl.getUniformLocation(program, "u_cloud"),
      skyTop: gl.getUniformLocation(program, "u_skyTop"),
      skyBottom: gl.getUniformLocation(program, "u_skyBottom"),
    };

    let frame = 0;
    let running = true;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.25);
      const width = Math.max(1, Math.floor(canvas.clientWidth * dpr));
      const height = Math.max(1, Math.floor(canvas.clientHeight * dpr));
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }
      gl.viewport(0, 0, width, height);
      gl.uniform2f(locations.resolution, width, height);
    };

    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    resize();
    const start = performance.now();
    let lastFrame = 0;
    let isVisible = true;
    const visibilityObserver = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
      if (isVisible && !frame) frame = requestAnimationFrame(draw);
    }, { threshold: 0.01 });
    visibilityObserver.observe(canvas);

    const draw = (now: number) => {
      if (!running || !isVisible) {
        frame = 0;
        return;
      }
      if (now - lastFrame < 33) {
        frame = requestAnimationFrame(draw);
        return;
      }
      lastFrame = now;
      const params = paramsRef.current;
      const elapsed = reducedMotion ? 0 : ((now - start) / 1000) * params.speed;
      const cloud = parseColor(params.cloudColor);
      const skyTop = parseColor(params.skyTopColor);
      const skyBottom = parseColor(params.skyBottomColor);
      gl.uniform1f(locations.time, elapsed);
      gl.uniform1f(locations.count, Math.min(6, Math.max(1, params.count)));
      gl.uniform3f(locations.cloud, cloud[0], cloud[1], cloud[2]);
      gl.uniform3f(locations.skyTop, skyTop[0], skyTop[1], skyTop[2]);
      gl.uniform3f(locations.skyBottom, skyBottom[0], skyBottom[1], skyBottom[2]);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      frame = requestAnimationFrame(draw);
    };

    frame = requestAnimationFrame(draw);
    return () => {
      running = false;
      cancelAnimationFrame(frame);
      observer.disconnect();
      visibilityObserver.disconnect();
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
    };
  }, []);

  return (
    <div className={cn("relative h-full min-h-80 w-full overflow-hidden", className)}>
      <canvas ref={canvasRef} aria-hidden="true" className="pointer-events-none absolute inset-0 h-full w-full" />
      {children ? <div className="relative z-10 flex h-full w-full items-center justify-center">{children}</div> : null}
    </div>
  );
}
