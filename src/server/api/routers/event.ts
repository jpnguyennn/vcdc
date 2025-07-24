import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { db } from "~/server/db";

export const eventRouter = createTRPCRouter({
  // Create a new event
  create: publicProcedure
    .input(
      z.object({
        name: z.string().min(1),
        date: z.string(), // ISO string
        time: z.string(),
        location: z.string(),
        pay: z.number(),
      }),
    )
    .mutation(async ({ input }) => {
      return db.event.create({
        data: {
          name: input.name,
          date: new Date(input.date),
          time: input.time,
          location: input.location,
          pay: input.pay,
        },
      });
    }),

  // List all events with registrations
  list: publicProcedure.query(async () => {
    return db.event.findMany({
      include: { registrations: true },
      orderBy: { date: "asc" },
    });
  }),

  // Register a member for an event
  register: publicProcedure
    .input(
      z.object({
        eventId: z.number(),
        memberName: z.string().min(1),
      }),
    )
    .mutation(async ({ input }) => {
      return db.registration.create({
        data: {
          eventId: input.eventId,
          memberName: input.memberName,
        },
      });
    }),

  // Remove a member from an event
  unregister: publicProcedure
    .input(
      z.object({
        eventId: z.number(),
        memberName: z.string().min(1),
      }),
    )
    .mutation(async ({ input }) => {
      return db.registration.delete({
        where: {
          memberName_eventId: {
            memberName: input.memberName,
            eventId: input.eventId,
          },
        },
      });
    }),

  // Delete an event (performance)
  delete: publicProcedure
    .input(z.object({ eventId: z.number() }))
    .mutation(async ({ input }) => {
      return db.event.delete({
        where: { id: input.eventId },
      });
    }),

  // Update an event (performance)
  update: publicProcedure
    .input(
      z.object({
        eventId: z.number(),
        name: z.string().min(1),
        date: z.string(), // ISO string
        time: z.string(),
        location: z.string(),
        pay: z.number(),
      }),
    )
    .mutation(async ({ input }) => {
      return db.event.update({
        where: { id: input.eventId },
        data: {
          name: input.name,
          date: new Date(input.date),
          time: input.time,
          location: input.location,
          pay: input.pay,
        },
      });
    }),
});
