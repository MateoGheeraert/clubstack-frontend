"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { UserOrganization } from "@/types";

interface OrganizationContextType {
  selectedOrganization: UserOrganization | null;
  setSelectedOrganization: (org: UserOrganization | null) => void;
  selectedOrganizationId: string | null;
}

const OrganizationContext = createContext<OrganizationContextType | undefined>(
  undefined
);

export const useOrganizationContext = () => {
  const context = useContext(OrganizationContext);
  if (!context) {
    throw new Error(
      "useOrganizationContext must be used within OrganizationProvider"
    );
  }
  return context;
};

interface OrganizationProviderProps {
  children: ReactNode;
}

export const OrganizationProvider = ({
  children,
}: OrganizationProviderProps) => {
  const [selectedOrganization, setSelectedOrganization] =
    useState<UserOrganization | null>(null);

  const selectedOrganizationId = selectedOrganization?.organization.id || null;

  // Persist selected organization in localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("selectedOrganization");
      if (saved) {
        try {
          setSelectedOrganization(JSON.parse(saved));
        } catch (error) {
          console.error("Error parsing saved organization:", error);
          localStorage.removeItem("selectedOrganization");
        }
      }
    }
  }, []);

  const handleSetSelectedOrganization = (org: UserOrganization | null) => {
    setSelectedOrganization(org);
    if (typeof window !== "undefined") {
      if (org) {
        localStorage.setItem("selectedOrganization", JSON.stringify(org));
      } else {
        localStorage.removeItem("selectedOrganization");
      }
    }
  };

  return (
    <OrganizationContext.Provider
      value={{
        selectedOrganization,
        setSelectedOrganization: handleSetSelectedOrganization,
        selectedOrganizationId,
      }}
    >
      {children}
    </OrganizationContext.Provider>
  );
};
