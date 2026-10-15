import React, { useRef, useEffect, useCallback } from 'react';

// Palette matching desktop Horizone IDE EffortSlider / Electric
// Lavender (#8B7BFF), Strike (#6EC8FF), Core (#F5FAFF)
export default function ElectricSlider({ value, min = 0, max = 3, onChange }) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const isDraggingRef = useRef(false);
  const animFrameRef = useRef(null);
  const stateRef = useRef({
    time: 0,
    strikeLight: 0,
    glowEnergy: 0.8,
    boltVer: 0,
    sparks: []
  });

  const isUltra = value >= max;

  // Handle pointer interactions
  const updateValueFromPointer = useCallback((clientX) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const trackPadding = 8;
    const availableWidth = rect.width - trackPadding * 2;
    const x = Math.max(0, Math.min(availableWidth, clientX - rect.left - trackPadding));
    const ratio = x / availableWidth;
    const rawVal = min + ratio * (max - min);
    const stepped = Math.round(rawVal);
    if (stepped !== value) {
      onChange(stepped);
    }
  }, [min, max, value, onChange]);

  const onPointerDown = (e) => {
    isDraggingRef.current = true;
    containerRef.current?.setPointerCapture(e.pointerId);
    updateValueFromPointer(e.clientX);
  };

  const onPointerMove = (e) => {
    if (isDraggingRef.current) {
      updateValueFromPointer(e.clientX);
    }
  };

  const onPointerUp = (e) => {
    isDraggingRef.current = false;
    try {
      containerRef.current?.releasePointerCapture(e.pointerId);
    } catch {}
  };

  // Canvas electric rendering loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let running = true;
    let lastTime = performance.now();

    const render = (now) => {
      if (!running) return;
      const dt = Math.min(0.05, (now - lastTime) / 1000);
      lastTime = now;

      const dpr = window.devicePixelRatio || 1;
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
        canvas.width = width * dpr;
        canvas.height = height * dpr;
      }

      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, width, height);

      const trackHeight = 24;
      const trackTop = (height - trackHeight) / 2;
      const inset = 6;
      const trackWidth = width - inset * 2;
      const thumbWidth = 16;
      const progressRatio = (value - min) / Math.max(1, max - min);
      const thumbX = inset + progressRatio * (trackWidth - thumbWidth);

      // Track rounded rect path
      ctx.beginPath();
      ctx.roundRect(inset, trackTop, trackWidth, trackHeight, 6);

      // If in ultra/max level, animate electric lightning and matrix pixels
      if (isUltra) {
        stateRef.current.time += dt;

        // Pulse energy & strike flashes
        if (Math.random() < 0.08) {
          stateRef.current.strikeLight = 1.0;
        } else {
          stateRef.current.strikeLight *= Math.exp(-dt * 6);
        }

        const glowEnergy = 0.5 + 0.5 * Math.sin(stateRef.current.time * 5);
        const strike = stateRef.current.strikeLight;

        // Outer glow
        ctx.shadowColor = strike > 0.4 ? 'rgba(110, 200, 255, 0.7)' : 'rgba(139, 123, 255, 0.4)';
        ctx.shadowBlur = 10 + 6 * glowEnergy;
      } else {
        ctx.shadowBlur = 0;
      }

      // Base track background
      ctx.fillStyle = '#26262B';
      ctx.fill();
      ctx.shadowBlur = 0; // reset

      // Active electric fill area up to thumb center
      const activeWidth = thumbX + thumbWidth / 2 - inset;

      if (activeWidth > 0) {
        ctx.save();
        ctx.beginPath();
        ctx.roundRect(inset, trackTop, trackWidth, trackHeight, 6);
        ctx.clip(); // clip to track bounds

        ctx.beginPath();
        ctx.rect(inset, trackTop, activeWidth, trackHeight);
        ctx.clip(); // clip to progress width

        // Dark digital background
        ctx.fillStyle = '#181628';
        ctx.fillRect(inset, trackTop, activeWidth, trackHeight);

        if (isUltra) {
          // Pixel matrix background dots
          const pixelSize = 3;
          const gap = 1.5;
          const step = pixelSize + gap;
          const rows = Math.floor(trackHeight / step);
          const cols = Math.floor(activeWidth / step);

          for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
              const px = inset + c * step + 1;
              const py = trackTop + r * step + 1;
              const flicker = Math.sin(c * 0.4 + stateRef.current.time * 8 + r * 1.5);
              const alpha = Math.max(0.08, 0.28 + 0.35 * flicker);
              ctx.fillStyle = `rgba(139, 123, 255, ${alpha})`;
              ctx.fillRect(px, py, pixelSize, pixelSize);
            }
          }

          // Electric dynamic lightning strand
          ctx.beginPath();
          ctx.moveTo(inset, trackTop + trackHeight / 2);

          const segments = 16;
          const dx = activeWidth / segments;
          for (let s = 1; s <= segments; s++) {
            const x = inset + s * dx;
            const noise = (Math.sin(s * 1.7 + stateRef.current.time * 18) + (Math.random() - 0.5) * 0.8) * 4.5;
            const y = trackTop + trackHeight / 2 + (s === segments ? 0 : noise);
            ctx.lineTo(x, y);
          }

          // Layer 0: Wide Cyan Glow
          ctx.strokeStyle = 'rgba(110, 200, 255, 0.45)';
          ctx.lineWidth = 4;
          ctx.lineCap = 'round';
          ctx.stroke();

          // Layer 1: Bright Blue Core
          ctx.strokeStyle = 'rgba(140, 215, 255, 0.85)';
          ctx.lineWidth = 2;
          ctx.stroke();

          // Layer 2: White Hot Filament
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.95)';
          ctx.lineWidth = 1;
          ctx.stroke();
        } else {
          // Standard blue-lavender gradient for lower levels
          const grad = ctx.createLinearGradient(inset, 0, inset + activeWidth, 0);
          grad.addColorStop(0, '#2A2550');
          grad.addColorStop(1, '#6366F1');
          ctx.fillStyle = grad;
          ctx.fillRect(inset, trackTop, activeWidth, trackHeight);
        }

        ctx.restore();
      }

      // Stop dots
      for (let i = min; i <= max; i++) {
        const dotRatio = (i - min) / Math.max(1, max - min);
        const dotX = inset + thumbWidth / 2 + dotRatio * (trackWidth - thumbWidth);
        const dotY = trackTop + trackHeight / 2;
        ctx.beginPath();
        ctx.arc(dotX, dotY, 2, 0, Math.PI * 2);
        ctx.fillStyle = '#555562';
        ctx.fill();
      }

      // Thumb
      ctx.beginPath();
      ctx.roundRect(thumbX, trackTop, thumbWidth, trackHeight, 5);

      if (isUltra) {
        ctx.shadowColor = 'rgba(140, 215, 255, 0.9)';
        ctx.shadowBlur = 10;
        ctx.fillStyle = '#FFFFFF';
        ctx.fill();
        ctx.shadowBlur = 0;
      } else {
        ctx.fillStyle = '#ECECEC';
        ctx.fill();
      }

      ctx.restore();
      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      running = false;
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [value, min, max, isUltra]);

  return (
    <div
      ref={containerRef}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      className="w-full h-11 relative cursor-pointer select-none touch-none flex items-center"
    >
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
}
