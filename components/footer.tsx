"use client";

import Link from "next/link";
import { Github, Twitter, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-6 py-12">
        {/* Mini CTA Section */}
        <div className="text-center mb-12">
          <h3 className="text-2xl font-bold mb-2">Ready to get started?</h3>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Join thousands of teams already using Multiboard to streamline their
            project management workflow.
          </p>
          <Button asChild size="lg" className="gap-2">
            <Link href="/boards">
              Get Started Free
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>

        <Separator className="mb-8" />

        {/* Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="text-xl font-bold">
              Multiboard
            </Link>
            <p className="text-muted-foreground text-sm">
              Open source Kanban project management for modern teams.
            </p>
          </div>

          {/* Navigation Links */}
          <div className="space-y-4">
            <h4 className="font-semibold">Navigation</h4>
            <div className="space-y-2">
              <Link
                href="/"
                className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Home
              </Link>
              <Link
                href="/boards"
                className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Boards
              </Link>
              <Link
                href="/posts"
                className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Posts
              </Link>
              <Link
                href="/api/openapi/reference"
                className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                API
              </Link>
            </div>
          </div>

          {/* Social Links */}
          <div className="space-y-4">
            <h4 className="font-semibold">Connect</h4>
            <div className="flex space-x-4">
              <Link
                href="https://github.com/olliethedev/multiboard"
                className="p-2 rounded-md bg-muted hover:bg-muted/80 transition-colors"
                aria-label="GitHub"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github className="w-5 h-5" />
              </Link>
              <Link
                href="https://x.com/olliethedev"
                className="p-2 rounded-md bg-muted hover:bg-muted/80 transition-colors"
                aria-label="Twitter"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Twitter className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>

        <Separator className="my-8" />

        {/* Copyright */}
        <div className="text-center text-sm text-muted-foreground">
          <p>
            © {new Date().getFullYear()} Multiboard. Built with ❤️ by the open
            source community.
          </p>
        </div>
      </div>
    </footer>
  );
}
