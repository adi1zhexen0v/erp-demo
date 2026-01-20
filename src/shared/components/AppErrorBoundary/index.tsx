import { type ReactNode } from "react";
import * as Sentry from "@sentry/react";
import ErrorFallback from "../ErrorFallback";

interface AppErrorBoundaryProps {
  children: ReactNode;
}

export default function AppErrorBoundary({ children }: AppErrorBoundaryProps) {
  return (
    <Sentry.ErrorBoundary
      fallback={({ error, componentStack }) => {
        if (import.meta.env.DEV) {
          console.error("Error caught by AppErrorBoundary:", error, componentStack);
        }
        return <ErrorFallback />;
      }}>
      {children}
    </Sentry.ErrorBoundary>
  );
}
