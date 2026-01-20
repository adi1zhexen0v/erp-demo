import * as Sentry from "@sentry/react";

export function initSentry(): void {
  if (!import.meta.env.PROD) {
    return;
  }

  const dsn = import.meta.env.VITE_SENTRY_DSN;
  if (!dsn) {
    return;
  }

  Sentry.init({
    dsn,
    environment: import.meta.env.MODE,
    release: import.meta.env.VITE_APP_VERSION,
    integrations: [Sentry.browserTracingIntegration()],
    tracesSampleRate: 0.1,
    ignoreErrors: [
      "ResizeObserver loop limit exceeded",
      "NetworkError when attempting to fetch resource.",
      "Failed to fetch",
    ],
    beforeSend(event, _hint) {
      if (event.request?.headers) {
        const sanitizedHeaders = { ...event.request.headers };
        delete sanitizedHeaders.Authorization;
        delete sanitizedHeaders.Cookie;
        delete sanitizedHeaders["Set-Cookie"];

        return {
          ...event,
          request: {
            ...event.request,
            headers: sanitizedHeaders,
          },
        };
      }

      return event;
    },
  });
}
