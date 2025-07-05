import React from "react";
import CryptoSlider from "./CryptoSlider";

const Hero = () => {
  return (
    <section id="hero">
      <div className="fixed top-20 left-0 w-full bg-[#5e2c80] z-50">
        <CryptoSlider />
      </div>
    </section>
  );
};

export default Hero;
