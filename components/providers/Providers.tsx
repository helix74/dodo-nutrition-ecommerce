"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import LoadingSpinner from "@/components/loaders/LoadingSpinner";
import { getAdminSanityToken } from "@/lib/actions/admin-token";

const SanityAppProvider = dynamic(
  () => import("@/components/providers/SanityAppProvider"),
  {
    ssr: false,
    loading: () => (
      <LoadingSpinner text="Loading Sanity App SDK..." isFullScreen size="lg" />
    ),
  },
);

export function Providers({ children }: { children: React.ReactNode }) {
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getAdminSanityToken()
      .then((token) => setAuthToken(token))
      .catch(() => setAuthToken(null))
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return (
      <LoadingSpinner text="Authenticating..." isFullScreen size="lg" />
    );
  }

  return (
    <SanityAppProvider authToken={authToken}>
      {children}
    </SanityAppProvider>
  );
}
