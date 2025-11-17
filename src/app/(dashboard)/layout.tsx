import { OrganizationProvider } from "@/contexts/OrganizationContext";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <OrganizationProvider>{children}</OrganizationProvider>;
}
