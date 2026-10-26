import type { Metadata } from "next";
import { PortalSignIn } from "@/components/portal/PortalSignIn";

export const metadata: Metadata = { title: "Sign in" };

export default function PortalPage() {
  return <PortalSignIn />;
}
