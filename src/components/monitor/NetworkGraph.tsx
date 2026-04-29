// ─── Karyakarta Network Visualization ───────────────────────

'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import { THREAT_COLORS, RANK_LABELS, AFFILIATION_LABELS } from '@/types/karyakarta.types';
import type { KaryakartaProfile } from '@/types/karyakarta.types';

interface NetworkNode {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  profile: KaryakartaProfile;
  radius: number;
}

interface NetworkEdge {
  from: string;
  to: string;
  relationship: string;
}

function buildGraph(profiles: KaryakartaProfile[]) {
  // Deterministic jitter
  const jitter = (i: number, offset: number) => (((i * 2654435761 + offset * 1597334677) >>> 0) % 80 - 40);
  const nodes: NetworkNode[] = profiles.map((p, i) => {
    const angle = (i / profiles.length) * Math.PI * 2;
    const radius = 120;
    return {
      id: p.$id,
      x: 200 + Math.cos(angle) * radius + jitter(i, 1),
      y: 200 + Math.sin(angle) * radius + jitter(i, 2),
      vx: 0, vy: 0,
      profile: p,
      radius: p.threatLevel === 'critical' ? 28 : p.threatLevel === 'high' ? 24 : 20,
    };
  });

  const edges: NetworkEdge[] = [];
  const nodeSet = new Set(profiles.map(p => p.$id));

  profiles.forEach(p => {
    p.associates.forEach(assoc => {
      if (nodeSet.has(assoc.profileId)) {
        // Avoid duplicate edges
        const existing = edges.find(e =>
          (e.from === p.$id && e.to === assoc.profileId) ||
          (e.from === assoc.profileId && e.to === p.$id)
        );
        if (!existing) {
          edges.push({ from: p.$id, to: assoc.profileId, relationship: assoc.relationship });
        }
      }
    });
  });

  return { nodes, edges };
}

interface Props {
  profiles: KaryakartaProfile[];
}

export default function NetworkGraph({ profiles }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [selected, setSelected] = useState<KaryakartaProfile | null>(null);
  const [dimensions, setDimensions] = useState({ w: 400, h: 350 });
  const graphRef = useRef(buildGraph(profiles));
  const animRef = useRef<number>(0);

  // Update graph if profiles change
  useEffect(() => {
    graphRef.current = buildGraph(profiles);
  }, [profiles]);

  // Resize observer
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const obs = new ResizeObserver(entries => {
      const { width } = entries[0].contentRect;
      setDimensions({ w: width, h: Math.min(350, width * 0.8) });
    });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // Simple force simulation
  const simulate = useCallback(() => {
    const { nodes, edges } = graphRef.current;
    const cx = dimensions.w / 2;
    const cy = dimensions.h / 2;
    const damping = 0.85;

    // Center gravity
    nodes.forEach(n => {
      n.vx += (cx - n.x) * 0.002;
      n.vy += (cy - n.y) * 0.002;
    });

    // Node repulsion
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[j].x - nodes[i].x;
        const dy = nodes[j].y - nodes[i].y;
        const d = Math.max(Math.sqrt(dx * dx + dy * dy), 1);
        const force = 800 / (d * d);
        nodes[i].vx -= (dx / d) * force;
        nodes[i].vy -= (dy / d) * force;
        nodes[j].vx += (dx / d) * force;
        nodes[j].vy += (dy / d) * force;
      }
    }

    // Edge attraction
    edges.forEach(e => {
      const a = nodes.find(n => n.id === e.from);
      const b = nodes.find(n => n.id === e.to);
      if (!a || !b) return;
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const d = Math.sqrt(dx * dx + dy * dy);
      const force = (d - 100) * 0.003;
      a.vx += (dx / d) * force;
      a.vy += (dy / d) * force;
      b.vx -= (dx / d) * force;
      b.vy -= (dy / d) * force;
    });

    // Update positions
    nodes.forEach(n => {
      n.vx *= damping;
      n.vy *= damping;
      n.x += n.vx;
      n.y += n.vy;
      // Bounds
      n.x = Math.max(n.radius, Math.min(dimensions.w - n.radius, n.x));
      n.y = Math.max(n.radius, Math.min(dimensions.h - n.radius, n.y));
    });
  }, [dimensions]);

  // Render loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = dimensions.w * 2;
    canvas.height = dimensions.h * 2;
    ctx.scale(2, 2);

    let frame = 0;
    const draw = () => {
      simulate();
      ctx.clearRect(0, 0, dimensions.w, dimensions.h);

      const { nodes, edges } = graphRef.current;

      // Draw edges
      edges.forEach(e => {
        const a = nodes.find(n => n.id === e.from);
        const b = nodes.find(n => n.id === e.to);
        if (!a || !b) return;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        const isSenior = e.relationship === 'senior' || e.relationship === 'junior';
        ctx.strokeStyle = isSenior ? 'rgba(220,38,38,0.25)' : 'rgba(255,255,255,0.08)';
        ctx.lineWidth = isSenior ? 1.5 : 0.8;
        ctx.setLineDash(isSenior ? [] : [3, 3]);
        ctx.stroke();
        ctx.setLineDash([]);

        // Direction arrow for senior relationships
        if (e.relationship === 'senior') {
          const mx = (a.x + b.x) / 2;
          const my = (a.y + b.y) / 2;
          ctx.fillStyle = 'rgba(220,38,38,0.4)';
          ctx.beginPath();
          ctx.arc(mx, my, 2, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      // Draw nodes
      nodes.forEach(n => {
        const threat = THREAT_COLORS[n.profile.threatLevel];
        const isSelected = selected?.$id === n.id;
        const r = n.radius;

        // Outer glow
        if (n.profile.threatLevel === 'critical') {
          const glow = ctx.createRadialGradient(n.x, n.y, r, n.x, n.y, r + 8);
          glow.addColorStop(0, 'rgba(220,38,38,0.15)');
          glow.addColorStop(1, 'rgba(220,38,38,0)');
          ctx.fillStyle = glow;
          ctx.beginPath();
          ctx.arc(n.x, n.y, r + 8, 0, Math.PI * 2);
          ctx.fill();
        }

        // Circle
        ctx.beginPath();
        ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
        const grad = ctx.createRadialGradient(n.x - r * 0.3, n.y - r * 0.3, 0, n.x, n.y, r);
        if (n.profile.threatLevel === 'critical') {
          grad.addColorStop(0, '#991b1b');
          grad.addColorStop(1, '#450a0a');
        } else if (n.profile.threatLevel === 'high') {
          grad.addColorStop(0, '#92400e');
          grad.addColorStop(1, '#451a03');
        } else {
          grad.addColorStop(0, '#3f3f46');
          grad.addColorStop(1, '#18181b');
        }
        ctx.fillStyle = grad;
        ctx.fill();

        // Border
        ctx.strokeStyle = isSelected ? '#ffffff' : 'rgba(255,255,255,0.15)';
        ctx.lineWidth = isSelected ? 2 : 0.8;
        ctx.stroke();

        // Initial letter
        ctx.fillStyle = '#ffffff';
        ctx.font = `bold ${r * 0.6}px Inter, sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(n.profile.fullName.charAt(0), n.x, n.y);

        // Name below
        ctx.fillStyle = isSelected ? '#d4d4d8' : '#71717a';
        ctx.font = `${Math.max(8, r * 0.35)}px Inter, sans-serif`;
        ctx.fillText(
          n.profile.fullName.length > 12 ? n.profile.fullName.substring(0, 11) + '…' : n.profile.fullName,
          n.x, n.y + r + 10
        );
      });

      frame++;
      if (frame < 200) animRef.current = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(animRef.current);
  }, [dimensions, selected, simulate]);

  // Click handler
  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const { nodes } = graphRef.current;
    const clicked = nodes.find(n => {
      const dx = n.x - x;
      const dy = n.y - y;
      return Math.sqrt(dx * dx + dy * dy) < n.radius;
    });
    setSelected(clicked ? clicked.profile : null);
  };

  return (
    <div className="bg-zinc-900/30 border border-zinc-800/40 rounded-2xl overflow-hidden">
      <div className="flex items-center justify-between px-3 sm:px-4 py-2.5 border-b border-zinc-800/40 bg-zinc-900/60">
        <div className="flex items-center gap-2">
          <span className="text-xs">🕸️</span>
          <span className="text-[10px] sm:text-xs font-semibold text-zinc-400 uppercase tracking-widest">Network Map</span>
        </div>
        <span className="text-[10px] text-zinc-600">{profiles.length} operatives</span>
      </div>

      <div ref={containerRef} className="relative">
        <canvas
          ref={canvasRef}
          className="w-full cursor-pointer"
          style={{ height: dimensions.h }}
          onClick={handleClick}
        />

        {/* Selected profile detail */}
        {selected && (
          <div className="absolute bottom-2 left-2 right-2 bg-zinc-900/95 backdrop-blur-xl border border-zinc-800/50 rounded-xl p-2.5 animate-fade-in">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold text-white ${
                  selected.threatLevel === 'critical' ? 'bg-red-700' : selected.threatLevel === 'high' ? 'bg-amber-700' : 'bg-zinc-700'
                }`}>{selected.fullName.charAt(0)}</div>
                <div>
                  <p className="text-xs font-semibold text-white">{selected.fullName}</p>
                  <p className="text-[10px] text-zinc-500">{RANK_LABELS[selected.rank].label} · {selected.affiliations.map(a => AFFILIATION_LABELS[a].label).join(', ')}</p>
                </div>
              </div>
              <button onClick={() => setSelected(null)} className="text-zinc-600 text-xs">✕</button>
            </div>
            <div className="flex gap-2 mt-1.5">
              <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${THREAT_COLORS[selected.threatLevel].bg} ${THREAT_COLORS[selected.threatLevel].text}`}>
                {THREAT_COLORS[selected.threatLevel].label.toUpperCase()}
              </span>
              <span className="text-[10px] text-zinc-500">{selected.associates.length} associates</span>
              <span className="text-[10px] text-zinc-500">{selected.sightings.length} sightings</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}



