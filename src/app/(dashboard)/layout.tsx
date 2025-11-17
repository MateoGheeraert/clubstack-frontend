import { OrganizationProvider } from "@/contexts/OrganizationContext";
import { AuthGuard } from "@/components/auth/auth-guard";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <OrganizationProvider>{children}</OrganizationProvider>
    </AuthGuard>
  );
}
