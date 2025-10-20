'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Button } from './ui/button';
import { CodeIcon, EyeIcon } from 'lucide-react';

// Clean Mermaid code by removing invalid characters for timeline
function cleanMermaidCode(code: string): string {
  // Check if it's a timeline diagram
  if (!code.includes('timeline')) {
    return code;
  }
  
  // Split into lines
  const lines = code.split('\n');
  const cleanedLines = lines.map(line => {
    // Don't modify the timeline or title lines
    if (line.trim().startsWith('timeline') || line.trim().startsWith('title')) {
      return line;
    }
    
    // For timeline entries, replace dashes with spaces or remove them
    // This handles cases like "blockchain technology : -------"
    if (line.includes(':')) {
      // Remove sequences of dashes (2 or more)
      line = line.replace(/-{2,}/g, '');
      // Replace single dashes between words with spaces
      line = line.replace(/\s+-\s+/g, ' ');
      // Remove dashes at the end of lines (after colons)
      line = line.replace(/:\s*-+\s*$/g, ':');
      // Remove trailing dashes
      line = line.replace(/-+$/g, '');
      // Replace dashes in compound words with spaces
      line = line.replace(/(\w)-(\w)/g, '$1 $2');
    }
    
    return line;
  });
  
  // Filter out empty lines at the end
  while (cleanedLines.length > 0 && !cleanedLines[cleanedLines.length - 1].trim()) {
    cleanedLines.pop();
  }
  
  return cleanedLines.join('\n');
}

// Lightweight client-side Mermaid renderer
export function Mermaid({ code }: { code: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [showCode, setShowCode] = useState(false);
  const cleanedCode = cleanMermaidCode(code);

  useEffect(() => {
    if (showCode) return; // Don't render if showing code
    
    let isMounted = true;
    setError(null);
    
    async function renderMermaid() {
      try {
        // Dynamic import to avoid SSR issues
        const mermaid = (await import('mermaid')).default;
        mermaid.initialize({ startOnLoad: false, theme: 'dark', securityLevel: 'loose' });
        const id = `mermaid-${Math.random().toString(36).slice(2)}`;
        const { svg } = await mermaid.render(id, cleanedCode);
        if (isMounted && containerRef.current) {
          containerRef.current.innerHTML = svg;
        }
      } catch (e: any) {
        // Only show error if it's not a parsing error from incomplete code
        if (isMounted) {
          // Silently ignore errors during streaming (incomplete code)
          // Only show persistent errors
          console.warn('Mermaid render warning:', e?.message);
          setError(e?.message || 'Failed to render diagram');
        }
      }
    }
    
    // Add a small delay to avoid rendering incomplete code during streaming
    const timeoutId = setTimeout(() => {
      renderMermaid();
    }, 100);
    
    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
  }, [cleanedCode, showCode]);

  if (error) {
    return (
      <div className="flex flex-col gap-2 border border-red-400/20 rounded-xl p-4">
        <div className="text-xs text-red-400">
          Mermaid render error: {error}
        </div>
        <pre className="text-sm w-full overflow-x-auto dark:bg-zinc-900 p-4 border border-zinc-200 dark:border-zinc-700 rounded-xl dark:text-zinc-50 text-zinc-900">
          <code className="whitespace-pre-wrap break-words">{cleanedCode}</code>
        </pre>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="flex justify-end">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowCode(!showCode)}
          className="text-xs gap-2"
        >
          {showCode ? (
            <>
              <EyeIcon className="w-4 h-4" />
              Show Diagram
            </>
          ) : (
            <>
              <CodeIcon className="w-4 h-4" />
              Show Code
            </>
          )}
        </Button>
      </div>
      
      {showCode ? (
        <pre className="text-sm w-full overflow-x-auto dark:bg-zinc-900 p-4 border border-zinc-200 dark:border-zinc-700 rounded-xl dark:text-zinc-50 text-zinc-900">
          <code className="whitespace-pre-wrap break-words">{cleanedCode}</code>
        </pre>
      ) : (
        <div className="w-full overflow-auto border border-zinc-200 dark:border-zinc-700 rounded-xl p-4">
          <div ref={containerRef} className="min-w-[320px]" />
        </div>
      )}
    </div>
  );
}


