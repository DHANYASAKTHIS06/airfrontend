import React from 'react';
import { motion } from 'framer-motion';
import './AnimatedBackground.css';

export default function AnimatedBackground() {
  // Pre-calculated calm particle coordinates
  const particles = [
    { id: 1, x: '15%', y: '20%', size: 4, duration: 12 },
    { id: 2, x: '80%', y: '15%', size: 6, duration: 16 },
    { id: 3, x: '45%', y: '65%', size: 3, duration: 10 },
    { id: 4, x: '85%', y: '75%', size: 5, duration: 14 },
    { id: 5, x: '25%', y: '85%', size: 4, duration: 18 },
    { id: 6, x: '70%', y: '40%', size: 3, duration: 13 },
  ];

  return (
    <div className="animated-bg-container" aria-hidden="true">
      {/* Moving gradient atmospheric blobs */}
      <motion.div
        className="ambient-blob blob-cyan"
        animate={{
          x: [0, 40, -30, 0],
          y: [0, -50, 30, 0],
          scale: [1, 1.15, 0.95, 1],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="ambient-blob blob-teal"
        animate={{
          x: [0, -50, 40, 0],
          y: [0, 40, -40, 0],
          scale: [1, 0.9, 1.1, 1],
        }}
        transition={{
          duration: 26,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="ambient-blob blob-emerald"
        animate={{
          x: [0, 30, -40, 0],
          y: [0, -30, 50, 0],
          scale: [1, 1.1, 0.9, 1],
        }}
        transition={{
          duration: 28,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Floating air particle elements */}
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="floating-air-particle"
          style={{
            left: p.x,
            top: p.y,
            width: `${p.size}px`,
            height: `${p.size}px`,
          }}
          animate={{
            y: [0, -25, 0],
            x: [0, 15, 0],
            opacity: [0.3, 0.7, 0.3],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}
