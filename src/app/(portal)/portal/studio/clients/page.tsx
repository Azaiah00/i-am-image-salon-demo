import type { Metadata } from "next";
import { ClientsView } from "@/components/portal/StudioViews";

export const metadata: Metadata = { title: "Clients" };

export default function Page() {
  return <ClientsView />;
}
