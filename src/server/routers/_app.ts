/**
 * This file contains the root router of your tRPC-backend
 */
import { createCallerFactory, createTRPCRouter } from "../trpc";
import { accountsRouter } from "./accounts";
import { authRouter } from "./auth";
import { organizationsRouter } from "./organizations";
import { tasksRouter } from "./tasks";
import { activitiesRouter } from "./activities";
import { transactionsRouter } from "./transactions";

export const appRouter = createTRPCRouter({
  auth: authRouter,
  accounts: accountsRouter,
  organizations: organizationsRouter,
  tasks: tasksRouter,
  activities: activitiesRouter,
  transactions: transactionsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
