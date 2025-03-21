import React, { useState, useEffect } from "react";

interface SparklyBadgeButtonProps {
  label?: string;
  onClick?: () => void;
  color?: "blue" | "purple" | "pink" | "gold";
  size?: "sm" | "md" | "lg";
}

const SparklyBadgeButton: React.FC<SparklyBadgeButtonProps> = ({
  label = "Premium",
  onClick = () => {
    /* no-op */
  },
  color = "purple",
  size = "md",
}) => {
  const [sparkles, setSparkles] = useState<
    Array<{
      id: number;
      left: number;
      top: number;
      size: number;
      duration: number;
    }>
  >([]);
  const [isHovered, setIsHovered] = useState(false);

  // Color variants
  const colorVariants = {
    blue: "from-blue-400 to-blue-600 border-blue-300 shadow-blue-500/20",
    purple:
      "from-purple-400 to-purple-600 border-purple-300 shadow-purple-500/20",
    pink: "from-pink-400 to-pink-600 border-pink-300 shadow-pink-500/20",
    gold: "from-amber-300 to-amber-500 border-amber-200 shadow-amber-400/20",
  };

  // Size variants
  const sizeVariants = {
    sm: "text-xs py-1 px-3",
    md: "text-sm py-1.5 px-4",
    lg: "text-base py-2 px-5",
  };

  // Generate new sparkles randomly
  useEffect(() => {
    if (isHovered) {
      const interval = setInterval(() => {
        setSparkles((current) => {
          // Remove old sparkles if there are too many
          const filtered =
            current.length > 20
              ? current.slice(current.length - 20)
              : [...current];

          // Add a new sparkle
          return [
            ...filtered,
            {
              id: Date.now(),
              left: Math.random() * 100,
              top: Math.random() * 100,
              size: Math.random() * 6 + 2,
              duration: Math.random() * 1.5 + 0.5,
            },
          ];
        });
      }, 150);

      return () => clearInterval(interval);
    }
  }, [isHovered]);

  // Fade out sparkles when not hovered
  useEffect(() => {
    if (!isHovered && sparkles.length > 0) {
      const timeout = setTimeout(() => {
        setSparkles([]);
      }, 1000);

      return () => clearTimeout(timeout);
    }
  }, [isHovered, sparkles.length]);

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`
        relative overflow-hidden rounded-full 
        bg-gradient-to-r ${colorVariants[color]}
        border border-opacity-40
        shadow-lg hover:shadow-xl transition-all duration-300
        font-semibold ${sizeVariants[size]}
        transform hover:scale-105
      `}
    >
      {/* Shiny reflection effect */}
      <div
        className={`
          absolute inset-0 bg-gradient-to-r from-white/0 via-white/60 to-white/0
          opacity-70 transition-transform duration-700 ease-in-out
          ${isHovered ? "translate-x-full" : "-translate-x-full"}
        `}
      />

      {/* Sparkles */}
      {sparkles.map((sparkle) => (
        <div
          key={sparkle.id}
          className="absolute pointer-events-none"
          style={{
            left: `${sparkle.left}%`,
            top: `${sparkle.top}%`,
            width: `${sparkle.size}px`,
            height: `${sparkle.size}px`,
            backgroundColor: "white",
            borderRadius: "50%",
            opacity: 0,
            animation: `sparkleAnimation ${sparkle.duration}s ease-out forwards`,
          }}
        />
      ))}

      {/* Pulsing glow effect */}
      <div
        className={`
          absolute inset-0 rounded-full 
          bg-gradient-to-r ${colorVariants[color]} 
          opacity-0 ${isHovered ? "animate-pulse-glow" : ""}
        `}
      />

      {/* Button text */}
      <span className="relative z-10 text-white drop-shadow-sm">{label}</span>

      {/* Hidden style for animations */}
      <style jsx>{`
        @keyframes sparkleAnimation {
          0% {
            transform: scale(0);
            opacity: 0;
          }
          20% {
            transform: scale(1);
            opacity: 1;
          }
          60% {
            transform: scale(0.5);
            opacity: 0.5;
          }
          100% {
            transform: scale(0);
            opacity: 0;
          }
        }

        @keyframes pulseGlow {
          0% {
            opacity: 0;
          }
          50% {
            opacity: 0.4;
          }
          100% {
            opacity: 0;
          }
        }

        .animate-pulse-glow {
          animation: pulseGlow 1.5s infinite;
        }
      `}</style>
    </button>
  );
};

export default SparklyBadgeButton;
