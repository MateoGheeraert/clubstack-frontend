"use client";

import { useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Organization } from "@/types";
import { useMyOrganizations } from "@/lib/hooks";
import { useOrganizationContext } from "@/contexts/OrganizationContext";

export default function Topbar() {
  const { data: organizations, isLoading: organizationsLoading } =
    useMyOrganizations();
  const { selectedOrganization, setSelectedOrganization } =
    useOrganizationContext();

  // Auto-select first organization if none selected and organizations are loaded
  useEffect(() => {
    if (!selectedOrganization && organizations && organizations.length > 0) {
      setSelectedOrganization(organizations[0]);
    }
  }, [organizations, selectedOrganization, setSelectedOrganization]);

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
          <SelectTrigger className='w-[250px]'>
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
    </div>
  );
}
