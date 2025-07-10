"use client";

import { AuthCard } from "@daveyplate/better-auth-ui";
import { Suspense } from "react";

export function AuthView({ pathname }: { pathname: string }) {
  return (
    <main className="container flex grow flex-col items-center justify-center gap-3 self-center p-4 md:p-6">
      <Suspense fallback={<div>Loading...</div>}>
        <AuthCard pathname={pathname} />
      </Suspense>
    </main>
  );
}
