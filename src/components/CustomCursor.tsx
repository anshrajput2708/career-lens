"use client";

import React, { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function CustomCursor() {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Use motion values for raw mouse coordinates
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Smooth them with a stiff spring for an organic but snappy feel
  const springConfig = { damping: 25, stiffness: 400, mass: 0.5 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  useEffect(() => {
    setMounted(true);

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target || !target.closest) return;
      // We check on `mouseover` instead of `mousemove` to avoid layout thrashing
      const isClickable = target.closest("a, button, [role='button'], input, textarea, select");
      setIsHovering(!!isClickable);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("mouseover", handleMouseOver, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave, { passive: true });

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseover", handleMouseOver);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [isVisible, mouseX, mouseY]);

  if (!mounted) return null;

  const size = isHovering ? 48 : 12;

  return (
    <motion.div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        x: smoothX,
        y: smoothY,
        pointerEvents: "none",
        zIndex: 99999, // Always on top
        opacity: isVisible ? 1 : 0,
      }}
    >
      <motion.div
        animate={{
          width: size,
          height: size,
          backgroundColor: isHovering ? "rgba(99, 102, 241, 0.15)" : "#111",
          borderColor: isHovering ? "rgba(99, 102, 241, 0.4)" : "rgba(0,0,0,0)",
        }}
        transition={{
          duration: 0.2,
          ease: "easeOut",
        }}
        style={{
          x: "-50%",
          y: "-50%",
          borderRadius: "50%",
          borderWidth: "1px",
          borderStyle: "solid",
          backdropFilter: isHovering ? "blur(4px)" : "none",
        }}
      />
    </motion.div>
  );
}
