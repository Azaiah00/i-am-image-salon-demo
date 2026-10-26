import type { Metadata } from "next";
import { AppointmentsView } from "@/components/portal/StudioViews";

export const metadata: Metadata = { title: "Appointments" };

export default function Page() {
  return <AppointmentsView />;
}
