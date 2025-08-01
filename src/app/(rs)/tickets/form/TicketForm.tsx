"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";

import { InputWithLabel } from "@/components/inputs/InputWithLabel";
import { SelectWithLabel } from "@/components/inputs/SelectWithLabel";
import { TextAreaWithLabel } from "@/components/inputs/TextAreaWithLabel";
import { CheckboxWithLabel } from "@/components/inputs/CheckboxWithLabel";

import { Customer, Ticket } from "@prisma/client";
import { LoaderCircle } from "lucide-react";
import { useState } from "react";
import { TicketSchema, TInsertTicketSchema } from "@/zod-schemas/ticket";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { TicketAction } from "@/server/actions/ticket";

type Props = {
  customer: Customer;
  ticket?: Ticket;
  techs?: {
    id: string;
    description: string;
  }[];
  isEditable?: boolean;
  isManager?: boolean | undefined;
};

const TicketForm = ({
  customer,
  ticket,
  techs,
  isEditable = true,
  isManager = false,
}: Props) => {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const defaultValues: TInsertTicketSchema = {
    id: ticket?.id ?? "(New)",
    customerId: ticket?.customerId ?? customer.id,
    title: ticket?.title ?? "",
    description: ticket?.description ?? "",
    completed: ticket?.completed ?? false,
    tech: ticket?.tech.toLowerCase() ?? "new-ticket@example.com",
  };

  const form = useForm<TInsertTicketSchema>({
    mode: "onBlur",
    resolver: zodResolver(TicketSchema),
    defaultValues,
  });

  const submitForm = async (data: TInsertTicketSchema) => {
    if (isLoading) return;
    try {
      setIsLoading(true);

      const res = await TicketAction(data);
      if (res.status && res.message) {
        if (res.status === 200 || res.status === 201) {
          toast({
            title: "Success! 🎉",
            description: res.message,
            className: "bg-green-500 text-white",
          });

          router.push("/tickets");
        } else if (res.status === 400 && res.error) {
          // The next teacher from the server on the repair
          Object.entries(res.error).forEach(([field, message]) => {
            form.setError(field as keyof TInsertTicketSchema, {
              type: "server",
              message,
            });
          });

          toast({
            variant: "destructive",
            title: "Form Errors",
            description: "Please fix the highlighted fields.",
          });
        } else {
          toast({
            variant: "destructive",
            title: "Error",
            description: res.message,
          });
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col sm:px-8 mb-14">
      <div>
        <h2 className="text-2xl font-bold italic my-8 text-center">
          {ticket?.id && isEditable
            ? `Edit Ticket # ${ticket.id}`
            : ticket?.id
            ? `View Ticket # ${ticket.id}`
            : "New Ticket Form"}
        </h2>
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(submitForm)}
          className="flex flex-col md:flex-row gap-4 md:gap-8 items-center md:items-start justify-center"
        >
          <div className="flex flex-col gap-4 w-full max-w-md">
            <InputWithLabel<TInsertTicketSchema>
              fieldTitle="Title"
              nameInSchema="title"
              disabled={!isEditable}
            />

            {isManager && techs ? (
              <SelectWithLabel<TInsertTicketSchema>
                fieldTitle="Tech ID"
                nameInSchema="tech"
                data={[
                  {
                    id: "new-ticket@example.com",
                    description: "new-ticket@example.com",
                  },
                  ...techs,
                ]}
              />
            ) : (
              <InputWithLabel<TInsertTicketSchema>
                fieldTitle="Tech"
                nameInSchema="tech"
                disabled={true}
              />
            )}

            {ticket?.id ? (
              <CheckboxWithLabel<TInsertTicketSchema>
                fieldTitle="Completed"
                nameInSchema="completed"
                message="Yes"
                disabled={!isEditable}
              />
            ) : null}

            <div className="mt-4 space-y-2">
              <h3 className="text-lg">Customer Info</h3>
              <hr className="w-full" />
              <p>
                {customer.firstName} {customer.lastName}
              </p>
              <p>{customer.address1}</p>
              {customer.address2 ? <p>{customer.address2}</p> : null}
              <p>
                {customer.city}, {customer.state} {customer.zip}
              </p>
              <hr className="w-full" />
              <p>{customer.email}</p>
              <p>Phone: {customer.phone}</p>
            </div>
          </div>

          <div className="flex flex-col gap-4 w-full max-w-md">
            <TextAreaWithLabel<TInsertTicketSchema>
              fieldTitle="Description"
              nameInSchema="description"
              className="h-96"
              disabled={!isEditable}
            />

            {isEditable ? (
              <div className="flex gap-2">
                <Button
                  type="submit"
                  className="w-3/4"
                  variant="default"
                  title="Save"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <LoaderCircle className="animate-spin" /> Saving
                    </>
                  ) : (
                    "Save"
                  )}
                </Button>

                <Button
                  type="button"
                  variant="destructive"
                  className="w-1/4"
                  title="Reset"
                  onClick={() => {
                    form.reset(defaultValues);
                  }}
                >
                  Reset
                </Button>
              </div>
            ) : null}
          </div>
        </form>
      </Form>
    </div>
  );
};

export default TicketForm;
