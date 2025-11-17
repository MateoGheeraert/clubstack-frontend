import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { apiClient } from "@/lib/api-client";
import { Organization } from "@/types";

export const organizationsRouter = createTRPCRouter({
  // Get all organizations for the current user
  getMy: protectedProcedure.query(async ({ ctx }) => {
    const response = await apiClient.get("/organizations/my", {
      headers: {
        Authorization: `Bearer ${ctx.token}`,
      },
    });
    const data = response.data as Organization[];
    console.log("Organizations from backend:", JSON.stringify(data, null, 2));
    return data;
  }),

  // Get a single organization by ID
  getById: protectedProcedure
    .input(z.object({ organizationId: z.string() }))
    .query(async ({ input, ctx }) => {
      const response = await apiClient.get(
        `/organizations/${input.organizationId}`,
        {
          headers: {
            Authorization: `Bearer ${ctx.token}`,
          },
        }
      );
      return response.data as Organization;
    }),

  // Create a new organization
  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1),
        description: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const response = await apiClient.post("/organizations", input, {
        headers: {
          Authorization: `Bearer ${ctx.token}`,
        },
      });
      return response.data as Organization;
    }),

  // Update an organization
  update: protectedProcedure
    .input(
      z.object({
        organizationId: z.string(),
        data: z.object({
          name: z.string().min(1).optional(),
          description: z.string().optional(),
        }),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const response = await apiClient.put(
        `/organizations/${input.organizationId}`,
        input.data,
        {
          headers: {
            Authorization: `Bearer ${ctx.token}`,
          },
        }
      );
      return response.data as Organization;
    }),

  // Delete an organization
  delete: protectedProcedure
    .input(z.object({ organizationId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const response = await apiClient.delete(
        `/organizations/${input.organizationId}`,
        {
          headers: {
            Authorization: `Bearer ${ctx.token}`,
          },
        }
      );
      return response.data as { message: string };
    }),
});

export default organizationsRouter;
