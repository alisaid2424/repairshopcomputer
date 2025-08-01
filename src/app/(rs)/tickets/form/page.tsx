import LottieHandler from "@/lib/LottieHandler";
import { getCustomer } from "@/server/db/customers";
import { getTicket } from "@/server/db/tickets";
import TicketForm from "./TicketForm";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { Users, init as kindeInit } from "@kinde/management-api-js";
import { BackButton } from "@/components/BackButton";
import { notFound } from "next/navigation";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const { customerId, ticketId } = await searchParams;

  if (!customerId && !ticketId)
    return {
      title: "Missing Ticket ID or Customer ID",
    };

  if (customerId)
    return {
      title: `New Ticket for Customer #${customerId}`,
    };

  if (ticketId)
    return {
      title: `Edit Ticket #${ticketId}`,
    };
}

const TicketFormPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) => {
  try {
    const { customerId, ticketId } = await searchParams;

    if (!customerId && !ticketId) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)]">
          <LottieHandler
            type="error"
            message="Ticket ID or Customer ID required to load ticket form"
          />
          <BackButton
            title="Go Back"
            variant="default"
            className="rounded-full my-7"
          />
        </div>
      );
    }

    const { getPermission, getUser } = getKindeServerSession();
    const [managerPermission, user] = await Promise.all([
      getPermission("manager"),
      getUser(),
    ]);
    const isManager = managerPermission?.isGranted;

    // New ticket form
    if (customerId) {
      const customer = await getCustomer(parseInt(customerId));

      if (!customer) notFound();

      if (!customer.active) {
        return (
          <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)]">
            <LottieHandler
              type="error"
              message={` Customer ID #${customerId} is Not Active.`}
            />

            <BackButton
              title="Go Back"
              variant="default"
              className="rounded-full my-7"
            />
          </div>
        );
      }

      // return ticket form
      if (isManager) {
        kindeInit(); // Initializes the Kinde Management API
        const { users } = await Users.getUsers();

        const techs = users
          ? users.map((user) => ({ id: user.email!, description: user.email! }))
          : [];

        return (
          <TicketForm customer={customer} techs={techs} isManager={isManager} />
        );
      } else {
        return <TicketForm customer={customer} />;
      }
    }

    // Edit ticket form
    if (ticketId) {
      const ticket = await getTicket(parseInt(ticketId));

      if (!ticket) notFound();

      const customer = await getCustomer(ticket.customerId);

      // return ticket form
      if (isManager) {
        kindeInit(); // Initializes the Kinde Management API
        const { users } = await Users.getUsers();

        const techs = users
          ? users
              .filter(
                (user): user is { email: string } =>
                  typeof user.email === "string"
              )
              .map((user) => ({
                id: user.email?.toLowerCase(),
                description: user.email?.toLowerCase(),
              }))
          : [];

        return (
          <TicketForm
            customer={customer!}
            ticket={ticket}
            techs={techs}
            isManager={isManager}
          />
        );
      } else {
        const isEditable =
          user?.email?.toLowerCase() === ticket.tech.toLowerCase();

        return (
          <TicketForm
            customer={customer!}
            ticket={ticket}
            isEditable={isEditable}
          />
        );
      }
    }
  } catch (e) {
    if (e instanceof Error) {
      throw e;
    }
  }
};

export default TicketFormPage;
