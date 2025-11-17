"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { Organization } from "@/types";

interface OrganizationContextType {
  selectedOrganization: Organization | null;
  setSelectedOrganization: (org: Organization | null) => void;
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
    useState<Organization | null>(null);

  const selectedOrganizationId = selectedOrganization?.id || null;

  // Persist selected organization in localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("selectedOrganization");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          // Clear old UserOrganization format (has nested organization property)
          if (parsed.organization) {
            console.log("Clearing old UserOrganization format");
            localStorage.removeItem("selectedOrganization");
            return;
          }
          setSelectedOrganization(parsed);
        } catch (error) {
          console.error("Error parsing saved organization:", error);
          localStorage.removeItem("selectedOrganization");
        }
      }
    }
  }, []);

  const handleSetSelectedOrganization = (org: Organization | null) => {
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
