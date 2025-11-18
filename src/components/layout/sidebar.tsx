"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  LayoutDashboard,
  CheckSquare,
  Wallet,
  User,
  LogOut,
  Loader2,
  Users,
  Activity,
  Building,
} from "lucide-react";
import { useLogout } from "@/lib/hooks/auth";
import { useEffect, useState } from "react";
import { User as UserType } from "@/types/auth";
import { userUtils } from "@/lib/auth";

const personalNavigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "My Tasks", href: "/tasks", icon: CheckSquare },
];

const organizationNavigation = [
  { name: "Overview", href: "/overview", icon: LayoutDashboard },
  { name: "Tasks", href: "/taskmanager", icon: CheckSquare },
  { name: "Activities", href: "/activities", icon: Activity },
  { name: "Accounts & Transactions", href: "/accounts", icon: Wallet },
  { name: "Members", href: "/members", icon: Users },
];

export default function Sidebar() {
  const pathname = usePathname();
  const logoutMutation = useLogout();
  const [user, setUser] = useState<UserType | null>(null);

  useEffect(() => {
    try {
      setUser(userUtils.getUser());
    } catch (error) {
      console.error("Error getting user in Sidebar:", error);
      setUser(null);
    }
  }, []);

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const getUserInitials = (name?: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <div className='flex h-full w-64 flex-col bg-card border-r'>
      <div className='flex h-16 items-center border-b px-4'>
        <h1 className='text-xl font-bold'>ClubStack</h1>
      </div>

      <nav className='flex-1 overflow-auto'>
        {/* Personal Section */}
        <div className='border-b'>
          <div className='px-4 py-3 bg-muted/50'>
            <p className='text-xs font-semibold text-muted-foreground uppercase tracking-wider'>
              Personal
            </p>
          </div>
          <div className='space-y-1 p-4'>
            {personalNavigation.map((item) => {
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
          </div>
        </div>

        {/* Organization Section */}
        <div>
          <div className='px-4 py-3 bg-muted/50'>
            <p className='text-xs font-semibold text-muted-foreground uppercase tracking-wider'>
              Organization
            </p>
          </div>
          <div className='space-y-1 p-4'>
            {organizationNavigation.map((item) => {
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
          </div>
        </div>
      </nav>

      {/* User Profile Section */}
      <div className='border-t p-4'>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant='ghost'
              className='w-full justify-start h-auto py-2 px-3'
            >
              <Avatar className='h-8 w-8 mr-3'>
                <AvatarImage src='' alt={user?.name || ""} />
                <AvatarFallback>{getUserInitials(user?.name)}</AvatarFallback>
              </Avatar>
              <div className='flex flex-col items-start text-left flex-1 min-w-0'>
                <p className='text-sm font-medium leading-none truncate w-full'>
                  {user?.name || "User"}
                </p>
                <p className='text-xs text-muted-foreground truncate w-full'>
                  {user?.email || ""}
                </p>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className='w-56' align='end' side='top'>
            <DropdownMenuLabel className='font-normal'>
              <div className='flex flex-col space-y-1'>
                <p className='text-sm font-medium leading-none'>
                  {user?.name || "User"}
                </p>
                <p className='text-xs leading-none text-muted-foreground'>
                  {user?.email || ""}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href='/profile' className='flex items-center cursor-pointer'>
                <User className='mr-2 h-4 w-4' />
                <span>Profile</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href='/organizations' className='flex items-center cursor-pointer'>
                <Building className='mr-2 h-4 w-4' />
                <span>My organizations</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleLogout}
              disabled={logoutMutation.isPending}
              className='text-destructive focus:text-destructive cursor-pointer'
            >
              {logoutMutation.isPending ? (
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
              ) : (
                <LogOut className='mr-2 h-4 w-4' />
              )}
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
