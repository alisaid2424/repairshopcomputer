import { cache } from "@/lib/cache";
import prisma from "@/lib/db";

export const getCustomers = cache(
  async () => {
    const customers = await prisma.customer.findMany({
      orderBy: {
        lastName: "asc",
      },
    });

    return customers;
  },
  ["all-customers"],
  { revalidate: 3600 }
);

export const getCustomer = cache(
  (customerId: number) => {
    const customer = prisma.customer.findUnique({ where: { id: customerId } });
    return customer;
  },
  [`customer-${crypto.randomUUID()}`],
  { revalidate: 3600 }
);

export const getCustomerSearchResults = cache(
  async (searchText: string) => {
    const query = `%${searchText.toLowerCase().replace(/\s+/g, "%")}%`;

    const customers = await prisma.$queryRaw`
      SELECT * FROM "Customer"
      WHERE
        LOWER("email") LIKE ${query} OR
        LOWER("phone") LIKE ${query} OR
        LOWER("city") LIKE ${query} OR
        LOWER("zip") LIKE ${query} OR
        LOWER("firstName" || ' ' || "lastName") LIKE ${query}
      ORDER BY "lastName" ASC
    `;

    return customers;
  },
  [`customer-search-${crypto.randomUUID()}`],
  { revalidate: 3600 }
);
