"use client";

import { useEffect, useRef } from "react";

interface ConstellationNode {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

const DRIFT_SPEED = 0.05;
const LINK_DISTANCE = 150;
const NODE_DENSITY = 26000;
const NODE_COUNT_MIN = 22;
const NODE_COUNT_MAX = 60;

/**
 * Motif signature « constellation des nations » : un réseau de points reliés,
 * évoquant à la fois la théorie des graphes et les délégations francophones
 * réunies à Dakar. Dérive lente, toujours désactivée sous prefers-reduced-motion.
 */
export function Constellation({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const style = getComputedStyle(document.documentElement);
    const nodeColor = style.getPropertyValue("--or-clair").trim() || "#e8c97a";
    const linkColor = style.getPropertyValue("--or").trim() || "#c9a84c";

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    let width = 0;
    let height = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let nodes: ConstellationNode[] = [];
    let frame: number | null = null;
    let visible = true;

    function seedNodes() {
      const target = Math.floor((width * height) / NODE_DENSITY);
      const count = Math.max(NODE_COUNT_MIN, Math.min(NODE_COUNT_MAX, target));
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * DRIFT_SPEED,
        vy: (Math.random() - 0.5) * DRIFT_SPEED,
      }));
    }

    function resize() {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.round(width * dpr));
      canvas.height = Math.max(1, Math.round(height * dpr));
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      seedNodes();
    }

    function draw() {
      ctx!.clearRect(0, 0, width, height);

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i];
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < LINK_DISTANCE) {
            ctx!.globalAlpha = (1 - dist / LINK_DISTANCE) * 0.4;
            ctx!.strokeStyle = linkColor;
            ctx!.lineWidth = 1;
            ctx!.beginPath();
            ctx!.moveTo(a.x, a.y);
            ctx!.lineTo(b.x, b.y);
            ctx!.stroke();
          }
        }
      }

      ctx!.globalAlpha = 0.9;
      ctx!.fillStyle = nodeColor;
      for (const node of nodes) {
        ctx!.beginPath();
        ctx!.arc(node.x, node.y, 1.6, 0, Math.PI * 2);
        ctx!.fill();
      }
      ctx!.globalAlpha = 1;
    }

    function step() {
      for (const node of nodes) {
        node.x += node.vx;
        node.y += node.vy;
        if (node.x <= 0 || node.x >= width) node.vx *= -1;
        if (node.y <= 0 || node.y >= height) node.vy *= -1;
      }
      draw();
      frame = !prefersReducedMotion && visible ? requestAnimationFrame(step) : null;
    }

    resize();
    draw();
    if (!prefersReducedMotion) {
      frame = requestAnimationFrame(step);
    }

    const resizeObserver = new ResizeObserver(() => {
      resize();
      draw();
    });
    resizeObserver.observe(canvas);

    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible && !prefersReducedMotion && frame === null) {
          frame = requestAnimationFrame(step);
        }
      },
      { threshold: 0 }
    );
    intersectionObserver.observe(canvas);

    return () => {
      if (frame !== null) cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden="true" className={className} />;
}
