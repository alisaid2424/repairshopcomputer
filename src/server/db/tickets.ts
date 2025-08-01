import { cache } from "@/lib/cache";
import prisma from "@/lib/db";

export const getTicket = cache(
  (ticketId: number) => {
    const ticket = prisma.ticket.findUnique({ where: { id: ticketId } });
    return ticket;
  },
  [`ticket-${crypto.randomUUID()}`],
  { revalidate: 3600 }
);

export const getTicketSearchResults = cache(
  async (searchText: string) => {
    const query = `%${searchText.toLowerCase().replace(/\s+/g, "%")}%`;

    const tickets = await prisma.$queryRaw`
      SELECT 
        t.id,
        t."createdAt" AS "ticketDate",
        t.title,
        t.tech,
        t.completed,
        c."firstName",
        c."lastName",
        c.email
      FROM "Ticket" t
      LEFT JOIN "Customer" c ON t."customerId" = c.id
      WHERE
        LOWER(t.title) LIKE ${query} OR
        LOWER(t.tech) LIKE ${query} OR
        LOWER(c.email) LIKE ${query} OR
        LOWER(c.phone) LIKE ${query} OR
        LOWER(c.city) LIKE ${query} OR
        LOWER(c.zip) LIKE ${query} OR
        LOWER(c."firstName" || ' ' || c."lastName") LIKE ${query}
      ORDER BY t."createdAt" ASC
    `;

    return tickets;
  },
  [`ticket-search-${crypto.randomUUID()}`],
  { revalidate: 3600 }
);

export const getOpenTickets = cache(
  async () => {
    const tickets = await prisma.ticket.findMany({
      where: {
        completed: false,
      },
      orderBy: {
        createdAt: "asc",
      },
      select: {
        id: true,
        createdAt: true, // alias for ticketDate
        title: true,
        tech: true,
        completed: true,
        customer: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    const formatted = tickets.map((t) => ({
      id: t.id,
      ticketDate: t.createdAt,
      title: t.title,
      tech: t.tech,
      completed: t.completed,
      firstName: t.customer?.firstName ?? null,
      lastName: t.customer?.lastName ?? null,
      email: t.customer?.email ?? null,
    }));

    return formatted;
  },
  ["open-tickets"],
  { revalidate: 3600 }
);
