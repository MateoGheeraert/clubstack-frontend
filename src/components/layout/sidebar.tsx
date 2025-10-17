"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  CheckSquare,
  Calendar,
  Wallet,
  Building2,
  User,
  LogOut,
  Loader2,
} from "lucide-react";
import { useLogout } from "@/lib/hooks/auth";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "My Tasks", href: "/tasks", icon: CheckSquare },
  { name: "Activities", href: "/activities", icon: Calendar },
  { name: "Accounts & Transactions", href: "/accounts", icon: Wallet },
  { name: "Organizations", href: "/organizations", icon: Building2 },
  { name: "Profile", href: "/profile", icon: User },
];

export default function Sidebar() {
  const pathname = usePathname();
  const logoutMutation = useLogout();

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <div className='flex h-full w-64 flex-col bg-card border-r'>
      <div className='flex h-16 items-center border-b px-4'>
        <h1 className='text-xl font-bold'>ClubStack</h1>
      </div>

      <nav className='flex-1 space-y-1 p-4'>
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link key={item.name} href={item.href}>
              <Button
                variant={isActive ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start",
                  isActive && "bg-secondary"
                )}
              >
                <Icon className='mr-2 h-4 w-4' />
                {item.name}
              </Button>
            </Link>
          );
        })}
      </nav>

      <div className='border-t p-4'>
        <Button
          variant='ghost'
          className='w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10'
          onClick={handleLogout}
          disabled={logoutMutation.isPending}
        >
          {logoutMutation.isPending ? (
            <Loader2 className='mr-2 h-4 w-4 animate-spin' />
          ) : (
            <LogOut className='mr-2 h-4 w-4' />
          )}
          Logout
        </Button>
      </div>
    </div>
  );
}
