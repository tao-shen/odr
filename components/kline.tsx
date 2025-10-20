'use client';

import { useEffect, useRef } from 'react';

interface KlineProps {
  symbol?: string; // e.g. BINANCE:BTCUSDT
  height?: number;
}

export function Kline({ symbol = 'BINANCE:BTCUSDT', height = 180 }: KlineProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;

    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-mini-symbol-overview.js';
    script.async = true;
    script.innerHTML = JSON.stringify({
      symbol,
      width: '100%',
      height,
      locale: 'en',
      dateRange: '1D',
      colorTheme: 'dark',
      isTransparent: true,
      autosize: true,
      largeChartUrl: '',
      noTimeScale: false,
    });
    container.innerHTML = '';
    const widget = document.createElement('div');
    widget.className = 'tradingview-widget-container__widget';
    container.appendChild(widget);
    container.appendChild(script);

    return () => {
      container.innerHTML = '';
    };
  }, [symbol, height]);

  return (
    <div className="tradingview-widget-container w-full overflow-hidden rounded-md border border-crypto-gold/20">
      <div ref={containerRef} />
    </div>
  );
}


