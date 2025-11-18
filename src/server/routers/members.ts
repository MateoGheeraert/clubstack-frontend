import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { apiClient } from "@/lib/api-client";
import { OrganizationMember } from "@/types";

export const membersRouter = createTRPCRouter({
  // Get all members of an organization
  getByOrganization: protectedProcedure
    .input(z.object({ organizationId: z.string() }))
    .query(async ({ input, ctx }) => {
      const response = await apiClient.get(
        `/organizations/${input.organizationId}/users`,
        {
          headers: {
            Authorization: `Bearer ${ctx.token}`,
          },
        }
      );
      return response.data as OrganizationMember[];
    }),

  // Add a member to an organization
  add: protectedProcedure
    .input(
      z.object({
        organizationId: z.string(),
        userId: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const response = await apiClient.post(
        `/organizations/${input.organizationId}/users`,
        { userId: input.userId },
        {
          headers: {
            Authorization: `Bearer ${ctx.token}`,
          },
        }
      );
      return response.data as OrganizationMember;
    }),

  // Remove a member from an organization
  remove: protectedProcedure
    .input(
      z.object({
        organizationId: z.string(),
        userId: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const response = await apiClient.delete(
        `/organizations/${input.organizationId}/users/${input.userId}`,
        {
          headers: {
            Authorization: `Bearer ${ctx.token}`,
          },
        }
      );
      return response.data;
    }),

  // Add a member by email
  addByEmail: protectedProcedure
    .input(
      z.object({
        organizationId: z.string(),
        email: z.string().email(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const response = await apiClient.post(
        `/organizations/${input.organizationId}/users/email`,
        { email: input.email },
        {
          headers: {
            Authorization: `Bearer ${ctx.token}`,
          },
        }
      );
      return response.data as OrganizationMember;
    }),

  // Update member role (promote/demote)
  updateRole: protectedProcedure
    .input(
      z.object({
        organizationId: z.string(),
        userId: z.string(),
        role: z.enum(["USER", "MODERATOR", "ADMIN"]),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const response = await apiClient.patch(
        `/organizations/${input.organizationId}/users/${input.userId}`,
        { role: input.role },
        {
          headers: {
            Authorization: `Bearer ${ctx.token}`,
          },
        }
      );
      return response.data as OrganizationMember;
    }),
});

export default membersRouter;
