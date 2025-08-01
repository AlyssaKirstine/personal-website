"use client";

import React, { useRef, useState } from "react";
import Link from "next/link";

interface ScrambleButtonProps {
  href: string;
  children: string;
  className?: string;
}

const ScrambleButton: React.FC<ScrambleButtonProps> = ({
  href,
  children,
  className,
}) => {
  const [displayText, setDisplayText] = useState(children);
  const [isScrambling, setIsScrambling] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const linkRef = useRef<HTMLAnchorElement>(null);
  const [originalWidth, setOriginalWidth] = useState<number | null>(null);

  const chars = "!@#$%^&*()_+-=[]{}|;':\",./<>?~`";
  const originalText = children;

  React.useEffect(() => {
    if (linkRef.current && originalWidth === null) {
      const width = linkRef.current.getBoundingClientRect().width;
      setOriginalWidth(width);
    }
  }, [originalWidth]);

  const scrambleText = (targetText: string, duration: number = 300) => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    setIsScrambling(true);
    let iteration = 0;
    const totalFrames = Math.ceil(duration / 30);

    intervalRef.current = setInterval(() => {
      let scrambledText = "";

      for (let i = 0; i < targetText.length; i++) {
        if (i < iteration) {
          scrambledText += targetText[i];
        } else {
          scrambledText += chars[Math.floor(Math.random() * chars.length)];
        }
      }

      setDisplayText(scrambledText);

      if (iteration >= targetText.length) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        setDisplayText(targetText);
        setIsScrambling(false);
      }

      iteration += targetText.length / totalFrames;
    }, 30);
  };

  const handleMouseEnter = () => {
    scrambleText(originalText, 300); // Match the CSS transition duration
  };

  const handleMouseLeave = () => {
    if (!isScrambling) {
      scrambleText(originalText, 300);
    }
  };

  React.useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <Link
      ref={linkRef}
      href={href}
      className={className}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        display: "inline-block",
        width: originalWidth ? `${originalWidth}px` : "auto",
        textAlign: "center",
        overflow: "hidden",
        whiteSpace: "nowrap",
      }}
    >
      {displayText}
    </Link>
  );
};

export default ScrambleButton;
