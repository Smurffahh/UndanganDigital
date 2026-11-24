"use client";

import { useEffect, useState } from "react";
import { DashboardSplashScreen } from "@/components/admin/DashboardSplashScreen";
import { getSplashTransition, type SplashTransitionData } from "@/lib/splashTransition";

export default function DashboardLoading() {
  const [transition, setTransition] = useState<SplashTransitionData | null>(null);

  useEffect(() => {
    setTransition(getSplashTransition());
  }, []);

  if (transition) {
    return (
      <DashboardSplashScreen
        variant="welcome"
        displayName={transition.displayName}
        role={transition.role}
      />
    );
  }

  return <DashboardSplashScreen variant="access" />;
}
