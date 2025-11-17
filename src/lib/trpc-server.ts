import { appRouter, type AppRouter } from "@/server/routers/_app";
import { createCallerFactory } from "@/server/trpc";

/**
 * Server-side tRPC client for use in Server Components and Server Actions
 */
export const serverTrpc = createCallerFactory(appRouter);

export type { AppRouter };
