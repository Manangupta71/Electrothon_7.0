"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import smallLogo from "../../assets/small_logo.png";
import ellipse61 from "../../assets/Ellipse 61.png";
import ellipse from "../../assets/Ellipse.png";
import ellipse2 from '../../assets/Ellipse2.png';

const Timeline = () => {
  const [logoPosition, setLogoPosition] = useState(0); // Start at 0%
  const timelineRef = useRef(null);
  const logoRef = useRef(null);
  const headingRef = useRef(null);

  useEffect(() => {
    const timeline = timelineRef.current;
    const logo = logoRef.current;
    const heading = headingRef.current;
    if (!timeline || !logo || !heading) return;

    let isHeadingVisible = true;
    let lastScrollY = window.scrollY;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.target === heading) {
            isHeadingVisible = entry.isIntersecting;
            return;
          }

          if (!isHeadingVisible) {
            const intersectionRatio = entry.intersectionRatio;
            const boundingRect = entry.boundingClientRect;

            // Calculate the position of the logo
            const timelineHeight = boundingRect.height;
            const visibleHeight = timelineHeight * intersectionRatio;
            const scrolledDistance =
              timelineHeight - visibleHeight - boundingRect.top;

            // Determine scroll direction
            const currentScrollY = window.scrollY;
            const isScrollingDown = currentScrollY > lastScrollY;
            lastScrollY = currentScrollY;

            if (isScrollingDown) {
              // When scrolling down, keep the logo at the bottom (100%)
              setLogoPosition(100);
            } else {
              // When scrolling up, calculate the logo position
              const easeOutQuad = (t) => t * (2 - t);
              const scrollPercentage =
                easeOutQuad(scrolledDistance / timelineHeight) * 100;

              // Clamp the logo position between 0 and 100
              const newLogoPosition = Math.max(
                0,
                Math.min(100, scrollPercentage * 0.8)
              );
              setLogoPosition(newLogoPosition);
            }
          } else {
            setLogoPosition(0); // Reset to 0% when heading is visible
          }
        });
      },
      {
        threshold: Array.from({ length: 101 }, (_, i) => i / 100), // Create thresholds for each percentage point
        root: null,
        rootMargin: "0px",
      }
    );

    observer.observe(timeline);
    observer.observe(heading);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div className="relative bg-cover bg-center min-h-screen flex flex-col items-center justify-start text-white">
      <div ref={headingRef} className="flex items-center mb-12">
        <h2
          style={{
            textShadow: "-5px 8px 4px rgba(0, 0, 0, 0.5)",
          }}
          className="text-[50px] sm:text-[70px] md:text-[4.5rem] font-pirata">Timeline</h2>
      </div>

      <div ref={timelineRef} className="relative w-full max-w-5xl px-8">
        {/* Vertical Line */}
        <div className="absolute left-7 top-0 w-7 h-full bg-[#374151] rounded-lg">
          {/* Blue overlay */}
          <div
            className="absolute left-0 top-0 w-full bg-[#03294F] rounded-lg transition-all duration-300 ease-out"
            style={{ height: `${logoPosition}%` }}
          ></div>
        </div>

        {/* Logo */}
        <div
          ref={logoRef}
          className="absolute left-[1rem] w-14 h-14 flex justify-center items-center bg-transparent transition-all duration-300 ease-out"
          style={{
            top: `calc(${logoPosition}% - 6px)`, // Adjust for centering
            transform: "translateY(-50%)",
          }}
        >
          <Image
            src={ellipse2}
            alt="Logo"
            fill
            style={{ objectFit: "contain", zIndex:10 }}
          />
          {/* <Image
            src={smallLogo}
            alt="Overlay Logo"
            width={60}
            height={60}
            className="absolute"
            style={{
              objectFit: "contain",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}
          /> */}
        </div>

        {/* Timeline Items */}
        <div className="space-y-20">
          <TimelineItem title="Registration Begins" date="lst Dec, 2024" detail="Registrations for Electrothon 7.0 starts"/>
          <TimelineItem title="Participation Shortlist" date="Coming Soon" detail="Mails sent to accepted hackers" />
          <TimelineItem title="Electrothon Main Event" date="7-9 March, 2025" detail="The Hacking Period"/>
        </div>
      </div>
    </div>
  );
};

const TimelineItem = ({ title, date, detail }) => (
  <div className="relative flex items-center">
    <div className="absolute left-6 top-1/2 -translate-y-1/2 w-[3vw] h-2 bg-[#374151]"></div>
    <div className="ml-20 bg-[#03294F] p-7 rounded-2xl shadow-lg w-5/6 relative opacity-90 h-[186px]">
      <h3
        className="text-2xl sm:text-4xl relative pb-5"
        style={{ fontFamily: "Jacques Francois" }}
      >
        {title}: <span className="text-xl sm:text-3xl">{date}</span>
        <span className="absolute bottom-[-8px] left-0 w-full h-0.5 bg-white rounded-full"></span>
      </h3><br></br>
      <span className="font-sans text-lg sm:text-xl">{detail}</span>
    </div>
  </div>
);

export default Timeline;
