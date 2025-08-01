"use server";

import prisma from "@/lib/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { TicketSchema, TInsertTicketSchema } from "@/zod-schemas/ticket";
import { Prisma } from "@prisma/client";

export const TicketAction = async (data: TInsertTicketSchema) => {
  // Validate input data using Zod schema
  const result = TicketSchema.safeParse(data);

  if (!result.success) {
    const fieldErrors: Record<string, string> = {};

    result.error.issues.forEach((issue) => {
      const field = issue.path[0]?.toString() || "form";
      if (!fieldErrors[field]) {
        fieldErrors[field] = issue.message;
      }
    });

    return {
      status: 400,
      message: "Validation failed",
      error: fieldErrors,
    };
  }

  const ticket = result.data;

  // Check if user is authenticated
  const { isAuthenticated } = getKindeServerSession();
  const isAuth = await isAuthenticated();

  if (!isAuth) {
    redirect("/login");
  }

  try {
    if (ticket.id === "(New)") {
      // Create New Ticket
      const newTicket = await prisma.ticket.create({
        data: {
          customerId: ticket.customerId,
          title: ticket.title,
          description: ticket.description,
          tech: ticket.tech,
        },
      });

      revalidatePath("/tickets");

      return {
        status: 201,
        message: `Ticket ID #${newTicket.id} created successfully`,
      };
    } else {
      // Updated Ticket By Id
      const updatedTicket = await prisma.ticket.update({
        where: { id: ticket.id },
        data: {
          customerId: ticket.customerId,
          title: ticket.title,
          description: ticket.description,
          tech: ticket.tech,
          completed: ticket.completed,
        },
      });

      revalidatePath("/tickets");
      revalidatePath(`/tickets/form?ticketId=${updatedTicket.id}`);

      return {
        status: 200,
        message: `Ticket ID #${updatedTicket.id} updated successfully`,
      };
    }
  } catch (error) {
    console.error("Error saving ticket:", error);

    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      const targets = error.meta?.target as string[];

      const errorObject = Object.fromEntries(
        targets.map((field) => [field, `${field} is already in use.`])
      );

      return {
        status: 400,
        message: "Some fields must be unique.",
        error: errorObject,
      };
    }

    return {
      status: 500,
      message: "Internal server error while saving ticket",
    };
  }
};
