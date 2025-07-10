"use client";

import { AuthQueryProvider } from "@daveyplate/better-auth-tanstack";
import { AuthUIProviderTanstack } from "@daveyplate/better-auth-ui/tanstack";
import { QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { Suspense } from "react";
import { Toaster } from "sonner";

import { authClient } from "@/lib/auth-client";
import { getQueryClient } from "@/lib/get-query-client";
import { Provider as ZenStackProvider } from "@/hooks/model";
import { uploadImage } from "@/lib/upload";
import { NuqsAdapter } from 'nuqs/adapters/next/app'
import { ModalsView } from "@/components/boards/modals/modals-view";

export function Providers({ children }: { children: ReactNode }) {
  const queryClient = getQueryClient();
  const router = useRouter();

  return (
    <QueryClientProvider client={queryClient}>
      <ZenStackProvider value={{ endpoint: "/api/model" }}>
        <AuthQueryProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <AuthUIProviderTanstack
              authClient={authClient}
              navigate={router.push}
              replace={router.replace}
              onSessionChange={() => {
                router.refresh();
                console.log("session changed");
              }}
              Link={Link}
              organization={{
                logo: {
                  upload: async (file) => {
                    const blob = await uploadImage(file);
                    const url = blob.url;
                    console.log("blob url", url);
                    return url;
                  },
                  size: 128,
                  extension: "png",
                },
              }}
              avatar={{
                upload: async (file) => {
                  const blob = await uploadImage(file);
                  const url = blob.url;
                  console.log("blob url", url);
                  return url;
                },
                size: 128,
                extension: "png",
              }}
              emailVerification={true}
            >
              <NuqsAdapter>
                {children}
                <Suspense fallback={null}>
                  <ModalsView />
                </Suspense>
                <Toaster />
              </NuqsAdapter>
            </AuthUIProviderTanstack>
          </ThemeProvider>
        </AuthQueryProvider>
      </ZenStackProvider>
    </QueryClientProvider>
  );
}
