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

// Add a member by email
export const useAddMemberByEmail = () => {
  const utils = trpc.useUtils();
  return trpc.members.addByEmail.useMutation({
    onSuccess: () => {
      utils.members.getByOrganization.invalidate();
    },
  });
};

// Update member role (promote/demote)
export const useUpdateMemberRole = () => {
  const utils = trpc.useUtils();
  return trpc.members.updateRole.useMutation({
    onSuccess: () => {
      utils.members.getByOrganization.invalidate();
    },
  });
};
