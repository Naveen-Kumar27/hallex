import { useRef, useEffect } from 'react';
import { Renderer, Camera, Transform, Program, Mesh, Color, Vec2, Vec3 } from 'ogl';

const vertexShader = `
attribute vec2 uv;
attribute vec2 position;

varying vec2 vUv;

void main() {
    vUv = uv;
    gl_Position = vec4(position, 0, 1);
}
`;

const fragmentShader = `
precision highp float;

uniform float uTime;
uniform vec3 uResolution;
uniform vec2 uFocal;
uniform vec2 uRotation;
uniform float uStarSpeed;
uniform float uDensity;
uniform float uHueShift;
uniform float uSpeed;
uniform vec2 uMouse;
uniform float uGlowIntensity;
uniform float uSaturation;
uniform bool uMouseRepulsion;
uniform float uTwinkleIntensity;
uniform float uRotationSpeed;
uniform float uRepulsionStrength;
uniform float uMouseActiveFactor;
uniform float uAutoCenterRepulsion;
uniform bool uTransparent;

varying vec2 vUv;

#define ITERATIONS 20

mat2 rotate2d(float angle) {
    float s = sin(angle);
    float c = cos(angle);
    return mat2(c, -s, s, c);
}

vec3 hsv2rgb(vec3 c) {
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

void main() {
    vec2 uv = (gl_FragCoord.xy - 0.5 * uResolution.xy) / min(uResolution.y, uResolution.x);
    
    vec2 mouseEffect = uMouse * 0.1;
    if (uMouseRepulsion) {
        float d = length(uv - uMouse);
        float repulsion = uRepulsionStrength / (d * 5.0 + 0.5);
        uv += normalize(uv - uMouse) * repulsion * uMouseActiveFactor;
    }

    vec3 dir = vec3(uv * uFocal, 1.0);
    dir.xy *= rotate2d(uRotation.y);
    dir.xz *= rotate2d(uRotation.x);
    
    vec3 from = vec3(1.0, 0.5, 0.5);
    from.xy *= rotate2d(uRotation.y + uTime * uRotationSpeed * 0.1);
    
    float s = 0.1, fade = 1.0;
    vec3 v = vec3(0.0);
    
    for (int r = 0; r < ITERATIONS; r++) {
        vec3 p = from + s * dir * 1.5;
        p = abs(vec3(0.85) - mod(p, vec3(0.85 * 2.0)));
        float pa, a = pa = 0.0;
        for (int i = 0; i < 15; i++) {
            p = abs(p) / dot(p, p) - 0.67;
            a += abs(length(p) - pa);
            pa = length(p);
        }
        float dm = max(0.0, 1.0 - a * a * 0.001);
        a *= a * a;
        if (r > 6) fade *= 1.0 - dm;
        v += fade;
        v += vec3(s, s * s, s * s * s * s) * a * uGlowIntensity * 0.0012 * fade;
        fade *= 0.85;
        s += 0.1;
    }
    
    v = mix(vec3(length(v)), v, uSaturation);
    vec3 color = v * 0.01;
    
    // Applying custom hue shift
    vec3 hsv = vec3(uHueShift, 0.8, color.r);
    color *= hsv2rgb(hsv);

    gl_FragColor = vec4(color, uTransparent ? color.r : 1.0);
}
`;

export default function Galaxy({
  focal = [0.0, 0.0],
  rotation = [0.0, 0.0],
  starSpeed = 0.5,
  density = 1.0,
  hueShift = 0.0,
  speed = 1.0,
  glowIntensity = 1.0,
  saturation = 1.0,
  mouseRepulsion = true,
  twinkleIntensity = 1.0,
  rotationSpeed = 1.0,
  repulsionStrength = 1.0,
  autoCenterRepulsion = 0.0,
  transparent = false,
  disableAnimation = false,
  className = "",
  ...rest
}) {
  const ctnDom = useRef(null);
  const targetMousePos = useRef(new Vec2(0));
  const smoothMousePos = useRef(new Vec2(0));
  const targetMouseActive = useRef(0);
  const smoothMouseActive = useRef(0);

  useEffect(() => {
    const container = ctnDom.current;
    if (!container) return;

    const renderer = new Renderer({ alpha: true, antialias: true });
    const gl = renderer.gl;
    container.appendChild(gl.canvas);

    const camera = new Camera(gl, { fov: 35 });
    camera.position.set(0, 0, 5);

    function resize() {
      const width = container.clientWidth;
      const height = container.clientHeight;
      if (width === 0 || height === 0) return;
      renderer.setSize(width, height);
      camera.perspective({ aspect: width / height });
    }
    window.addEventListener('resize', resize);
    resize();

    const geometry = new Mesh(gl, {
      geometry: {
        position: { size: 2, data: new Float32Array([-1, -1, 3, -1, -1, 3]) },
        uv: { size: 2, data: new Float32Array([0, 0, 2, 0, 0, 2]) },
      },
    });

    const program = new Program(gl, {
      vertex: vertexShader,
      fragment: fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uResolution: { value: new Vec3(gl.canvas.width, gl.canvas.height, 0) },
        uFocal: { value: new Vec2(focal[0], focal[1]) },
        uRotation: { value: new Vec2(rotation[0], rotation[1]) },
        uStarSpeed: { value: starSpeed },
        uDensity: { value: density },
        uHueShift: { value: hueShift },
        uSpeed: { value: speed },
        uMouse: { value: new Vec2(0) },
        uGlowIntensity: { value: glowIntensity },
        uSaturation: { value: saturation },
        uMouseRepulsion: { value: mouseRepulsion },
        uTwinkleIntensity: { value: twinkleIntensity },
        uRotationSpeed: { value: rotationSpeed },
        uRepulsionStrength: { value: repulsionStrength },
        uMouseActiveFactor: { value: 0.0 },
        uAutoCenterRepulsion: { value: autoCenterRepulsion },
        uTransparent: { value: transparent }
      }
    });

    const mesh = new Mesh(gl, { geometry, program });
    let animateId;

    function update(t) {
      animateId = requestAnimationFrame(update);
      if (!disableAnimation) {
        program.uniforms.uTime.value = t * 0.001;
        program.uniforms.uStarSpeed.value = (t * 0.001 * starSpeed) / 10.0;
      }

      const lerpFactor = 0.05;
      smoothMousePos.current.x += (targetMousePos.current.x - smoothMousePos.current.x) * lerpFactor;
      smoothMousePos.current.y += (targetMousePos.current.y - smoothMousePos.current.y) * lerpFactor;
      smoothMouseActive.current += (targetMouseActive.current - smoothMouseActive.current) * lerpFactor;

      program.uniforms.uMouse.value[0] = smoothMousePos.current.x;
      program.uniforms.uMouse.value[1] = smoothMousePos.current.y;
      program.uniforms.uMouseActiveFactor.value = smoothMouseActive.current;

      renderer.render({ scene: mesh });
    }

    const handleMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      targetMousePos.current.set(x, y);
      targetMouseActive.current = 1.0;
    };

    const handleMouseLeave = () => { targetMouseActive.current = 0.0; };

    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseleave', handleMouseLeave);
    animateId = requestAnimationFrame(update);

    return () => {
      window.removeEventListener('resize', resize);
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animateId);
      if (gl.canvas.parentNode) container.removeChild(gl.canvas);
    };
  }, [focal, rotation, starSpeed, density, hueShift, speed, glowIntensity, saturation, mouseRepulsion, twinkleIntensity, rotationSpeed, repulsionStrength, autoCenterRepulsion, transparent, disableAnimation]);

  return <div ref={ctnDom} className={`w-full h-full relative overflow-hidden bg-black ${className}`} {...rest} />;
}
