"use client";

import dynamic from "next/dynamic";
import { ReactNode } from "react";

const StacksProvider = dynamic(
    () => import("@/components/StacksProvider").then((mod) => mod.StacksProvider),
    { ssr: false }
);

export function ClientProviders({ children }: { children: ReactNode }) {
    return <StacksProvider>{children}</StacksProvider>;
}
