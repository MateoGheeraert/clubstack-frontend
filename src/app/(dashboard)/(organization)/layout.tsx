import Sidebar from "@/components/layout/sidebar";
import Topbar from "@/components/layout/topbar";

export default function OrganizationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className='h-screen flex'>
      <Sidebar />
      <div className='flex-1 flex flex-col overflow-hidden'>
        <Topbar />
        <main className='flex-1 overflow-auto bg-background p-6'>
          {children}
        </main>
      </div>
    </div>
  );
}
