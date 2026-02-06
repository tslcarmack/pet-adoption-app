"use client";

type EventName = 
  | "view_pet"
  | "favorite_pet"
  | "unfavorite_pet"
  | "submit_application"
  | "share_pet"
  | "search_pets"
  | "filter_pets"
  | "register"
  | "login"
  | "view_profile";

interface EventProperties {
  [key: string]: string | number | boolean | undefined;
}

/**
 * Simple analytics hook for tracking user events
 * Can be extended to integrate with Google Analytics, Vercel Analytics, etc.
 */
export function useAnalytics() {
  const trackEvent = (eventName: EventName, properties?: EventProperties) => {
    try {
      // Log to console in development
      if (process.env.NODE_ENV === "development") {
        console.log(`[Analytics] ${eventName}`, properties);
      }

      // TODO: Send to analytics service
      // Example integrations:
      // - window.gtag?.('event', eventName, properties)
      // - window.plausible?.(eventName, { props: properties })
      // - fetch('/api/analytics', { method: 'POST', body: JSON.stringify({ eventName, properties }) })

      // For now, we'll just store in sessionStorage for demo
      const events = JSON.parse(sessionStorage.getItem("analytics_events") || "[]");
      events.push({
        event: eventName,
        properties,
        timestamp: new Date().toISOString(),
      });
      
      // Keep last 100 events
      if (events.length > 100) {
        events.shift();
      }
      
      sessionStorage.setItem("analytics_events", JSON.stringify(events));
    } catch (error) {
      console.error("Analytics tracking error:", error);
    }
  };

  const trackPageView = (pagePath: string) => {
    trackEvent("view_pet", { path: pagePath });
  };

  return {
    trackEvent,
    trackPageView,
  };
}
