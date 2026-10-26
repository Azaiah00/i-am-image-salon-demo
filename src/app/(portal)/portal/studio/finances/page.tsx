import type { Metadata } from "next";
import { FinancesView } from "@/components/portal/StudioViews";

export const metadata: Metadata = { title: "Finances" };

export default function Page() {
  return <FinancesView />;
}
