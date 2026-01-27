import React from "react";
import HeroSection from "../components/landing/HeroSection";
import Features from "../components/landing/Features";
import Pricing from "../components/landing/Pricing";
import Testimonials from "../components/landing/Testimonials";
import CTASection from "../components/landing/CTASection";
import Footer from "../components/landing/Footer";

const landing = () => {
  return (
    <div className="landing-page bg-gradient-to-b  ">
      {/* Hero Section*/}
      <HeroSection/>

      {/* Features section*/}
      <Features/>

      {/* Pricing section*/}
      <Pricing/>

      {/* Testimonials section*/}
      <Testimonials/>

      {/* CTA section*/}
      <CTASection/>

      {/* Footer section*/}
      <Footer/>


    </div>
  );
};

export default landing;
