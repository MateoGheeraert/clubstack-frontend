import Sidebar from "@/components/layout/sidebar";

export default function PersonalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className='h-screen flex'>
      <Sidebar />
      <div className='flex-1 flex flex-col overflow-hidden'>
        <main className='flex-1 overflow-auto bg-background p-6'>
          {children}
        </main>
      </div>
    </div>
  );
}
