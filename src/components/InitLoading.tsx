"use client";

import { useEffect, useState } from "react";
import { gsap, CSSPlugin, Expo } from "gsap";

gsap.registerPlugin(CSSPlugin);

export default function InitLoading() {
  const [counter, setCounter] = useState(0);

  useEffect(() => {
    const count = setInterval(() => {
      setCounter((prev) => {
        if (prev < 100) return prev + 1;
        clearInterval(count);
        finishLoading();
        return 100;
      });
    }, 25);
  }, []);

  const finishLoading = () => {
    const tl = gsap.timeline();

    tl.to(".follow-bar", {
      width: "100%",
      ease: Expo.easeInOut,
      duration: 1.2,
    })
      .to(".hide", { opacity: 0, duration: 0.3 }, "-=0.2")
      .to(".hide", { display: "none", duration: 0 })
      .to(".follow-bar", {
        top: 0, // move to top
        height: "100%",
        ease: Expo.easeInOut,
        duration: 0.7,
        delay: 0.5,
      })
      .to(".loading-screen", {
        opacity: 0,
        pointerEvents: "none",
        duration: 0.5,
      });
  };

  return (
    <div className="loading-screen fixed inset-0 z-50 bg-black text-white overflow-hidden">
      {/* Follow bar (starts from center top) */}
      <div className="follow-bar absolute left-0 top-1/2 h-[2px] w-0 bg-[#f48049] z-20" />

      {/* Progress bar (starts from center top) */}
      <div
        className="hide absolute left-0 top-1/2 h-[2px] bg-white transition-[width] ease-out duration-300 z-10"
        style={{ width: `${counter}%` }}
      />

      {/* Centered counter */}
      <div className="hide absolute inset-0 flex items-center justify-center">
        <span className="text-[100px] font-medium text-white">{counter}%</span>
      </div>
    </div>
  );
}
