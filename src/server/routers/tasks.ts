import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { apiClient } from "@/lib/api-client";
import { Task, TasksResponse } from "@/types";

export const tasksRouter = createTRPCRouter({
  // Get all tasks with pagination and filters
  getAll: protectedProcedure
    .input(
      z.object({
        page: z.number().default(1),
        limit: z.number().default(10),
        status: z
          .enum(["pending", "in_progress", "completed", "cancelled"])
          .optional(),
        organizationId: z.string().optional(),
      })
    )
    .query(async ({ input, ctx }) => {
      const response = await apiClient.get("/tasks", {
        params: input,
        headers: {
          Authorization: `Bearer ${ctx.token}`,
        },
      });
      return response.data as TasksResponse;
    }),

  // Get current user's tasks
  getMyTasks: protectedProcedure
    .input(
      z.object({
        page: z.number().default(1),
        limit: z.number().default(10),
        status: z
          .enum(["pending", "in_progress", "completed", "cancelled"])
          .optional(),
        organizationId: z.string().optional(),
      })
    )
    .query(async ({ input, ctx }) => {
      const response = await apiClient.get("/tasks/my", {
        params: input,
        headers: {
          Authorization: `Bearer ${ctx.token}`,
        },
      });
      return response.data as TasksResponse;
    }),

  // Get tasks for an organization
  getOrganizationTasks: protectedProcedure
    .input(
      z.object({
        organizationId: z.string(),
        page: z.number().default(1),
        limit: z.number().default(10),
        status: z
          .enum(["pending", "in_progress", "completed", "cancelled"])
          .optional(),
        userId: z.string().optional(),
      })
    )
    .query(async ({ input, ctx }) => {
      const { organizationId, ...params } = input;
      const response = await apiClient.get(
        `/organization/${organizationId}`,
        {
          params,
          headers: {
            Authorization: `Bearer ${ctx.token}`,
          },
        }
      );
      return response.data as TasksResponse;
    }),

  // Get a single task by ID
  getById: protectedProcedure
    .input(z.object({ taskId: z.string() }))
    .query(async ({ input, ctx }) => {
      const response = await apiClient.get(`/tasks/${input.taskId}`, {
        headers: {
          Authorization: `Bearer ${ctx.token}`,
        },
      });
      return response.data as Task;
    }),

  // Create a new task
  create: protectedProcedure
    .input(
      z.object({
        title: z.string().min(1),
        description: z.string().optional(),
        userId: z.string(),
        organizationId: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const response = await apiClient.post("/tasks", input, {
        headers: {
          Authorization: `Bearer ${ctx.token}`,
        },
      });
      return response.data as Task;
    }),

  // Update a task
  update: protectedProcedure
    .input(
      z.object({
        taskId: z.string(),
        data: z.object({
          title: z.string().min(1).optional(),
          description: z.string().optional(),
        }),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const response = await apiClient.patch(
        `/tasks/${input.taskId}`,
        input.data,
        {
          headers: {
            Authorization: `Bearer ${ctx.token}`,
          },
        }
      );
      return response.data as Task;
    }),

  // Update task status
  updateStatus: protectedProcedure
    .input(
      z.object({
        taskId: z.string(),
        status: z.enum(["pending", "in_progress", "completed", "cancelled"]),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const response = await apiClient.patch(
        `/tasks/${input.taskId}/status`,
        { status: input.status },
        {
          headers: {
            Authorization: `Bearer ${ctx.token}`,
          },
        }
      );
      return response.data as Task;
    }),

  // Delete a task
  delete: protectedProcedure
    .input(z.object({ taskId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const response = await apiClient.delete(`/tasks/${input.taskId}`, {
        headers: {
          Authorization: `Bearer ${ctx.token}`,
        },
      });
      return response.data as { message: string };
    }),
});

export default tasksRouter;
