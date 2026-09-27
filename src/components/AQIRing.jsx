import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import './AQIRing.css';

export default function AQIRing({ aqi = 156, category = "Poor", color = "#F59E0B", size = 160 }) {
  const [displayNumber, setDisplayNumber] = useState(0);

  // Animate counter from 0 to aqi value
  useEffect(() => {
    let start = 0;
    const end = Math.min(Math.max(aqi, 0), 500);
    const duration = 1200; // ms
    const stepTime = 20;
    const steps = duration / stepTime;
    const increment = end / steps;

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setDisplayNumber(end);
        clearInterval(timer);
      } else {
        setDisplayNumber(Math.floor(start));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [aqi]);

  const radius = size * 0.4;
  const strokeWidth = size * 0.08;
  const circumference = 2 * Math.PI * radius;
  const maxAQIScale = 350;
  const strokeDashoffset = circumference - (circumference * Math.min(aqi, maxAQIScale)) / maxAQIScale;

  return (
    <div className="aqi-ring-container" style={{ width: size, height: size }}>
      <svg className="aqi-ring-svg" width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Background track circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(255, 255, 255, 0.07)"
          strokeWidth={strokeWidth}
          fill="none"
        />

        {/* Animated progressive ring */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          fill="none"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: strokeDashoffset }}
          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
          style={{
            filter: `drop-shadow(0 0 10px ${color}80)`
          }}
        />
      </svg>

      {/* Inside Metric Text */}
      <div className="aqi-ring-inner">
        <span className="ring-title-mini">AQI</span>
        <motion.span
          className="ring-main-number"
          style={{ color }}
          key={aqi}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          {displayNumber}
        </motion.span>
        <span className="ring-cat-label" style={{ color }}>{category}</span>
      </div>
    </div>
  );
}
