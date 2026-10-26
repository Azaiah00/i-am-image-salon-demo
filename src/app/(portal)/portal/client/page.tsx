import type { Metadata } from "next";
import { ClientPortal } from "@/components/portal/ClientPortal";

export const metadata: Metadata = { title: "My account" };

export default function ClientPage() {
  return <ClientPortal />;
}
