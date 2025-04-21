"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const HeroSection = () => {
  const imageRef = useRef(null);

  useEffect(() => {
    const imageElement = imageRef.current;

    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const scrollThreshold = 100;

      if (scrollPosition > scrollThreshold) {
        imageElement.classList.add("scrolled");
      } else if (imageElement) {
        imageElement.classList.remove("scrolled");
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section className="pt-40 pb-20 px-4 bg-[#fdfaf6] text-[#3c3c3b]">
      <div className="container mx-auto text-center">
        <h1 className="text-5xl md:text-7xl lg:text-[100px] font-semibold pb-6 gradient-title">
          Manage Your Finances <br /> with Peace of Mind
        </h1>
        <p className="text-lg md:text-xl text-[#6c7b6e] mb-10 max-w-2xl mx-auto leading-relaxed">
          A cozy, minimal budgeting platform to help you track and visualize your spending. No stress. Just clarity.
        </p>

        <div className="flex justify-center flex-wrap gap-4">
          <Link href="/dashboard">
            <Button
              size="lg"
              className="px-8 bg-[#498959] hover:bg-[#a1b8a7] text-white shadow-md"
            >
              Get Started
            </Button>
          </Link>
          <Link href="https://studio.youtube.com/channel/UCxBdAANUoWWdB7yj84IQ4fg" target="_blank">
            <Button
              size="lg"
              variant="outline"
              className="px-8 border-[#b3cbb9] text-[#6c7b6e] hover:bg-[#e7f0ea]"
            >
              Watch Demo
            </Button>
          </Link>
        </div>

        <div className="hero-image-wrapper mt-10">
          <div
            ref={imageRef}
            className="hero-image transition-all duration-500 ease-in-out trnasform"
          >
            <Image
              src="/banner.png"
              width={1280}
              height={720}
              alt="Dashboard Preview"
              className="rounded-xl shadow-xl border border-[#e6e3de] mx-auto"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
