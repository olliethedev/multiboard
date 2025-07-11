"use client";

import * as React from "react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AnimatedContainer } from "@/components/animated-container";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { ArrowRight, Clock, GitBranch, Rocket, Ship } from "lucide-react";
import { GitHubIcon } from "@daveyplate/better-auth-ui";

export function CtaSection() {
  return (
    <section className="relative py-24 bg-gradient-to-b from-background to-muted/50">
      {/* Background pattern */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className={cn(
            "absolute inset-0",
            "[background-size:30px_30px]",
            "[background-image:radial-gradient(#e5e7eb_1px,transparent_1px)]",
            "dark:[background-image:radial-gradient(#374151_1px,transparent_1px)]",
            "opacity-40"
          )}
        />
      </div>

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-background/80" />

      <div className="relative container mx-auto px-4">
        <AnimatedContainer className="mx-auto max-w-4xl text-center">
          <Badge variant="outline" className="mb-6">
            <Rocket className="w-3 h-3 mr-1" />
            Get Started Today
          </Badge>
          
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-balance">
            Ready to Transform Your Team&apos;s Workflow?
          </h2>
          
          <p className="text-lg md:text-xl text-muted-foreground mb-12 max-w-2xl mx-auto text-balance">
            Join thousands of teams already using Multiboard to streamline their 
            projects and boost productivity. Get started in minutes, no credit card required.
          </p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
          >
            <Button
              asChild
              size="lg"
              className={cn(
                "bg-gradient-to-r from-primary to-primary/90",
                "hover:from-primary/95 hover:to-primary/85",
                "text-primary-foreground shadow-lg",
                "transition-all duration-300 group",
                "text-base px-8 py-6"
              )}
            >
              <Link href="/boards">
                Try Now
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>

            <Button
              asChild
              size="lg"
              variant="outline"
              className={cn(
                "text-foreground/80 border-2",
                "hover:bg-muted hover:border-primary/50",
                "transition-all duration-300",
                "text-base px-8 py-6"
              )}
            >
              <Link
                href="https://github.com/olliethedev/multiboard"
                target="_blank"
              >
                <GitHubIcon />
                View on GitHub
              </Link>
            </Button>
          </motion.div>

          {/* Stats or trust indicators */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-2xl mx-auto"
          >
            <div className="text-center">
              <div className="text-2xl font-bold text-primary mb-1">
                <GitBranch className="w-5 h-5 mb-1 inline mr-1" />
                100%
              </div>
              <div className="text-sm text-muted-foreground">Open Source</div>
            </div>

            <div className="text-center">
              <div className="text-2xl font-bold text-primary mb-1">
                <Clock className="w-5 h-5 mb-1 inline mr-1" />
                5min
              </div>
              <div className="text-sm text-muted-foreground">Setup Time</div>
            </div>

            <div className="text-center">
              <div className="text-2xl font-bold text-primary mb-1">
                <Ship className="w-5 h-5 mb-1 inline mr-1" />
                Deploy
              </div>
              <div className="text-sm text-muted-foreground">
               On Vercel in seconds
              </div>
            </div>
          </motion.div>
        </AnimatedContainer>
      </div>
    </section>
  );
} 