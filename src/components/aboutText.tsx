"use client";

import React, { useEffect, useState, useRef } from "react";
import { gsap } from "gsap";

interface AboutTextProps {
  startAnimation?: boolean;
  onAnimationComplete?: () => void;
  skipAnimation?: boolean;
}

const AboutText: React.FC<AboutTextProps> = ({
  startAnimation = false,
  onAnimationComplete,
  skipAnimation = false,
}) => {
  const [displayedText, setDisplayedText] = useState("");
  const [highlightPosition, setHighlightPosition] = useState(0);
  const [isAnimationComplete, setIsAnimationComplete] = useState(false);
  const [clickedStates, setClickedStates] = useState({
    roles: 0,
    solutions: 0,
    companies: 0,
    tools: 0,
  });

  const rolesRef = useRef<HTMLSpanElement>(null);
  const solutionsRef = useRef<HTMLSpanElement>(null);
  const companiesRef = useRef<HTMLSpanElement>(null);
  const toolsRef = useRef<HTMLSpanElement>(null);

  const fullText =
    "a software engineer who builds solutions\nfor high-growth companies with tools.";
  const chars = "!@#$%^&*()_+-=[]{}|;':\",./<>?~`";

  const getWordHighlight = (key: string) => {
    const highlights = {
      roles: { start: 2, end: 18, color: "#FFE4E1" },
      solutions: { start: 31, end: 39, color: "#E1F5FE" },
      companies: { start: 45, end: 65, color: "#F3E5F5" },
      tools: { start: 72, end: 76, color: "#E8F5E8" },
    };
    return (
      highlights[key as keyof typeof highlights] || {
        start: 0,
        end: 0,
        color: "",
      }
    );
  };

  const hoverTexts = {
    roles: [
      "software engineer",
      "creative developer",
      "pixel-perfectionist",
      "color fanatic",
      "lifelong learner",
      "problem solver",
    ],
    solutions: [
      "solutions",
      "websites",
      "web apps",
      "content management systems",
      "prototypes",
      "user experiences",
    ],
    companies: [
      "high-growth companies",
      "tech startups",
      "marketing teams",
      "dreamers",
    ],
    tools: [
      "code",
      "react",
      "next.js",
      "css",
      "typescript",
      "tests",
      "artificial intelligence",
      "real intelligence",
      "love",
    ],
  };

  const scrambleText = (
    ref: React.RefObject<HTMLSpanElement | null>,
    newText: string,
    wordHighlight: { start: number; end: number; color: string },
    duration: number = 500
  ) => {
    if (!ref.current) return;

    // Update the ref element's text content with scrambling effect
    const element = ref.current;
    const originalText = element.textContent || "";
    const maxLength = Math.max(originalText.length, newText.length);
    let iteration = 0;

    const interval = setInterval(() => {
      let scrambledText = "";

      for (let i = 0; i < maxLength; i++) {
        if (i < iteration && i < newText.length) {
          scrambledText += newText[i];
        } else if (i < newText.length) {
          scrambledText += chars[Math.floor(Math.random() * chars.length)];
        }
      }

      element.textContent = scrambledText;

      if (iteration >= maxLength) {
        clearInterval(interval);
        element.textContent = newText;
      }

      iteration += 1;
    }, 50);
  };

  const handleCyclingClick = (
    ref: React.RefObject<HTMLSpanElement | null>,
    options: string[],
    stateKey: "solutions" | "tools" | "roles" | "companies"
  ) => {
    if (ref.current && isAnimationComplete) {
      const currentIndex = clickedStates[stateKey] as number;
      const nextIndex = (currentIndex + 1) % options.length;
      const targetText = options[nextIndex];

      const wordHighlight = getWordHighlight(stateKey);
      scrambleText(ref, targetText, wordHighlight);

      setClickedStates((prev) => ({
        ...prev,
        [stateKey]: nextIndex,
      }));
    }
  };

  useEffect(() => {
    if (!startAnimation) {
      setDisplayedText("");
      setHighlightPosition(0);
      return;
    }

    if (skipAnimation) {
      setDisplayedText(fullText);
      setHighlightPosition(fullText.length);
      setIsAnimationComplete(true);
      setTimeout(() => {
        onAnimationComplete?.();
      }, 100);
      return;
    }

    let currentIndex = 0;
    const typingSpeed = 60;

    const typeWithScramble = () => {
      if (currentIndex <= fullText.length) {
        let scrambledText = "";

        for (let i = 0; i < fullText.length; i++) {
          if (i < currentIndex) {
            scrambledText += fullText[i];
          } else if (i < currentIndex + 8) {
            if (fullText[i] === " ") {
              scrambledText += " ";
            } else {
              scrambledText += chars[Math.floor(Math.random() * chars.length)];
            }
          } else {
            break;
          }
        }

        setDisplayedText(scrambledText);
        setHighlightPosition(currentIndex);
        currentIndex++;

        if (currentIndex <= fullText.length) {
          setTimeout(typeWithScramble, typingSpeed);
        } else {
          setTimeout(() => {
            setDisplayedText(fullText);
            setIsAnimationComplete(true);
            setTimeout(() => {
              onAnimationComplete?.();
            }, 100);
          }, 200);
        }
      }
    };

    typeWithScramble();
  }, [startAnimation, fullText, onAnimationComplete, skipAnimation]);

  if (!isAnimationComplete) {
    const wordHighlights = {
      roles: getWordHighlight("roles"),
      solutions: getWordHighlight("solutions"),
      companies: getWordHighlight("companies"),
      tools: getWordHighlight("tools"),
    };

    return (
      <div
        style={{
          fontSize: "inherit",
          fontFamily: "inherit",
          fontWeight: "inherit",
          lineHeight: "1.7",
          letterSpacing: "0.07em",
        }}
      >
        {displayedText.split("").map((char, index) => {
          // Find which word this character belongs to
          let backgroundColor = "transparent";
          let padding = "0";
          let borderRadius = "0";

          for (const [word, highlight] of Object.entries(wordHighlights)) {
            if (
              index >= highlight.start &&
              index <= highlight.end &&
              index < highlightPosition
            ) {
              backgroundColor = highlight.color;

              if (index === highlight.start) {
                padding = "2px 0 2px 4px";
              } else if (index === highlight.end) {
                padding = "2px 4px 2px 0";
              } else {
                padding = "2px 0";
              }

              borderRadius = "2px";
              break;
            }
          }

          if (char === "\n") {
            return (
              <br
                key={index}
                style={{ marginTop: "8px", marginBottom: "8px" }}
              />
            );
          }

          return (
            <span
              key={index}
              style={{
                backgroundColor,
                padding,
                borderRadius,
                transition: "all 0.2s ease",
                fontSize: "inherit",
                fontFamily: "inherit",
                fontWeight: "inherit",
              }}
            >
              {char}
            </span>
          );
        })}
      </div>
    );
  }

  return (
    <div
      style={{
        fontSize: "inherit",
        fontFamily: "inherit",
        fontWeight: "inherit",
        lineHeight: "1.7",
        letterSpacing: "0.07em",
      }}
    >
      a{" "}
      <span
        ref={rolesRef}
        style={{
          cursor: "pointer",
          display: "inline",
          textAlign: "left",
          backgroundColor: "#FFE4E1",
          padding: "2px 4px",
          borderRadius: "3px",
          transition: "all 0.2s ease",
        }}
        onClick={() => handleCyclingClick(rolesRef, hoverTexts.roles, "roles")}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translate(2px, -2px)";
          e.currentTarget.style.boxShadow = "0 2px 4px rgba(0,0,0,0.1)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translate(0, 0)";
          e.currentTarget.style.boxShadow = "none";
        }}
      >
        {hoverTexts.roles[clickedStates.roles]}
      </span>{" "}
      who builds{" "}
      <span
        ref={solutionsRef}
        style={{
          cursor: "pointer",
          display: "inline",
          textAlign: "left",
          backgroundColor: "#E1F5FE",
          padding: "2px 4px",
          borderRadius: "3px",
          transition: "all 0.2s ease",
        }}
        onClick={() =>
          handleCyclingClick(solutionsRef, hoverTexts.solutions, "solutions")
        }
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translate(2px, -2px)";
          e.currentTarget.style.boxShadow = "0 2px 4px rgba(0,0,0,0.1)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translate(0, 0)";
          e.currentTarget.style.boxShadow = "none";
        }}
      >
        {hoverTexts.solutions[clickedStates.solutions]}
      </span>
      <br style={{ marginTop: "8px", marginBottom: "8px" }} />
      for{" "}
      <span
        ref={companiesRef}
        style={{
          cursor: "pointer",
          display: "inline",
          textAlign: "left",
          backgroundColor: "#F3E5F5",
          padding: "2px 4px",
          borderRadius: "3px",
          transition: "all 0.2s ease",
        }}
        onClick={() =>
          handleCyclingClick(companiesRef, hoverTexts.companies, "companies")
        }
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translate(2px, -2px)";
          e.currentTarget.style.boxShadow = "0 2px 4px rgba(0,0,0,0.1)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translate(0, 0)";
          e.currentTarget.style.boxShadow = "none";
        }}
      >
        {hoverTexts.companies[clickedStates.companies]}
      </span>{" "}
      with{" "}
      <span
        ref={toolsRef}
        style={{
          cursor: "pointer",
          display: "inline",
          textAlign: "left",
          backgroundColor: "#E8F5E8",
          padding: "2px 4px",
          borderRadius: "3px",
          transition: "all 0.2s ease",
        }}
        onClick={() => handleCyclingClick(toolsRef, hoverTexts.tools, "tools")}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translate(2px, -2px)";
          e.currentTarget.style.boxShadow = "0 2px 4px rgba(0,0,0,0.1)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translate(0, 0)";
          e.currentTarget.style.boxShadow = "none";
        }}
      >
        {hoverTexts.tools[clickedStates.tools]}
      </span>
      .
    </div>
  );
};

export default AboutText;
