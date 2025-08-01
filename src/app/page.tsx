"use client";
import React, { useEffect, useRef, useState } from "react";
import AboutText from "@/components/aboutText";
import ScrambleButton from "@/components/scrambleButton";
import { gsap } from "gsap";

const HomePage: React.FC = () => {
  const [displayedText, setDisplayedText] = useState("");
  const [displayedPronunciation, setDisplayedPronunciation] = useState("");
  const [showCursor, setShowCursor] = useState(true);
  const [showPronunciationCursor, setShowPronunciationCursor] = useState(false);
  const [startAboutTextAnimation, setStartAboutTextAnimation] = useState(false);
  const [isAnimationComplete, setIsAnimationComplete] = useState(false);
  const [shouldSkipAnimation, setShouldSkipAnimation] = useState(false);
  const h1Ref = useRef<HTMLHeadingElement>(null);
  const spanRef = useRef<HTMLSpanElement>(null);
  const h2Ref = useRef<HTMLHeadingElement>(null);
  const buttonsRef = useRef<HTMLElement>(null);
  const timeoutRefs = useRef<NodeJS.Timeout[]>([]);

  const fullText = "alyssa melendez";
  const fullPronunciation = "/əˈlɪsə/ /məˈlɛnˌdɛz/ noun";

  useEffect(() => {
    return () => {
      timeoutRefs.current.forEach((timeout) => clearTimeout(timeout));
    };
  }, []);

  const skipToEnd = () => {
    if (isAnimationComplete) return;

    setShouldSkipAnimation(true);

    timeoutRefs.current.forEach((timeout) => clearTimeout(timeout));
    timeoutRefs.current = [];

    setDisplayedText(fullText);
    setDisplayedPronunciation(fullPronunciation);
    setShowCursor(false);
    setShowPronunciationCursor(false);

    if (h2Ref.current && buttonsRef.current) {
      gsap.set([h2Ref.current, buttonsRef.current], {
        opacity: 1,
        y: 0,
      });
    }

    setStartAboutTextAnimation(true);
    setIsAnimationComplete(true);
  };

  useEffect(() => {
    if (h2Ref.current && buttonsRef.current) {
      gsap.set([h2Ref.current, buttonsRef.current], {
        opacity: 0,
        y: 20,
      });
    }
  }, []);

  useEffect(() => {
    if (shouldSkipAnimation) return;

    let currentIndex = 0;
    const typingSpeed = 100;

    const typeWriter = () => {
      if (shouldSkipAnimation) return;

      if (currentIndex < fullText.length) {
        setDisplayedText(fullText.slice(0, currentIndex + 1));
        currentIndex++;
        const timeout = setTimeout(typeWriter, typingSpeed);
        timeoutRefs.current.push(timeout);
      } else {
        const timeout1 = setTimeout(() => {
          if (shouldSkipAnimation) return;

          setShowCursor(false);
          setShowPronunciationCursor(true);

          let pronunciationIndex = 0;
          const typePronunciation = () => {
            if (shouldSkipAnimation) return;

            if (pronunciationIndex < fullPronunciation.length) {
              setDisplayedPronunciation(
                fullPronunciation.slice(0, pronunciationIndex + 1)
              );
              pronunciationIndex++;
              const timeout = setTimeout(typePronunciation, 80);
              timeoutRefs.current.push(timeout);
            } else {
              const timeout2 = setTimeout(() => {
                if (shouldSkipAnimation) return;

                setShowPronunciationCursor(false);

                if (h2Ref.current) {
                  gsap.to(h2Ref.current, {
                    opacity: 1,
                    y: 0,
                    duration: 0.3,
                    ease: "power2.out",
                  });
                }

                setStartAboutTextAnimation(true);
              }, 300);
              timeoutRefs.current.push(timeout2);
            }
          };

          typePronunciation();
        }, 300);
        timeoutRefs.current.push(timeout1);
      }
    };

    typeWriter();
  }, [fullText, fullPronunciation, shouldSkipAnimation]);

  const handleAboutTextComplete = () => {
    setIsAnimationComplete(true);
    if (buttonsRef.current && !shouldSkipAnimation) {
      gsap.to(buttonsRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: "power2.out",
      });
    }
  };
  return (
    <>
      {!isAnimationComplete && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            zIndex: 1000,
            cursor: "pointer",
            backgroundColor: "transparent",
          }}
          onClick={skipToEnd}
          title="Click anywhere to skip animation"
        />
      )}

      <div
        style={{
          padding: "2rem",
          minHeight: "calc(100vh - 80px)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          maxWidth: "1000px",
          margin: "0 auto",
          position: "relative",
          zIndex: 1,
        }}
      >
        <section>
          <h1 ref={h1Ref}>
            {displayedText}
            {showCursor && <span className="cursor">|</span>}
          </h1>
          <span
            ref={spanRef}
            className="h2"
            style={{
              display: "inline-block",
              borderBottom: "4px solid var(--color-border)",
              paddingRight: "5rem",
              paddingBottom: "32px",
              marginBottom: "32px",
            }}
          >
            {displayedPronunciation}
            {showPronunciationCursor && <span className="cursor">|</span>}
          </span>
        </section>
        <section>
          <h2 ref={h2Ref} style={{ marginBottom: "32px" }}>
            <AboutText
              startAnimation={startAboutTextAnimation}
              onAnimationComplete={handleAboutTextComplete}
              skipAnimation={shouldSkipAnimation}
            />
          </h2>
        </section>
        <section ref={buttonsRef}>
          <ScrambleButton href="/resume" className="btn-light">
            resume
          </ScrambleButton>
          <ScrambleButton href="/portfolio" className="btn-light">
            portfolio
          </ScrambleButton>
          <ScrambleButton href="/testimonials" className="btn-light">
            testimonials
          </ScrambleButton>
        </section>
      </div>
    </>
  );
};

export default HomePage;
