import React, { useEffect } from "react";
import HeroSection from "../components/landing/HeroSection";
import Features from "../components/landing/Features";
import Pricing from "../components/landing/Pricing";
import Testimonials from "../components/landing/Testimonials";
import CTASection from "../components/landing/CTASection";
import Footer from "../components/landing/Footer";
import { features, pricingPlans, testimonials } from "../assets/data";
import { useClerk, useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";

const landing = () => {

  const {openSignIn,openSignUp} = useClerk();
  const {isSignedIn} = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if(isSignedIn){
      navigate("/dashboard");
    }
  },[isSignedIn,navigate]);




  return (
    <div className="landing-page bg-gradient-to-b  ">
      {/* Hero Section*/}
      <HeroSection openSignIn={openSignIn} openSignUp={openSignUp}/>

      {/* Features section*/}
      <Features features={features}/>

      {/* Pricing section*/}
      <Pricing Pricing = {pricingPlans} openSignUp = {openSignUp}/>

      {/* Testimonials section*/}
      <Testimonials testimonials = {testimonials}/>

      {/* CTA section*/}
      <CTASection openSignUp={openSignUp} />

      {/* Footer section*/}
      <Footer/>


    </div>
  );
};

export default landing;
