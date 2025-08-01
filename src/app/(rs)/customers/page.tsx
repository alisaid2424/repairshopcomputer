import { getCustomers, getCustomerSearchResults } from "@/server/db/customers";
import CustomerSearch from "./CustomerSearch";
import CustomerTable from "./CustomerTable";
import { Customer } from "@prisma/client";
import LottieHandler from "@/lib/LottieHandler";
import { BackButton } from "@/components/BackButton";

export const metadata = {
  title: "Customer Search",
};

const CustomersPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) => {
  const { searchText } = await searchParams;

  if (!searchText) {
    const results = await getCustomers();

    return (
      <>
        {results.length ? (
          <>
            <CustomerSearch />
            <CustomerTable data={results} />
          </>
        ) : (
          <div className="flex flex-col gap-5 items-center justify-center min-h-[calc(100vh-120px)]">
            <LottieHandler type="empty" message="Not Customers Found" />

            <BackButton title="Go Back" variant="default" />
          </div>
        )}
      </>
    );
  }

  const results = (await getCustomerSearchResults(searchText)) as Customer[];

  return (
    <>
      <CustomerSearch />

      {results.length ? (
        <CustomerTable data={results} />
      ) : (
        <div className="flex items-center justify-center min-h-[calc(100vh-150px)]">
          <LottieHandler type="empty" message="Not results Found" />
        </div>
      )}
    </>
  );
};

export default CustomersPage;
