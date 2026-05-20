'use client';

import { useEffect, useRef, useState } from 'react';

interface ExpertBadgeProps {
  expertName: string;
  expertTitle: string;
  trustScore: number;
}

export default function ExpertBadgeWidget({ expertName, expertTitle, trustScore }: ExpertBadgeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (containerRef.current && !containerRef.current.shadowRoot) {
      const shadowRoot = containerRef.current.attachShadow({ mode: 'open' });
      
      // Scoped styling for clean layout isolation (under 50kb gzip)
      const styleTag = document.createElement('style');
      styleTag.textContent = `
        .badge-container {
          font-family: system-ui, -apple-system, sans-serif;
          background: #09090b;
          color: #f8fafc;
          border: 1px solid rgba(255, 255, 255, 0.1);
          padding: 16px;
          border-radius: 12px;
          max-width: 280px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.4);
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #6366f1;
          font-weight: 700;
        }
        .name {
          font-size: 15px;
          font-weight: 600;
          margin: 0;
          color: #ffffff;
        }
        .title {
          font-size: 12px;
          color: rgba(248, 250, 252, 0.6);
          margin: 0;
        }
        .score-wrapper {
          margin-top: 4px;
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 11px;
          font-family: monospace;
        }
        .score-bar {
          flex: 1;
          height: 4px;
          background: rgba(255,255,255,0.1);
          border-radius: 2px;
          overflow: hidden;
        }
        .score-fill {
          height: 100%;
          background: #10b981;
          width: ${trustScore}%;
        }
        .score-value {
          color: #10b981;
          font-weight: 700;
        }
      `;

      const content = document.createElement('div');
      content.className = 'badge-container';
      content.innerHTML = `
        <div class="header">
          <span>Infrastruktur Integritas</span>
        </div>
        <div>
          <p class="name">${expertName}</p>
          <p class="title">${expertTitle}</p>
        </div>
        <div class="score-wrapper">
          <span>TRUST SCORE:</span>
          <div class="score-bar">
            <div class="score-fill"></div>
          </div>
          <span class="score-value">${trustScore}%</span>
        </div>
      `;

      shadowRoot.appendChild(styleTag);
      shadowRoot.appendChild(content);
    }
  }, [expertName, expertTitle, trustScore]);

  if (!mounted) return <div className="animate-pulse w-[280px] h-[110px] bg-zinc-900 rounded-xl" />;

  return <div ref={containerRef} />;
}
