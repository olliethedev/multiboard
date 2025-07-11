/* eslint-disable @next/next/no-img-element */
"use client";

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink } from "lucide-react";

interface TechStackItem {
  name: string;
  purpose: string;
  link: string;
  domain: string;
}

const techStack: TechStackItem[] = [
  {
    name: "better-auth",
    purpose: "Authentication and authorization",
    link: "https://www.better-auth.com/",
    domain: "better-auth.com"
  },
  {
    name: "better-auth-ui",
    purpose: "Plug and play auth UI components",
    link: "https://better-auth-ui.com/",
    domain: "better-auth-ui.com"
  },
  {
    name: "shadcn/ui",
    purpose: "Beautifully-designed, accessible components",
    link: "https://ui.shadcn.com/",
    domain: "ui.shadcn.com"
  },
  {
    name: "Prisma",
    purpose: "PostgreSQL ORM and database toolkit",
    link: "https://www.prisma.io/postgres",
    domain: "prisma.io"
  },
  {
    name: "ZenStack",
    purpose: "TypeScript toolkit enhancing Prisma with authorization and auto-generated APIs",
    link: "https://zenstack.dev/",
    domain: "zenstack.dev"
  },
  {
    name: "TanStack Query",
    purpose: "Powerful data-fetching and state management",
    link: "https://tanstack.com/query/latest/docs/framework/react/overview",
    domain: "tanstack.com"
  },
  {
    name: "Scalar",
    purpose: "Beautiful API documentation",
    link: "https://guides.scalar.com/scalar/scalar-api-references/integrations/nextjs",
    domain: "scalar.com"
  },
  {
    name: "AutoForm",
    purpose: "Generate forms from Zod schemas",
    link: "https://github.com/vantezzen/autoform",
    domain: "github.com"
  },
  {
    name: "Minimal Tiptap",
    purpose: "Clean and minimal rich text editor",
    link: "https://github.com/Aslam97/shadcn-minimal-tiptap",
    domain: "github.com"
  },
  {
    name: "nuqs",
    purpose: "Type-safe search params state manager",
    link: "https://nuqs.47ng.com/",
    domain: "nuqs.47ng.com"
  },
  {
    name: "Vercel Blob",
    purpose: "Scalable file and image storage",
    link: "https://vercel.com/docs/vercel-blob",
    domain: "vercel.com"
  },
  {
    name: "Resend",
    purpose: "Modern email delivery platform",
    link: "https://resend.com/",
    domain: "resend.com"
  },
  {
    name: "DiceUI Kanban",
    purpose: "Beautiful kanban component library",
    link: "https://www.diceui.com/docs/components/kanban",
    domain: "diceui.com"
  }
];

export function TechStackSection() {
  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4">
            Technology Stack
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Built with Modern Technologies
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Multiboard leverages the best tools and frameworks to deliver a fast, 
            secure, and scalable kanban solution.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {techStack.map((tech, index) => (
            <Card 
              key={index} 
              className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer"
              onClick={() => window.open(tech.link, '_blank')}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-lg overflow-hidden bg-background border flex items-center justify-center">
                    <img
                      src={`https://www.google.com/s2/favicons?domain=${tech.domain}&sz=32`}
                      alt={`${tech.name} favicon`}
                      className="w-5 h-5"
                      onError={(e) => {
                        // Fallback to a generic icon if favicon fails to load
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>
                  <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors ml-auto" />
                </div>
                <CardTitle className="text-lg leading-tight">
                  {tech.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm leading-relaxed">
                  {tech.purpose}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-sm text-muted-foreground">
            All technologies are carefully selected for reliability, performance, and developer experience
          </p>
        </div>
      </div>
    </section>
  );
} 