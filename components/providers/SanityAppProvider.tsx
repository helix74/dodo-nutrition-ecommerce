"use client";

import { SanityApp } from "@sanity/sdk-react";
import { dataset, projectId } from "@/sanity/env";

interface SanityAppProviderProps {
  children: React.ReactNode;
  authToken?: string | null;
}

function SanityAppProvider({ children, authToken }: SanityAppProviderProps) {
  return (
    <SanityApp
      config={[
        {
          projectId,
          dataset,
          // If we have a token from the admin auth, use it to skip Sanity OAuth login
          ...(authToken ? { auth: { token: authToken } } : {}),
        },
      ]}
      // We handle the loading state in the Providers component by showing a loading indicator via the dynamic import
      fallback={<div />}
    >
      {children}
    </SanityApp>
  );
}

export default SanityAppProvider;

