'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function CookieConsent() {
  const [accepted, setAccepted] = useState<boolean | null>(null);

  useEffect(() => {
    const stored = typeof window !== 'undefined' ? localStorage.getItem('cookiesAccepted') : null;
    setAccepted(stored === 'true' ? true : stored === 'false' ? false : null);
  }, []);

  const accept = () => {
    if (typeof window !== 'undefined') localStorage.setItem('cookiesAccepted', 'true');
    setAccepted(true);
  };
  const decline = () => {
    if (typeof window !== 'undefined') localStorage.setItem('cookiesAccepted', 'false');
    setAccepted(false);
  };

  if (accepted !== null) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 flex items-center justify-between gap-4 rounded-lg bg-card p-4 shadow-lg">
      <div className="flex-1 text-sm">
        This site uses cookies to improve functionality and analytics. By continuing you accept our <Link href="/privacy" className="underline">Privacy Policy</Link> and <Link href="/cookies" className="underline">Cookie Policy</Link>.
      </div>
      <div className="flex gap-2">
        <button onClick={decline} className="btn-ghost px-3 py-2 rounded">Decline</button>
        <button onClick={accept} className="btn-primary px-3 py-2 rounded">Accept</button>
      </div>
    </div>
  );
}
