"use client";

import { useEffect, useRef } from "react";

interface ConstellationNode {
  x: number;
  y: number;
}

const LINK_DISTANCE = 150;
const NODE_DENSITY = 26000;
const NODE_COUNT_MIN = 22;
const NODE_COUNT_MAX = 60;

/**
 * Motif « constellation des nations » : réseau de points reliés.
 * Rendu une seule fois, immobile — aucune dérive d'ambiance.
 * (Remplacé par la figure construite du hero dans le commit suivant.)
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

    let width = 0;
    let height = 0;
    let nodes: ConstellationNode[] = [];

    function seedNodes() {
      const target = Math.floor((width * height) / NODE_DENSITY);
      const count = Math.max(NODE_COUNT_MIN, Math.min(NODE_COUNT_MAX, target));
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
      }));
    }

    function draw() {
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i];
          const b = nodes[j];
          const dist = Math.hypot(a.x - b.x, a.y - b.y);
          if (dist < LINK_DISTANCE) {
            ctx.globalAlpha = (1 - dist / LINK_DISTANCE) * 0.4;
            ctx.strokeStyle = linkColor;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }
      ctx.globalAlpha = 0.9;
      ctx.fillStyle = nodeColor;
      for (const node of nodes) {
        ctx.beginPath();
        ctx.arc(node.x, node.y, 1.6, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    }

    function resize() {
      if (!canvas || !ctx) return;
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.round(width * dpr));
      canvas.height = Math.max(1, Math.round(height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seedNodes();
      draw();
    }

    resize();
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);
    return () => resizeObserver.disconnect();
  }, []);

  return <canvas ref={canvasRef} aria-hidden="true" className={className} />;
}
