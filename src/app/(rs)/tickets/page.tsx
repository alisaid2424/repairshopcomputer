import { getOpenTickets, getTicketSearchResults } from "@/server/db/tickets";
import TicketSearch from "./TicketSearch";
import TicketTable from "./TicketTable";
import { TicketWithCustomer } from "@/types/TicketTypes";
import LottieHandler from "@/lib/LottieHandler";

export const metadata = {
  title: "Ticket Search",
};

const TicketsPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) => {
  const { searchText } = await searchParams;

  if (!searchText) {
    const results = (await getOpenTickets()) as TicketWithCustomer[];

    return results.length ? (
      <div className="flex flex-col gap-6 my-6">
        <TicketSearch />
        <TicketTable data={results} />
      </div>
    ) : (
      <div className="flex items-center justify-center min-h-[calc(100vh-120px)]">
        <LottieHandler type="empty" message="No open tickets found" />
      </div>
    );
  }

  const results = (await getTicketSearchResults(
    searchText
  )) as TicketWithCustomer[];

  return (
    <div className="flex flex-col gap-6 my-6">
      <TicketSearch />

      {results.length ? (
        <TicketTable data={results} />
      ) : (
        <div className="flex items-center justify-center min-h-[calc(100vh-225px)]">
          <LottieHandler type="empty" message="Not results Found" />
        </div>
      )}
    </div>
  );
};

export default TicketsPage;
