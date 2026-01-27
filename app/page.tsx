"use client";

import * as React from "react";
import { FeaturesSection } from "@/components/marketing/features-section";
import { HeroSectionOne } from "@/components/marketing/hero-section-one";
import { TechStackSection } from "@/components/marketing/tech-stack-section";
import { CtaSection } from "@/components/marketing/cta-section";
import { LatestPostsSection } from "@/components/marketing/latest-posts-section";
import { Footer } from "@/components/footer";


function Callout() {
  return (
    <div className="relative mx-auto max-w-2xl mt-6 px-4">
      <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border-l-4 border-primary rounded-r-lg p-4">
        <p className="text-sm text-muted-foreground">
          <strong className="text-foreground">
            Multiboard is now part of{" "}
            <a
              target="_blank"
              className="text-primary underline hover:cursor-pointer"
              href="https://better-stack.ai/"
            >
              Better Stack
            </a>
          </strong>{" "}
          — ship full-stack features faster with production-ready plugins that
          generate database schemas, API routes, and pages for Next.js, TanStack
          Start, and React Router.
        </p>
      </div>
    </div>
  );
}

function MultiboardLanding() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <HeroSectionOne />
      <Callout />
      <FeaturesSection />
      <LatestPostsSection />
      <TechStackSection />
      <CtaSection />
      <Footer />
    </div>
  );
}



export default MultiboardLanding;
