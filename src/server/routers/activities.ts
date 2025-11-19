import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { apiClient } from "@/lib/api-client";
import { Activity, ActivitiesResponse } from "@/types";

export const activitiesRouter = createTRPCRouter({
  // Get all activities with pagination
  getAll: protectedProcedure
    .input(
      z.object({
        page: z.number().default(1),
        limit: z.number().default(10),
      })
    )
    .query(async ({ input, ctx }) => {
      const response = await apiClient.get("/activities", {
        params: input,
        headers: {
          Authorization: `Bearer ${ctx.token}`,
        },
      });
      return response.data as ActivitiesResponse;
    }),

  // Get activities for a specific organization
  getByOrganization: protectedProcedure
    .input(
      z.object({
        organizationId: z.string(),
        page: z.number().default(1),
        limit: z.number().default(10),
      })
    )
    .query(async ({ input, ctx }) => {
      const { organizationId, ...params } = input;
      const response = await apiClient.get(
        `/activities/organization/${organizationId}`,
        {
          params,
          headers: {
            Authorization: `Bearer ${ctx.token}`,
          },
        }
      );
      return response.data as ActivitiesResponse;
    }),

  // Get a single activity by ID
  getById: protectedProcedure
    .input(z.object({ activityId: z.string() }))
    .query(async ({ input, ctx }) => {
      const response = await apiClient.get(`/activities/${input.activityId}`, {
        headers: {
          Authorization: `Bearer ${ctx.token}`,
        },
      });
      return response.data as Activity;
    }),

  // Create a new activity
  create: protectedProcedure
    .input(
      z.object({
        organizationId: z.string(),
        title: z.string().min(1),
        starts_at: z.string(),
        ends_at: z.string(),
        location: z.string(),
        description: z.string(),
        nonUserAttendees: z.array(z.string()).optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const response = await apiClient.post("/activities", input, {
        headers: {
          Authorization: `Bearer ${ctx.token}`,
        },
      });
      return response.data as Activity;
    }),

  // Update an activity
  update: protectedProcedure
    .input(
      z.object({
        activityId: z.string(),
        data: z.object({
          title: z.string().min(1).optional(),
          starts_at: z.string().optional(),
          ends_at: z.string().optional(),
          location: z.string().optional(),
          description: z.string().optional(),
          nonUserAttendees: z.array(z.string()).optional(),
        }),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const response = await apiClient.patch(
        `/activities/${input.activityId}`,
        input.data,
        {
          headers: {
            Authorization: `Bearer ${ctx.token}`,
          },
        }
      );
      return response.data as Activity;
    }),

  // Delete an activity
  delete: protectedProcedure
    .input(z.object({ activityId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const response = await apiClient.delete(
        `/activities/${input.activityId}`,
        {
          headers: {
            Authorization: `Bearer ${ctx.token}`,
          },
        }
      );
      return response.data as { message: string };
    }),

  // Get current user's activities
  getMyActivities: protectedProcedure
    .input(
      z.object({
        page: z.number().default(1),
        limit: z.number().default(100),
        startDate: z.string().optional(),
        endDate: z.string().optional(),
      })
    )
    .query(async ({ input, ctx }) => {
      const response = await apiClient.get("/activities/my", {
        params: input,
        headers: {
          Authorization: `Bearer ${ctx.token}`,
        },
      });
      return response.data as ActivitiesResponse;
    }),

  // Join an activity
  joinActivity: protectedProcedure
    .input(z.object({ activityId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const response = await apiClient.post(
        `/activities/${input.activityId}/join`,
        {},
        {
          headers: {
            Authorization: `Bearer ${ctx.token}`,
          },
        }
      );
      return response.data as { message: string };
    }),

  // Leave an activity
  leaveActivity: protectedProcedure
    .input(z.object({ activityId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const response = await apiClient.delete(
        `/activities/${input.activityId}/leave`,
        {
          headers: {
            Authorization: `Bearer ${ctx.token}`,
          },
        }
      );
      return response.data as { message: string };
    }),

  // Get activity attendees
  getActivityAttendees: protectedProcedure
    .input(z.object({ activityId: z.string() }))
    .query(async ({ input, ctx }) => {
      const response = await apiClient.get(
        `/activities/${input.activityId}/attendees`,
        {
          headers: {
            Authorization: `Bearer ${ctx.token}`,
          },
        }
      );
      return response.data as Array<{
        id: string;
        email: string;
        createdAt: string;
      }>;
    }),
});

export default activitiesRouter;
