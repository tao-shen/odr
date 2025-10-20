'use client';

import React, { useEffect, useRef, useState } from 'react';

// Lightweight client-side Mermaid renderer
export function Mermaid({ code }: { code: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function renderMermaid() {
      try {
        // Dynamic import to avoid SSR issues
        const mermaid = (await import('mermaid')).default;
        mermaid.initialize({ startOnLoad: false, theme: 'dark', securityLevel: 'loose' });
        const id = `mermaid-${Math.random().toString(36).slice(2)}`;
        const { svg } = await mermaid.render(id, code);
        if (isMounted && containerRef.current) {
          containerRef.current.innerHTML = svg;
        }
      } catch (e: any) {
        if (isMounted) setError(e?.message || 'Failed to render diagram');
      }
    }
    renderMermaid();
    return () => {
      isMounted = false;
    };
  }, [code]);

  if (error) {
    return (
      <div className="text-xs text-red-400">
        Mermaid render error: {error}
      </div>
    );
  }

  return (
    <div className="w-full overflow-auto">
      <div ref={containerRef} className="min-w-[320px]" />
    </div>
  );
}


