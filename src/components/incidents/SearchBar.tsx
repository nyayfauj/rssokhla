// ─── Search Component ───────────────────────────────────────

'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useIncidentsStore } from '@/stores/incidents.store';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { INCIDENT_CATEGORIES } from '@/lib/utils/constants';
import { timeAgo, truncate } from '@/lib/utils/formatters';
import type { Incident } from '@/types/incident.types';

interface SearchBarProps {
  placeholder?: string;
}

export default function SearchBar({ placeholder = 'Search incidents...' }: SearchBarProps) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState<Incident[]>([]);
  const incidents = useIncidentsStore((s) => s.incidents);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleSearch = useCallback(
    (value: string) => {
      setQuery(value);
      if (value.length < 2) {
        setResults([]);
        return;
      }

      const lowerQ = value.toLowerCase();
      const matched = incidents.filter(
        (i) =>
          i.title.toLowerCase().includes(lowerQ) ||
          i.description.toLowerCase().includes(lowerQ) ||
          i.tags.some((t) => t.toLowerCase().includes(lowerQ)) ||
          i.category.toLowerCase().includes(lowerQ)
      );

      setResults(matched.slice(0, 8));
    },
    [incidents]
  );

  return (
    <div ref={containerRef} className="relative">
      {/* Search input */}
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 text-sm">🔍</span>
        <input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          onFocus={() => setIsOpen(true)}
          className="w-full bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-600 rounded-xl pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500/50 transition-all"
        />
        {query && (
          <button
            onClick={() => { setQuery(''); setResults([]); setIsOpen(false); }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-400"
          >
            ✕
          </button>
        )}
      </div>

      {/* Results dropdown */}
      {isOpen && query.length >= 2 && (
        <div className="absolute top-full left-0 right-0 mt-2 z-50 bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl shadow-black/40 overflow-hidden max-h-80 overflow-y-auto">
          {results.length > 0 ? (
            <div>
              <div className="px-3 py-2 border-b border-zinc-800">
                <span className="text-[10px] text-zinc-500">{results.length} result{results.length !== 1 ? 's' : ''}</span>
              </div>
              {results.map((incident) => {
                const cat = INCIDENT_CATEGORIES[incident.category];
                return (
                  <button
                    key={incident.$id}
                    onClick={() => {
                      router.push(`/incidents/${incident.$id}`);
                      setIsOpen(false);
                      setQuery('');
                    }}
                    className="w-full text-left px-3 py-2.5 hover:bg-zinc-800 transition-colors flex items-start gap-2.5 border-b border-zinc-800/50 last:border-0"
                  >
                    <span className="text-sm mt-0.5">{cat.icon}</span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-white font-medium truncate">{incident.title}</p>
                      <p className="text-[11px] text-zinc-500 mt-0.5">{truncate(incident.description, 60)}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="default" size="sm">{cat.label}</Badge>
                        <span className="text-[10px] text-zinc-600">{timeAgo(incident.timestamp)}</span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="px-4 py-6 text-center">
              <span className="text-2xl">🔍</span>
              <p className="text-xs text-zinc-500 mt-2">No incidents match &ldquo;{query}&rdquo;</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
