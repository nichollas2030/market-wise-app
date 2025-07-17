import * as React from "react";

const BREAKPOINTS = {
  mobile: 768,
  tablet: 1024,
  desktop: 1280,
} as const;

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(
    undefined
  );

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${BREAKPOINTS.mobile - 1}px)`);
    const onChange = () => {
      setIsMobile(window.innerWidth < BREAKPOINTS.mobile);
    };
    mql.addEventListener("change", onChange);
    setIsMobile(window.innerWidth < BREAKPOINTS.mobile);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return !!isMobile;
}

export function useIsTablet() {
  const [isTablet, setIsTablet] = React.useState<boolean | undefined>(
    undefined
  );

  React.useEffect(() => {
    const mql = window.matchMedia(
      `(min-width: ${BREAKPOINTS.mobile}px) and (max-width: ${
        BREAKPOINTS.tablet - 1
      }px)`
    );
    const onChange = () => {
      setIsTablet(
        window.innerWidth >= BREAKPOINTS.mobile &&
          window.innerWidth < BREAKPOINTS.tablet
      );
    };
    mql.addEventListener("change", onChange);
    setIsTablet(
      window.innerWidth >= BREAKPOINTS.mobile &&
        window.innerWidth < BREAKPOINTS.tablet
    );
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return !!isTablet;
}

export function useIsDesktop() {
  const [isDesktop, setIsDesktop] = React.useState<boolean | undefined>(
    undefined
  );

  React.useEffect(() => {
    const mql = window.matchMedia(`(min-width: ${BREAKPOINTS.tablet}px)`);
    const onChange = () => {
      setIsDesktop(window.innerWidth >= BREAKPOINTS.tablet);
    };
    mql.addEventListener("change", onChange);
    setIsDesktop(window.innerWidth >= BREAKPOINTS.tablet);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return !!isDesktop;
}

export function useBreakpoint() {
  const [breakpoint, setBreakpoint] = React.useState<
    "mobile" | "tablet" | "desktop"
  >("mobile");

  React.useEffect(() => {
    const updateBreakpoint = () => {
      const width = window.innerWidth;
      if (width < BREAKPOINTS.mobile) {
        setBreakpoint("mobile");
      } else if (width < BREAKPOINTS.tablet) {
        setBreakpoint("tablet");
      } else {
        setBreakpoint("desktop");
      }
    };

    window.addEventListener("resize", updateBreakpoint);
    updateBreakpoint();
    return () => window.removeEventListener("resize", updateBreakpoint);
  }, []);

  return breakpoint;
}
