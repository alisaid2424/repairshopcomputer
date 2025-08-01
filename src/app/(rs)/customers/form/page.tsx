import { getCustomer } from "@/server/db/customers";
import CustomerForm from "./CustomerForm";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { notFound } from "next/navigation";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const { customerId } = await searchParams;

  if (!customerId) return { title: "New Customer" };

  return { title: `Edit Customer #${customerId}` };
}

const CustomerFormPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) => {
  try {
    const { getPermission } = getKindeServerSession();
    const managerPermission = await getPermission("manager");
    const isManager = managerPermission?.isGranted;

    const { customerId } = await searchParams;

    // Edit customer form
    if (customerId) {
      const customer = await getCustomer(parseInt(customerId));

      if (!customer) notFound();

      // put customer form component
      return (
        <CustomerForm
          key={customerId}
          isManager={isManager}
          customer={customer}
        />
      );
    } else {
      // new customer form component
      return <CustomerForm key="new" isManager={isManager} />;
    }
  } catch (e) {
    if (e instanceof Error) {
      throw e;
    }
  }
};

export default CustomerFormPage;
