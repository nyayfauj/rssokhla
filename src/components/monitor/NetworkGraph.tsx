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
    if (p.associates && Array.isArray(p.associates)) {
      p.associates.forEach(assoc => {
        if (nodeSet.has(assoc.profileId)) {
          const existing = edges.find(e =>
            (e.from === p.$id && e.to === assoc.profileId) ||
            (e.from === assoc.profileId && e.to === p.$id)
          );
          if (!existing) {
            edges.push({ from: p.$id, to: assoc.profileId, relationship: assoc.relationship });
          }
        }
      });
    }
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

  useEffect(() => {
    graphRef.current = buildGraph(profiles);
  }, [profiles]);

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

  const simulate = useCallback(() => {
    const { nodes, edges } = graphRef.current;
    const cx = dimensions.w / 2;
    const cy = dimensions.h / 2;
    const damping = 0.85;

    nodes.forEach(n => {
      n.vx += (cx - n.x) * 0.002;
      n.vy += (cy - n.y) * 0.002;
    });

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

    nodes.forEach(n => {
      n.vx *= damping;
      n.vy *= damping;
      n.x += n.vx;
      n.y += n.vy;
      n.x = Math.max(n.radius, Math.min(dimensions.w - n.radius, n.x));
      n.y = Math.max(n.radius, Math.min(dimensions.h - n.radius, n.y));
    });
  }, [dimensions]);

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

        if (e.relationship === 'senior') {
          const mx = (a.x + b.x) / 2;
          const my = (a.y + b.y) / 2;
          ctx.fillStyle = 'rgba(220,38,38,0.4)';
          ctx.beginPath();
          ctx.arc(mx, my, 2, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      nodes.forEach(n => {
        const threat = THREAT_COLORS[n.profile.threatLevel];
        const isSelected = selected?.$id === n.id;
        const r = n.radius;

        if (n.profile.threatLevel === 'critical') {
          const glow = ctx.createRadialGradient(n.x, n.y, r, n.x, n.y, r + 8);
          glow.addColorStop(0, 'rgba(220,38,38,0.15)');
          glow.addColorStop(1, 'rgba(220,38,38,0)');
          ctx.fillStyle = glow;
          ctx.beginPath();
          ctx.arc(n.x, n.y, r + 8, 0, Math.PI * 2);
          ctx.fill();
        }

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

        ctx.strokeStyle = isSelected ? '#ffffff' : 'rgba(255,255,255,0.15)';
        ctx.lineWidth = isSelected ? 2 : 0.8;
        ctx.stroke();

        ctx.fillStyle = '#ffffff';
        ctx.font = `bold ${r * 0.6}px Inter, sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        const initial = n.profile.fullName?.charAt(0) || '?';
        ctx.fillText(initial, n.x, n.y);

        ctx.fillStyle = isSelected ? '#d4d4d8' : '#71717a';
        ctx.font = `${Math.max(8, r * 0.35)}px Inter, sans-serif`;
        const name = n.profile.fullName || 'Unknown';
        ctx.fillText(
          name.length > 12 ? name.substring(0, 11) + '\u2026' : name,
          n.x, n.y + r + 10
        );
      });

      const scanY = (frame % 200) / 200 * dimensions.h;
      ctx.beginPath();
      ctx.moveTo(0, scanY);
      ctx.lineTo(dimensions.w, scanY);
      ctx.strokeStyle = 'rgba(239, 68, 68, 0.05)';
      ctx.lineWidth = 1;
      ctx.stroke();

      frame++;
      animRef.current = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(animRef.current);
  }, [dimensions, selected, simulate]);

  const handleClick = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX / 2;
    const y = (e.clientY - rect.top) * scaleY / 2;
    const { nodes } = graphRef.current;
    const clicked = nodes.find(n => {
      const dx = n.x - x;
      const dy = n.y - y;
      return Math.sqrt(dx * dx + dy * dy) < n.radius;
    });
    setSelected(clicked ? clicked.profile : null);
  }, []);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLCanvasElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      const { nodes } = graphRef.current;
      if (nodes.length > 0) setSelected(prev => prev ? null : nodes[0].profile);
    }
  }, []);

  const associatesCount = selected?.associates?.length ?? 0;
  const sightingsCount = selected?.sightings?.length ?? 0;
  const rankLabel = selected?.rank ? RANK_LABELS[selected.rank]?.label || selected.rank : '';
  const affiliationLabels = selected?.affiliations?.map(a => AFFILIATION_LABELS[a]?.label || a).join(', ') || '';

  return (
    <div className="bg-zinc-900/30 border border-zinc-800/40 rounded-2xl overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800/40 bg-zinc-900/60">
        <div className="flex items-center gap-2">
          <span className="text-sm" aria-hidden="true">&#x1F578;&#xFE0F;</span>
          <span className="text-xs font-semibold text-zinc-400 uppercase tracking-widest">Network Map</span>
        </div>
        <span className="text-xs text-zinc-600">{profiles.length} profiles</span>
      </div>

      <div ref={containerRef} className="relative">
        <canvas
          ref={canvasRef}
          className="w-full cursor-pointer"
          style={{ height: dimensions.h }}
          onClick={handleClick}
          onKeyDown={handleKeyDown}
          tabIndex={0}
          role="img"
          aria-label="Interactive network visualization of community profiles. Click or tap a node to view details."
        />

        {selected && (
          <div className="absolute bottom-2 left-2 right-2 bg-zinc-900/95 backdrop-blur-xl border border-zinc-800/50 rounded-xl p-3 animate-fade-in">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold text-white ${
                  selected.threatLevel === 'critical' ? 'bg-red-700' : selected.threatLevel === 'high' ? 'bg-amber-700' : 'bg-zinc-700'
                }`}>{selected.fullName?.charAt(0) || '?'}</div>
                <div>
                  <p className="text-xs font-semibold text-white">{selected.fullName || 'Unknown'}</p>
                  <p className="text-xs text-zinc-500">{rankLabel}{rankLabel && affiliationLabels ? ' \u00B7 ' : ''}{affiliationLabels}</p>
                </div>
              </div>
              <button onClick={() => setSelected(null)} className="text-zinc-600 hover:text-white text-sm p-1" aria-label="Close profile details">&#x2715;</button>
            </div>
            <div className="flex gap-3 mt-2">
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${THREAT_COLORS[selected.threatLevel]?.bg || ''} ${THREAT_COLORS[selected.threatLevel]?.text || ''}`}>
                {THREAT_COLORS[selected.threatLevel]?.label?.toUpperCase() || 'Unknown'}
              </span>
              <span className="text-xs text-zinc-500">{associatesCount} associates</span>
              <span className="text-xs text-zinc-500">{sightingsCount} sightings</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
