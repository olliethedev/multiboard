"use client";

import { motion } from "motion/react";
import { KanbanDemo } from "./demo-kanban";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import Link from "next/link";
import { GitHubIcon } from "@daveyplate/better-auth-ui";

export function HeroSectionOne() {
  return (
    <DotBackground>
      <div className="absolute inset-y-0 left-0 h-full w-px bg-neutral-200/80 dark:bg-neutral-800/80">
        <div className="absolute top-0 h-40 w-px bg-gradient-to-b from-transparent via-blue-500 to-transparent" />
      </div>
      <div className="absolute inset-y-0 right-0 h-full w-px bg-neutral-200/80 dark:bg-neutral-800/80">
        <div className="absolute h-40 w-px bg-gradient-to-b from-transparent via-blue-500 to-transparent" />
      </div>
      <div className="absolute inset-x-0 bottom-0 h-px w-full bg-neutral-200/80 dark:bg-neutral-800/80">
        <div className="absolute mx-auto h-px w-40 bg-gradient-to-r from-transparent via-blue-500 to-transparent" />
      </div>
      <div className="px-4 py-10 md:py-20">
        <h1 className="relative mx-auto max-w-4xl text-center text-2xl font-bold text-slate-700 md:text-4xl lg:text-7xl dark:text-slate-300">
          {"Open-Source Kanban Boards for Modern Teams"
            .split(" ")
            .map((word, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0, filter: "blur(4px)", y: 10 }}
                animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                transition={{
                  duration: 0.3,
                  delay: index * 0.1,
                  ease: "easeInOut",
                }}
                className="mr-2 inline-block"
              >
                {word}
              </motion.span>
            ))}
        </h1>
        <motion.p
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          transition={{
            duration: 0.3,
            delay: 0.8,
          }}
          className="relative mx-auto max-w-xl py-4 text-center text-lg font-normal text-neutral-600 dark:text-neutral-400"
        >
          Streamline your workflow with intuitive task management and real-time
          collaboration. Built for teams who value simplicity and control.
        </motion.p>
        <motion.div
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          transition={{
            duration: 0.3,
            delay: 1,
          }}
          className="relative mt-8 flex flex-wrap items-center justify-center gap-4"
        >
          <Button
            asChild
            size="lg"
            className={cn(
              "bg-gradient-to-b from-primary to-primary/90",
              "hover:from-primary/95 hover:to-primary/85",
              "text-primary-foreground shadow-lg",
              "transition-all duration-300"
            )}
          >
            <Link href="/boards">Try Now</Link>
          </Button>

          <Button
            asChild
            size="lg"
            variant="outline"
            className={cn("text-foreground/80", "transition-all duration-300")}
          >
            <Link
              href="https://github.com/olliethedev/multiboard"
              target="_blank"
            >
              <GitHubIcon />
              GitHub
            </Link>
          </Button>
        </motion.div>
        <motion.div
          initial={{
            opacity: 0,
            y: 10,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.3,
            delay: 1.2,
          }}
          className="relative mt-20 container mx-auto"
        >
          <KanbanDemo />
        </motion.div>
      </div>
    </DotBackground>
  );
}

function DotBackground({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-[100dvh] w-full items-center justify-center bg-white dark:bg-black">
      <div
        className={cn(
          "absolute inset-0",
          "[background-size:20px_20px]",
          "[background-image:radial-gradient(#d4d4d4_1px,transparent_1px)]",
          "dark:[background-image:radial-gradient(#404040_1px,transparent_1px)]"
        )}
      />
      {/* Radial gradient for the container to give a faded look */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] dark:bg-black"></div>
      {children}
    </div>
  );
}
