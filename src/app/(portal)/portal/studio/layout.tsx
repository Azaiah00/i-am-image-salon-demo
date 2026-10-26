import type { Metadata } from "next";
import { StudioShell } from "@/components/portal/StudioShell";

export const metadata: Metadata = { title: { default: "Studio", template: "%s · Studio · I Am Image" } };

export default function StudioLayout({ children }: { children: React.ReactNode }) {
  return <StudioShell>{children}</StudioShell>;
}
