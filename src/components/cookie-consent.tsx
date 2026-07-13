'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

// Google Consent Mode v2 - default to denied
function initializeConsentMode() {
  if (typeof window === 'undefined') return;
  
  // @ts-ignore
  window.dataLayer = window.dataLayer || [];
  // @ts-ignore
  function gtag(...args: any[]) {
    // @ts-ignore
    window.dataLayer.push(args);
  }
  
  // Default state: all denied
  gtag('consent', 'default', {
    ad_storage: 'denied',
    analytics_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    functionality_storage: 'denied',
    personalization_storage: 'denied',
    security_storage: 'granted', // Always allowed
  });
}

// Load Google Analytics only after consent
function loadGoogleAnalytics() {
  if (typeof window === 'undefined') return;
  if (document.getElementById('ga-script')) return; // Already loaded
  
  const gtagScript = document.createElement('script');
  gtagScript.id = 'ga-script';
  gtagScript.async = true;
  gtagScript.src = 'https://www.googletagmanager.com/gtag/js?id=G-69SMPF6Z3D'; // Replace with actual GA ID
  document.head.appendChild(gtagScript);
}

// Update consent and load scripts
function updateConsent(consent: boolean) {
  if (typeof window === 'undefined') return;
  
  // @ts-ignore
  window.dataLayer = window.dataLayer || [];
  // @ts-ignore
  function gtag(...args: any[]) {
    // @ts-ignore
    window.dataLayer.push(args);
  }
  
  if (consent) {
    gtag('consent', 'update', {
      ad_storage: 'granted',
      analytics_storage: 'granted',
      ad_user_data: 'granted',
      ad_personalization: 'granted',
      functionality_storage: 'granted',
      personalization_storage: 'granted',
    });
    
    // Load Google Analytics after consent
    loadGoogleAnalytics();
  } else {
    gtag('consent', 'update', {
      ad_storage: 'denied',
      analytics_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied',
      functionality_storage: 'denied',
      personalization_storage: 'denied',
    });
  }
}

export default function CookieConsent() {
  const [accepted, setAccepted] = useState<boolean | null>(null);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Initialize consent mode on mount
    initializeConsentMode();
    
    const stored = typeof window !== 'undefined' ? localStorage.getItem('cookiesAccepted') : null;
    if (stored === 'true') {
      setAccepted(true);
      updateConsent(true);
    } else if (stored === 'false') {
      setAccepted(false);
      updateConsent(false);
    } else {
      // No choice made yet - show banner after a short delay
      setTimeout(() => setShowBanner(true), 1000);
    }
  }, []);

  const accept = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('cookiesAccepted', 'true');
    }
    setAccepted(true);
    setShowBanner(false);
    updateConsent(true);
  };
  
  const decline = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('cookiesAccepted', 'false');
    }
    setAccepted(false);
    setShowBanner(false);
    updateConsent(false);
  };

  if (!showBanner || accepted !== null) return null;

  return (
    <div 
      className="fixed bottom-4 left-4 right-4 z-50 flex items-center justify-between gap-4 rounded-lg bg-card p-4 shadow-lg border"
      role="dialog"
      aria-label="Cookie Consent"
      aria-describedby="cookie-consent-description"
    >
      <div className="flex-1 text-sm" id="cookie-consent-description">
        We use cookies to enhance your experience, serve personalized ads through Google AdSense, and analyze site traffic. By clicking &quot;Accept&quot;, you consent to our use of cookies. Read our{' '}
        <Link href="/privacy" className="underline hover:text-primary">Privacy Policy</Link> and{' '}
        <Link href="/cookies" className="underline hover:text-primary">Cookie Policy</Link>.
      </div>
      <div className="flex gap-2 shrink-0">
        <button 
          type="button"
          onClick={decline} 
          className="px-3 py-2 rounded border hover:bg-muted transition-colors text-sm"
        >
          Decline
        </button>
        <button 
          type="button"
          onClick={accept} 
          className="px-3 py-2 rounded bg-primary text-primary-foreground hover:bg-primary/90 transition-colors text-sm font-medium"
        >
          Accept
        </button>
      </div>
    </div>
  );
}
