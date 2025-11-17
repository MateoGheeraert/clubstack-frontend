import { trpc } from "../trpc-provider";

// Get all members of an organization
export const useOrganizationMembers = (organizationId: string) => {
  return trpc.members.getByOrganization.useQuery(
    { organizationId },
    {
      enabled: !!organizationId,
    }
  );
};

// Add a member to an organization
export const useAddMember = () => {
  const utils = trpc.useUtils();
  return trpc.members.add.useMutation({
    onSuccess: () => {
      utils.members.getByOrganization.invalidate();
    },
  });
};

// Remove a member from an organization
export const useRemoveMember = () => {
  const utils = trpc.useUtils();
  return trpc.members.remove.useMutation({
    onSuccess: () => {
      utils.members.getByOrganization.invalidate();
    },
  });
};
