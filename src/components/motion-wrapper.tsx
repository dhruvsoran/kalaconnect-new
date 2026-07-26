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


