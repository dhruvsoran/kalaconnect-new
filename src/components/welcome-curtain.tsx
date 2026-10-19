'use client';

import { useCallback, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { KalaConnectIcon } from '@/components/icons';

const INTRO_SEEN_KEY = 'kc_intro_seen';
const LOGO_HOLD_MS = 1400;
const CURTAIN_EXIT_MS = 900;

type Stage = 'checking' | 'logo' | 'opening' | 'done';

export function WelcomeCurtain() {
  const [stage, setStage] = useState<Stage>('checking');

  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let seen = false;
    try {
      seen = sessionStorage.getItem(INTRO_SEEN_KEY) === '1';
    } catch {
      seen = false;
    }
    if (seen || reducedMotion) {
      try { sessionStorage.setItem(INTRO_SEEN_KEY, '1'); } catch { /* storage unavailable */ }
      setStage('done');
      return;
    }
    setStage('logo');
    const openTimer = setTimeout(() => setStage('opening'), LOGO_HOLD_MS);
    const doneTimer = setTimeout(() => setStage('done'), LOGO_HOLD_MS + CURTAIN_EXIT_MS);
    return () => {
      clearTimeout(openTimer);
      clearTimeout(doneTimer);
    };
  }, []);

  useEffect(() => {
    if (stage === 'done') {
      try { sessionStorage.setItem(INTRO_SEEN_KEY, '1'); } catch { /* ignore */ }
      document.body.style.removeProperty('overflow');
      return;
    }
    if (stage === 'logo' || stage === 'opening') {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.removeProperty('overflow');
      };
    }
  }, [stage]);

  const skip = useCallback(() => setStage('done'), []);

  if (stage === 'checking' || stage === 'done') return null;

  const opening = stage === 'opening';

  return (
    <div
      className="fixed inset-0 z-[100]"
      role="presentation"
      aria-hidden="false"
      onClick={skip}
    >
      {/* Left curtain — purple → pink → saffron */}
      <motion.div
        className="absolute inset-y-0 left-0 w-1/2 overflow-hidden bg-[#1b0a33]"
        initial={{ x: 0 }}
        animate={{ x: opening ? '-100%' : 0 }}
        transition={{ duration: CURTAIN_EXIT_MS / 1000, ease: [0.76, 0, 0.24, 1] }}
        style={{ willChange: 'transform' }}
      >
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(120deg, #4a1d96 0%, #7e22ce 30%, #db2777 68%, #f97316 100%)' }}
        />
        {/* soft sheen + curtain folds */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            background:
              'repeating-linear-gradient(90deg, rgba(255,255,255,0.10) 0px, rgba(255,255,255,0.10) 2px, transparent 2px, transparent 26px)',
          }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(120%_100%_at_30%_35%, rgba(255,220,150,0.25), transparent_55%)]" />
        {/* golden leading edge */}
        <div className="absolute inset-y-0 right-0 w-[3px] bg-gradient-to-b from-amber-200 via-amber-100 to-amber-300" />
      </motion.div>

      {/* Right curtain — saffron → pink → purple (mirrored) */}
      <motion.div
        className="absolute inset-y-0 right-0 w-1/2 overflow-hidden bg-[#1b0a33]"
        initial={{ x: 0 }}
        animate={{ x: opening ? '100%' : 0 }}
        transition={{ duration: CURTAIN_EXIT_MS / 1000, ease: [0.76, 0, 0.24, 1] }}
        style={{ willChange: 'transform' }}
      >
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(240deg, #4a1d96 0%, #7e22ce 30%, #db2777 68%, #f97316 100%)' }}
        />
        <div
          className="absolute inset-0 opacity-20"
          style={{
            background:
              'repeating-linear-gradient(90deg, rgba(255,255,255,0.10) 0px, rgba(255,255,255,0.10) 2px, transparent 2px, transparent 26px)',
          }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(120%_100%_at_70%_35%, rgba(255,220,150,0.25), transparent_55%)]" />
        <div className="absolute inset-y-0 left-0 w-[3px] bg-gradient-to-b from-amber-200 via-amber-100 to-amber-300" />
      </motion.div>

      {/* Center branding */}
      <motion.div
        className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-6 text-center"
        initial={{ opacity: 0, scale: 0.92, y: 12 }}
        animate={opening ? { opacity: 0, scale: 1.06 } : { opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: opening ? 0.4 : 0.7, ease: 'easeOut' }}
      >
        <motion.div
          className="flex h-20 w-20 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/20"
          initial={{ opacity: 0, rotate: -8 }}
          animate={{ opacity: 1, rotate: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        >
          <KalaConnectIcon className="h-12 w-12 text-white" width={48} height={48} />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15, ease: 'easeOut' }}
        >
          <p className="text-4xl sm:text-5xl font-bold text-white font-headline tracking-wide">
            कला<span className="text-white/80">Connect</span>
          </p>
          <p className="mt-3 text-sm sm:text-base text-white/70">
            Handcrafted Indian art, straight from the artisans
          </p>
        </motion.div>
        <motion.p
          className="mt-6 text-[11px] uppercase tracking-[0.2em] text-white/50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.5 }}
        >
          Tap to skip
        </motion.p>
      </motion.div>
    </div>
  );
}
