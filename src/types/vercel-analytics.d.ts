declare module "@vercel/analytics/next" {
  import type { ComponentType } from "react";

  export const Analytics: ComponentType<{
    debug?: boolean;
    mode?: "auto" | "development" | "production";
  }>;
}

declare module "@vercel/analytics" {
  export function track(name: string, properties?: Record<string, string | number | boolean | null | undefined>): void;
}
