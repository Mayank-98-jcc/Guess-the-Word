const PERF_FLAG = "app:perf-debug";

function isPerfLoggingEnabled() {
  if (typeof window === "undefined") {
    return false;
  }

  if (import.meta.env.DEV) {
    return true;
  }

  try {
    return window.localStorage.getItem(PERF_FLAG) === "1";
  } catch {
    return false;
  }
}

function logPerformance(label, value) {
  if (!isPerfLoggingEnabled()) {
    return;
  }

  console.info(`[perf] ${label}: ${value}`);
}

export function markAppBootStart() {
  if (typeof performance === "undefined") {
    return;
  }

  performance.mark("app_boot_start");
}

export function measureAppBoot() {
  if (typeof performance === "undefined" || typeof window === "undefined") {
    return;
  }

  const finalize = () => {
    performance.mark("app_boot_ready");
    performance.measure("app_boot", "app_boot_start", "app_boot_ready");
    const entry = performance.getEntriesByName("app_boot").at(-1);

    if (entry) {
      logPerformance("boot", `${entry.duration.toFixed(1)}ms`);
    }
  };

  window.requestAnimationFrame(() => {
    window.requestAnimationFrame(finalize);
  });
}

export function reportRouteTransition(pathname) {
  if (typeof performance === "undefined") {
    return;
  }

  performance.mark(`route:${pathname}`);
  logPerformance("route", pathname);
}

export function observeLongTasks() {
  if (
    typeof window === "undefined"
    || typeof PerformanceObserver === "undefined"
    || !isPerfLoggingEnabled()
  ) {
    return () => {};
  }

  const observer = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      logPerformance("longtask", `${entry.duration.toFixed(1)}ms`);
    }
  });

  try {
    observer.observe({ entryTypes: ["longtask"] });
  } catch {
    return () => {};
  }

  return () => observer.disconnect();
}
