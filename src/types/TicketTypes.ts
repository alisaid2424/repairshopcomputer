/* export type TicketWithCustomer = {
  id: number;
  ticketDate: Date;
  title: string;
  tech: string;
  completed: boolean;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
};
 */

import { Ticket } from "@prisma/client";

export type TicketWithCustomer = Omit<Ticket, "createdAt"> & {
  ticketDate: Date;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
};
