"use client";

import * as React from "react";
import { FeaturesSection } from "@/components/marketing/features-section";
import { HeroSectionOne } from "@/components/marketing/hero-section-one";
import { TechStackSection } from "@/components/marketing/tech-stack-section";
import { CtaSection } from "@/components/marketing/cta-section";
import { LatestPostsSection } from "@/components/marketing/latest-posts-section";
import { Footer } from "@/components/footer";


function MultiboardLanding() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <HeroSectionOne />
      <FeaturesSection />
      <LatestPostsSection />
      <TechStackSection />
      <CtaSection />
      <Footer />
    </div>
  );
}



export default MultiboardLanding;
