import React, { useEffect, useRef } from 'react';

const NUM_FRAMES = 63;
const BG_COLOR = '#fce1dc';
const DIRECTION_FRAME_ANCHORS = [
  [0, 15],
  [Math.PI / 2, 27],
  [(3 * Math.PI) / 4, 29],
  [Math.PI, 35],
  [(3 * Math.PI) / 2, 43],
  [(7 * Math.PI) / 4, 74],
  [Math.PI * 2, 78]
];

function getFrameIndexForAngle(angle) {
  let nextAnchorIndex = 1;
  while (nextAnchorIndex < DIRECTION_FRAME_ANCHORS.length - 1 && angle > DIRECTION_FRAME_ANCHORS[nextAnchorIndex][0]) {
    nextAnchorIndex++;
  }

  const [startAngle, startFrame] = DIRECTION_FRAME_ANCHORS[nextAnchorIndex - 1];
  const [endAngle, endFrame] = DIRECTION_FRAME_ANCHORS[nextAnchorIndex];
  const progress = (angle - startAngle) / (endAngle - startAngle);
  const frame = Math.round(startFrame + progress * (endFrame - startFrame));
  return ((frame % NUM_FRAMES) + NUM_FRAMES) % NUM_FRAMES;
}

export default function HeroCanvas({ mousePos, onGazeUpdate, isLoaded, setIsLoaded }) {
  const canvasRef = useRef(null);
  const framesRef = useRef([]);
  const centerFrameRef = useRef(null);
  const currentAngleRef = useRef(0);
  const isEyeContactRef = useRef(false);
  const lastTimeRef = useRef(performance.now());
  const lastThrottleTimeRef = useRef(0);

  // 1. Preload all 63 avatar frames and the front-facing image
  useEffect(() => {
    let loadedCount = 0;
    const totalToLoad = NUM_FRAMES + 1;
    const images = [];

    const handleLoad = () => {
      loadedCount++;
      if (loadedCount >= totalToLoad) {
        setIsLoaded(true);
      }
    };

    // Decode every frame up front into an ImageBitmap so drawing a new pose never stalls on JPEG decoding
    const loadFrame = (src, store) => {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        store(img);
        const decoded = window.createImageBitmap ? createImageBitmap(img) : img.decode().then(() => img);
        decoded.then(store, () => {}).finally(handleLoad);
      };
      img.onerror = () => {
        console.warn(`Failed to load avatar image ${src}`);
        handleLoad();
      };
    };

    // Load the 63 supplied avatar frames
    for (let i = 0; i < NUM_FRAMES; i++) {
      loadFrame(`${import.meta.env.BASE_URL}avatar_frames/frame_${i}.jpg`, (frame) => { images[i] = frame; });
    }
    framesRef.current = images;

    // Load center neutral frame
    loadFrame(`${import.meta.env.BASE_URL}character_image_corrected.png`, (frame) => { centerFrameRef.current = frame; });
  }, [setIsLoaded]);

  // 2. High-performance 60 FPS RequestAnimationFrame Canvas Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });

    let animationFrameId;

    // Size the canvas to its hero section (not the window) so the page can scroll below it
    let width = 0;
    let height = 0;
    let lastDrawn = null;
    const handleResize = () => {
      lastDrawn = null;
      const dpr = window.devicePixelRatio || 1;
      width = canvas.clientWidth || window.innerWidth;
      height = canvas.clientHeight || window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    const render = (now) => {
      // Where the canvas sits on screen right now (it scrolls and has a parallax transform)
      const rect = canvas.getBoundingClientRect();
      const scaleX = rect.width / width;
      const scaleY = rect.height / height;

      // Delta time in seconds (clamped to prevent jumps after tab blur)
      const dt = Math.min((now - lastTimeRef.current) / 1000, 0.1);
      lastTimeRef.current = now;

      // 1920x1080 Aspect Ratio Cover calculation
      const imgWidth = 1920;
      const imgHeight = 1080;
      const imgRatio = imgWidth / imgHeight;
      const screenRatio = width / height;

      let renderW, renderH, offsetX, offsetY;

      if (screenRatio > imgRatio) {
        renderW = width;
        renderH = width / imgRatio;
        offsetX = 0;
        offsetY = (height - renderH) / 2;
      } else {
        renderH = height;
        renderW = height * imgRatio;
        offsetX = (width - renderW) / 2;
        offsetY = 0;
      }

      // Character face center coordinates on screen
      const faceCenterX = offsetX + renderW * 0.50;
      const faceCenterY = offsetY + renderH * 0.38;

      // Distance from face center, with the pointer mapped from viewport into canvas space
      const pointerX = (mousePos.current.x - rect.left) / scaleX;
      const pointerY = (mousePos.current.y - rect.top) / scaleY;
      const dx = pointerX - faceCenterX;
      const dy = pointerY - faceCenterY;
      const dist = Math.hypot(dx, dy);

      // Deadzone calculation with hysteresis to prevent flickering at boundaries
      const minScreenDim = Math.min(width, height);
      const deadzoneRadius = minScreenDim * 0.12;

      let isEyeContact = isEyeContactRef.current;
      if (!isEyeContact && dist < deadzoneRadius * 0.92) {
        isEyeContact = true;
      } else if (isEyeContact && dist > deadzoneRadius * 1.18) {
        isEyeContact = false;
      }
      isEyeContactRef.current = isEyeContact;

      // Calculate target angle in [0, 2*PI)
      let targetAngle = Math.atan2(dy, dx);
      if (targetAngle < 0) {
        targetAngle += 2 * Math.PI;
      }

      // Shortest-path circular angular lerp using framerate-independent exponential smoothing
      let diff = targetAngle - currentAngleRef.current;
      while (diff < -Math.PI) diff += 2 * Math.PI;
      while (diff > Math.PI) diff -= 2 * Math.PI;

      // Smooth lerp factor (~25ms response time, framerate independent)
      const lerpFactor = 1 - Math.exp(-40 * dt);
      currentAngleRef.current += diff * lerpFactor;
      currentAngleRef.current = (currentAngleRef.current + 2 * Math.PI) % (2 * Math.PI);

      // Calibrated to the supplied sequence's right, down, left, and up poses.
      const frameIndex = getFrameIndexForAngle(currentAngleRef.current);

      // Throttled telemetry update (~20fps); only the HUD and cursor subscribe to it
      if (onGazeUpdate && now - lastThrottleTimeRef.current > 50) {
        lastThrottleTimeRef.current = now;
        onGazeUpdate({
          angleDeg: Math.round((currentAngleRef.current * 180) / Math.PI),
          frameIndex,
          isEyeContact,
          dist: Math.round(dist)
        });
      }

      // Skip painting while the hero is scrolled out of view
      if (rect.bottom <= 0 || rect.top >= window.innerHeight) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      // Draw EXACTLY ONE crisp frame at 100% opacity, and only when the pose actually changed
      const frameToDraw = isEyeContact
        ? centerFrameRef.current
        : framesRef.current[frameIndex];

      if (frameToDraw && frameToDraw !== lastDrawn && (frameToDraw.width || frameToDraw.naturalWidth)) {
        ctx.fillStyle = BG_COLOR;
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(frameToDraw, offsetX, offsetY, renderW, renderH);
        lastDrawn = frameToDraw;
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [mousePos, onGazeUpdate]);

  return (
    <div className="canvas-container" style={{ backgroundColor: BG_COLOR }}>
      <canvas
        ref={canvasRef}
        className="hero-canvas"
        style={{ width: '100%', height: '100%', display: 'block' }}
      />
    </div>
  );
}
