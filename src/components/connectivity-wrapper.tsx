"use client";

import { useEffect, useState } from "react";
import { SignalLow, Wifi, WifiOff } from "lucide-react";

type NetworkInformation = {
  effectiveType?: string;
  downlink?: number;
  rtt?: number;
  addEventListener?: (type: "change", listener: () => void) => void;
  removeEventListener?: (type: "change", listener: () => void) => void;
};

type NavigatorWithConnection = Navigator & {
  connection?: NetworkInformation;
  mozConnection?: NetworkInformation;
  webkitConnection?: NetworkInformation;
};

type ConnectionStatus = "online" | "slow" | "offline";

function getConnectionStatus(): ConnectionStatus {
  if (!navigator.onLine) return "offline";

  const connection = (navigator as NavigatorWithConnection).connection
    || (navigator as NavigatorWithConnection).mozConnection
    || (navigator as NavigatorWithConnection).webkitConnection;

  if (!connection) return "online";

  const isSlowType = connection.effectiveType === "slow-2g" || connection.effectiveType === "2g";
  const isSlowConnection = (connection.downlink !== undefined && connection.downlink < 1)
    || (connection.rtt !== undefined && connection.rtt > 500);

  return isSlowType || isSlowConnection ? "slow" : "online";
}

export function ConnectivityWrapper({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<ConnectionStatus>("online");

  useEffect(() => {
    const updateStatus = () => setStatus(getConnectionStatus());
    const connection = (navigator as NavigatorWithConnection).connection
      || (navigator as NavigatorWithConnection).mozConnection
      || (navigator as NavigatorWithConnection).webkitConnection;

    updateStatus();
    window.addEventListener("online", updateStatus);
    window.addEventListener("offline", updateStatus);
    connection?.addEventListener?.("change", updateStatus);

    return () => {
      window.removeEventListener("online", updateStatus);
      window.removeEventListener("offline", updateStatus);
      connection?.removeEventListener?.("change", updateStatus);
    };
  }, []);

  return (
    <>
      {children}
      {status !== "online" && (
        <div
          role="status"
          aria-live="polite"
          className="fixed inset-x-4 bottom-4 z-[200] mx-auto flex max-w-md items-center gap-3 rounded-2xl bg-[var(--ink)] px-4 py-3 text-[var(--bg)] shadow-2xl md:inset-x-auto md:right-6 md:bottom-6"
        >
          {status === "offline" ? <WifiOff className="h-5 w-5 shrink-0" /> : <SignalLow className="h-5 w-5 shrink-0" />}
          <div className="min-w-0">
            <p className="font-sans text-sm font-medium">
              {status === "offline" ? "You're offline" : "Slow connection"}
            </p>
            <p className="font-sans text-xs opacity-75">
              {status === "offline"
                ? "Some features may be unavailable until your connection returns."
                : "Some pages and messages may take longer to load."}
            </p>
          </div>
        </div>
      )}
    </>
  );
}
