"use client";

import React, { useEffect, useState } from 'react';
import { ReactLenis } from 'lenis/react';
import { usePathname } from 'next/navigation';

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    // Detect if device supports touch
    const checkTouch = () => {
      setIsTouch('ontouchstart' in window || navigator.maxTouchPoints > 0);
    };
    checkTouch();
  }, []);

  // Desativa o Lenis (smooth scrolling) em dispositivos touch, na Home do mapa
  // ou em rotas internas/detalhes que utilizam scroll interno de container.
  const shouldDisableLenis = 
    isTouch || 
    pathname === "/" || 
    pathname.startsWith("/usuario") || 
    pathname.startsWith("/reclamacao");

  if (shouldDisableLenis) {
    return <>{children}</>;
  }

  return (
    <ReactLenis root options={{ lerp: 0.08, smoothWheel: true }}>
      {children}
    </ReactLenis>
  );
}
