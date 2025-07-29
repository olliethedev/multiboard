"use client";
import {
  GitHubIcon,
  OrganizationSwitcher,
  UserButton,
} from "@daveyplate/better-auth-ui";
import Link from "next/link";
import { useSession } from "@/lib/auth-client";
import { LayoutDashboard, Menu, Slash } from "lucide-react";
import { Suspense } from "react";

import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useRouter } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

export function Header() {
  return (
    <header className="sticky z-10 top-0 border-b bg-background/60 py-3 backdrop-blur">
      <div className="container mx-auto flex items-center justify-between md:justify-start px-6">
        <MobileMenu />
        <Logo />
        <DesktopMenu />
        {/* Spacer */}
        <div className="block md:hidden w-10" />
      </div>
    </header>
  );
}

function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2 group">
      <LayoutDashboard className="size-5 md:size-8 group-hover:animate-spin" />
      <div className="flex flex-col md:ml-1">
        <span className="text-lg font-bold font-mono whitespace-nowrap">
          MULTI-BOARD
        </span>
        <span className="text-xs text-muted-foreground whitespace-nowrap hidden md:block">
          Open Source Kanban
        </span>
      </div>
    </Link>
  );
}

function MobileMenu() {
  const router = useRouter();
  const session = useSession();
  const user = session?.data?.user;
  return (
    <div className="flex md:hidden items-center gap-2">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="w-10 h-9">
            <Menu className="size-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-80 px-2">
          <SheetHeader>
            <SheetTitle>Menu</SheetTitle>
          </SheetHeader>
          <div className="flex flex-col gap-6 mt-6">
            {/* Organization Switcher */}
            {user && (
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">
                  Organization
                </h3>
                <Suspense
                  fallback={
                    <div className="h-10 w-full bg-secondary rounded animate-pulse" />
                  }
                >
                  <OrganizationSwitcher
                    variant="secondary"
                    className="w-full h-auto"
                    size="lg"
                    onSetActive={(activeOrganization) => {
                      console.log(activeOrganization);
                      router.push("/boards");
                    }}
                  />
                </Suspense>
              </div>
            )}

            {/* User Button */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">
                User
              </h3>
              <Suspense
                fallback={
                  <div className="h-10 w-full bg-secondary rounded animate-pulse" />
                }
              >
                <UserButton size="lg" variant="secondary" className="w-full" />
              </Suspense>
            </div>

            {/* Navigation Links */}

            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">
                Navigation
              </h3>
              <div className="flex flex-col gap-2">
                {user && (
                  <Link
                    href="/boards"
                    className="text-sm font-medium hover:underline py-2 px-3 hover:bg-secondary rounded-md transition-colors"
                  >
                    Boards
                  </Link>
                )}
                <Link
                  href="/posts"
                  className="text-sm font-medium hover:underline py-2 px-3 hover:bg-secondary rounded-md transition-colors"
                >
                  Posts
                </Link>
                <Link
                  href="/api/openapi/reference"
                  className="text-sm font-medium hover:underline py-2 px-3 hover:bg-secondary rounded-md transition-colors"
                >
                  API
                </Link>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">
                Theme
              </h3>
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between py-2 px-3">
                  <span className="text-sm font-medium">Dark Mode</span>
                  <ModeToggle />
                </div>
              </div>
            </div>
          </div>
          <SheetFooter>
            <Separator dir="horizontal" />
            <GitHubButton className="w-full">
              <span className="text-sm font-medium">View on GitHub</span>
            </GitHubButton>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}

function DesktopMenu() {
  const router = useRouter();
  const session = useSession();
  const user = session?.data?.user;
  return (
    <>
      {/* Desktop Organization Switcher */}
      {user && (
        <>
          <div className="hidden md:flex items-center gap-1 ml-2 text-muted-foreground">
            <Slash className="size-7 -rotate-12" />
            <Suspense
              fallback={
                <div className="h-8 w-32 bg-secondary rounded animate-pulse" />
              }
            >
              <OrganizationSwitcher
                className="h-auto"
                variant="secondary"
                onSetActive={(activeOrganization) => {
                  console.log(activeOrganization);
                  router.push("/boards");
                }}
              />
            </Suspense>
          </div>
        </>
      )}
      {/* Desktop Navigation */}

      <div className="hidden md:flex items-center gap-4 flex-1 justify-center flex-wrap">
        {user && (
          <Link href="/boards" className="text-sm font-medium hover:underline">
            Boards
          </Link>
        )}
        <Link href="/posts" className="text-sm font-medium hover:underline">
          Posts
        </Link>
        <Link
          href="/api/openapi/reference"
          className="text-sm font-medium hover:underline"
        >
          API
        </Link>
      </div>

      {/* Desktop Actions */}
      <div className="hidden md:flex items-center gap-2">
        <GitHubButton className="rounded-full w-8 h-8 min-w-8 min-h-8 flex items-center justify-center" />

        <ModeToggle />
        <Suspense
          fallback={
            <div className="h-8 w-8 bg-secondary rounded-full animate-pulse" />
          }
        >
          <UserButton variant="secondary" size="icon" />
        </Suspense>
      </div>
    </>
  );
}

function GitHubButton({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <Link
      href="https://github.com/olliethedev/multiboard"
      target="_blank"
      className={cn("w-full overflow-hidden", className)}
    >
      <Button className="w-full">
        <GitHubIcon />
        {children}
      </Button>
    </Link>
  );
}
