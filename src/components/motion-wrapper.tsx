"use client";

import { ReactNode, useRef, useEffect } from "react";
import {
  motion,
  useInView,
  useMotionValue,
  useSpring,
  useTransform,
  useScroll,
  HTMLMotionProps,
} from "framer-motion";

type FadeInDirection = "up" | "down" | "left" | "right" | "none";

interface FadeInProps extends Omit<HTMLMotionProps<"div">, "children"> {
  children: ReactNode;
  direction?: FadeInDirection;
  delay?: number;
  duration?: number;
  distance?: number;
  className?: string;
}

const directionOffset = (dir: FadeInDirection, d: number) => {
  switch (dir) {
    case "up": return { y: d };
    case "down": return { y: -d };
    case "left": return { x: d };
    case "right": return { x: -d };
    case "none": return {};
  }
};

export function FadeIn({
  children,
  direction = "up",
  delay = 0,
  duration = 0.5,
  distance = 40,
  className,
  ...props
}: FadeInProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, ...directionOffset(direction, distance) }}
      animate={isInView ? { opacity: 1, x: 0, y: 0 } : {}}
      transition={{ duration, delay, ease: [0.25, 0.4, 0.25, 1] }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

interface StaggerChildrenProps {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
  direction?: FadeInDirection;
  distance?: number;
}

export function StaggerChildren({
  children,
  className,
  staggerDelay = 0.08,
  direction = "up",
  distance = 30,
}: StaggerChildrenProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      className={className}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: staggerDelay } },
      }}
    >
      {children}
    </motion.div>
  );
}

interface StaggerItemProps extends Omit<HTMLMotionProps<"div">, "children"> {
  children: ReactNode;
  direction?: FadeInDirection;
  distance?: number;
  className?: string;
}

export function StaggerItem({
  children,
  direction = "up",
  distance = 30,
  className,
  ...props
}: StaggerItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, ...directionOffset(direction, distance) }}
      variants={{
        hidden: { opacity: 0, ...directionOffset(direction, distance) },
        visible: {
          opacity: 1,
          x: 0,
          y: 0,
          transition: { duration: 0.5, ease: [0.25, 0.4, 0.25, 1] },
        },
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

interface TiltCardProps {
  children: ReactNode;
  className?: string;
  glareColor?: string;
  maxTilt?: number;
}

export function TiltCard({
  children,
  className,
  glareColor = "rgba(255,255,255,0.15)",
  maxTilt = 12,
}: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);

  const rotateX = useSpring(useTransform(y, [0, 1], [maxTilt, -maxTilt]), {
    stiffness: 300,
    damping: 30,
  });
  const rotateY = useSpring(useTransform(x, [0, 1], [-maxTilt, maxTilt]), {
    stiffness: 300,
    damping: 30,
  });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width);
    y.set((e.clientY - rect.top) / rect.height);
  };

  const handleMouseLeave = () => {
    x.set(0.5);
    y.set(0.5);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
        perspective: 1000,
      }}
      className={className}
    >
      <div
        className="pointer-events-none absolute inset-0 z-10 rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: `radial-gradient(circle at ${glareColor}, transparent 0%, transparent 100%)`,
        }}
      />
      {children}
    </motion.div>
  );
}

interface CountUpProps {
  from?: number;
  to: number;
  duration?: number;
  className?: string;
  prefix?: string;
  suffix?: string;
  decimals?: number;
}

export function CountUp({
  from = 0,
  to,
  duration = 1.5,
  className,
  prefix = "",
  suffix = "",
  decimals = 0,
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView || !ref.current) return;
    let start = from;
    const end = to;
    const stepTime = (duration * 1000) / 60;
    const step = (end - start) / (duration * 60);
    const timer = setInterval(() => {
      start += step;
      if ((step > 0 && start >= end) || (step < 0 && start <= end)) {
        start = end;
        clearInterval(timer);
      }
      if (ref.current) {
        ref.current.textContent = `${prefix}${start.toFixed(decimals)}${suffix}`;
      }
    }, stepTime);
    return () => clearInterval(timer);
  }, [isInView, from, to, duration, prefix, suffix, decimals]);

  return (
    <span ref={ref} className={className}>
      {`${prefix}${from.toFixed(decimals)}${suffix}`}
    </span>
  );
}

interface ParallaxProps {
  children: ReactNode;
  className?: string;
  speed?: number;
  direction?: "vertical" | "horizontal";
}

export function Parallax({
  children,
  className,
  speed = 0.3,
  direction = "vertical",
}: ParallaxProps) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, speed * -200]);
  const x = useTransform(scrollYProgress, [0, 1], [0, speed * -200]);

  return (
    <motion.div
      ref={ref}
      className={className}
      style={direction === "vertical" ? { y } : { x }}
    >
      {children}
    </motion.div>
  );
}

interface TextRevealProps {
  text: string;
  className?: string;
  delay?: number;
  staggerDelay?: number;
  as?: "h1" | "h2" | "h3" | "p" | "span";
}

export function TextReveal({
  text,
  className,
  delay = 0,
  staggerDelay = 0.03,
  as: Tag = "span",
}: TextRevealProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });
  const words = text.split(" ");

  return (
    <Tag ref={ref} className={className}>
      {words.map((word, i) => (
        <span key={i} className="inline-block overflow-hidden mr-[0.25em]">
          <motion.span
            className="inline-block"
            initial={{ y: "100%" }}
            animate={isInView ? { y: 0 } : {}}
            transition={{
              duration: 0.5,
              delay: delay + i * staggerDelay,
              ease: [0.25, 0.4, 0.25, 1],
            }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}

interface GlowButtonProps extends HTMLMotionProps<"button"> {
  children: ReactNode;
  glowColor?: string;
}

export function GlowButton({
  children,
  glowColor = "rgba(59, 130, 246, 0.4)",
  ...props
}: GlowButtonProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.03, boxShadow: `0 0 30px ${glowColor}` }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      {...props}
    >
      {children}
    </motion.button>
  );
}


