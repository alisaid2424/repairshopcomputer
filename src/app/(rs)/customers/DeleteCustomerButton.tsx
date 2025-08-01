"use client";

import { useToast } from "@/hooks/use-toast";
import { deleteCustomer } from "@/server/actions/customer";

interface DeleteCustomerButtonProps {
  customerId: number;
}
const DeleteCustomerButton = ({ customerId }: DeleteCustomerButtonProps) => {
  const { toast } = useToast();

  const handleDelete = async () => {
    try {
      if (
        confirm(
          `Are you sure you want to delete this Customer id # ${customerId}?`
        )
      ) {
        const res = await deleteCustomer(customerId);

        if (res.status && res.message) {
          if (res.status === 200) {
            toast({
              title: "Success! 🎉",
              description: res.message,
              className: "bg-green-500 text-white",
            });
          } else {
            toast({
              variant: "destructive",
              title: "Error",
              description: res.message,
            });
          }
        } else {
          toast({
            variant: "destructive",
            title: "Error",
            description: "Unexpected response from server.",
          });
        }
      }
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "An error occurred while deleting the customer.",
      });
    }
  };

  return (
    <div
      onClick={handleDelete}
      className="font-bold w-full text-red-600 cursor-pointer"
    >
      Delete
    </div>
  );
};

export default DeleteCustomerButton;
