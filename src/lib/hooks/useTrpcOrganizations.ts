"use client";

import { trpc } from "@/lib/trpc-provider";

/**
 * tRPC-based hooks for organizations
 */

export const useMyOrganizations = () => {
  return trpc.organizations.getMy.useQuery();
};

export const useOrganization = (organizationId: string) => {
  return trpc.organizations.getById.useQuery(
    { organizationId },
    {
      enabled: !!organizationId,
    }
  );
};

export const useCreateOrganization = () => {
  const utils = trpc.useUtils();
  return trpc.organizations.create.useMutation({
    onSuccess: () => {
      utils.organizations.invalidate();
    },
  });
};

export const useUpdateOrganization = () => {
  const utils = trpc.useUtils();
  return trpc.organizations.update.useMutation({
    onSuccess: () => {
      utils.organizations.invalidate();
    },
  });
};

export const useDeleteOrganization = () => {
  const utils = trpc.useUtils();
  return trpc.organizations.delete.useMutation({
    onSuccess: () => {
      utils.organizations.invalidate();
    },
  });
};
