"use client";

import { useState, useEffect } from "react";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { User, Settings, LogOut } from "lucide-react";
import { logout, userUtils } from "@/lib/auth";
import { User as UserType } from "@/types/auth";
import type { Organization } from "@/types";
import { useMyOrganizations } from "@/lib/hooks";
import { useOrganizationContext } from "@/contexts/OrganizationContext";
import Link from "next/link";

export default function Topbar() {
  const [user, setUser] = useState<UserType | null>(null);
  const { data: organizations, isLoading: organizationsLoading } =
    useMyOrganizations();
  const { selectedOrganization, setSelectedOrganization } =
    useOrganizationContext();

  useEffect(() => {
    try {
      setUser(userUtils.getUser());
    } catch (error) {
      console.error("Error getting user in Topbar:", error);
      setUser(null);
    }
  }, []);

  // Auto-select first organization if none selected and organizations are loaded
  useEffect(() => {
    if (!selectedOrganization && organizations && organizations.length > 0) {
      setSelectedOrganization(organizations[0]);
    }
  }, [organizations, selectedOrganization, setSelectedOrganization]);

  const handleLogout = () => {
    logout();
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
    <div className='flex h-16 items-center justify-between border-b bg-background px-6'>
      <div className='flex items-center space-x-4'>
        <Select
          value={selectedOrganization?.id || ""}
          onValueChange={(value) => {
            const org = organizations?.find((o: Organization) => o.id === value);
            setSelectedOrganization(org || null);
          }}
        >
          <SelectTrigger className='w-[200px]'>
            <SelectValue
              placeholder={
                organizationsLoading ? "Loading..." : "Select Organization"
              }
            />
          </SelectTrigger>
          <SelectContent>
            {organizations?.map((org: Organization) => (
              <SelectItem key={org.id} value={org.id}>
                {org.name || org.id || "Unknown Organization"}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className='flex items-center space-x-4'>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='ghost' className='relative h-8 w-8 rounded-full'>
              <Avatar className='h-8 w-8'>
                <AvatarImage src='' alt={user?.name || ""} />
                <AvatarFallback>{getUserInitials(user?.name)}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className='w-56' align='end' forceMount>
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
              <Link href='/profile' className='flex items-center'>
                <User className='mr-2 h-4 w-4' />
                <span>Profile</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href='/settings' className='flex items-center'>
                <Settings className='mr-2 h-4 w-4' />
                <span>Settings</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className='text-red-600'>
              <LogOut className='mr-2 h-4 w-4' />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
