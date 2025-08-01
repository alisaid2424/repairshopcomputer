"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";

import { InputWithLabel } from "@/components/inputs/InputWithLabel";
import { SelectWithLabel } from "@/components/inputs/SelectWithLabel";
import { TextAreaWithLabel } from "@/components/inputs/TextAreaWithLabel";
import { CheckboxWithLabel } from "@/components/inputs/CheckboxWithLabel";

import { StatesArray } from "@/constants/StatesArray";
import { LoaderCircle } from "lucide-react";
import { Customer } from "@prisma/client";
import { useState } from "react";
import { CustomerSchema, TCustomerFormData } from "@/zod-schemas/customer";
import { useToast } from "@/hooks/use-toast";
import { customerAction } from "@/server/actions/customer";
import { useRouter } from "next/navigation";

type Props = {
  customer?: Customer;
  isManager?: boolean | undefined;
};

const CustomerForm = ({ customer, isManager = false }: Props) => {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const defaultValues: TCustomerFormData = {
    id: customer?.id ?? 0,
    firstName: customer?.firstName ?? "",
    lastName: customer?.lastName ?? "",
    address1: customer?.address1 ?? "",
    address2: customer?.address2 ?? "",
    city: customer?.city ?? "",
    state: customer?.state ?? "",
    zip: customer?.zip ?? "",
    phone: customer?.phone ?? "",
    email: customer?.email ?? "",
    notes: customer?.notes ?? "",
    active: customer?.active ?? true,
  };

  const form = useForm<TCustomerFormData>({
    mode: "onBlur",
    resolver: zodResolver(CustomerSchema),
    defaultValues,
  });

  /*   const submitForm = async (data: TCustomerFormData) => {
    if (isLoading) return;
    try {
      setIsLoading(true);

      const res = await customerAction(data);
      if (res.status && res.message) {
        if (res.status === 200 || res.status === 201) {
          toast({
            title: "Success! 🎉",
            description: res.message,
            className: "bg-green-500 text-white",
          });

          router.push("/customers");
        } else {
          if (res.status === 400) {
          }
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
  }; */

  const submitForm = async (data: TCustomerFormData) => {
    if (isLoading) return;
    try {
      setIsLoading(true);

      const res = await customerAction(data);

      if (res.status && res.message) {
        if (res.status === 200 || res.status === 201) {
          toast({
            title: "Success! 🎉",
            description: res.message,
            className: "bg-green-500 text-white",
          });
          router.push("/customers");
        } else if (res.status === 400 && res.error) {
          // The next teacher from the server on the repair
          Object.entries(res.error).forEach(([field, message]) => {
            form.setError(field as keyof TCustomerFormData, {
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
          {customer?.id ? "Edit" : "New"}&nbsp; Customer &nbsp;
          {customer?.id ? `#${customer.id}` : "Form"}
        </h2>
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(submitForm)}
          className="flex flex-col md:flex-row gap-4 md:gap-8 items-center md:items-start justify-center"
        >
          <div className="flex flex-col gap-4 w-full max-w-md">
            <InputWithLabel<TCustomerFormData>
              fieldTitle="First Name"
              nameInSchema="firstName"
            />

            <InputWithLabel<TCustomerFormData>
              fieldTitle="Last Name"
              nameInSchema="lastName"
            />

            <InputWithLabel<TCustomerFormData>
              fieldTitle="Address 1"
              nameInSchema="address1"
            />

            <InputWithLabel<TCustomerFormData>
              fieldTitle="Address 2"
              nameInSchema="address2"
            />

            <InputWithLabel<TCustomerFormData>
              fieldTitle="City"
              nameInSchema="city"
            />

            <SelectWithLabel<TCustomerFormData>
              fieldTitle="State"
              nameInSchema="state"
              data={StatesArray}
            />
          </div>

          <div className="flex flex-col gap-4 w-full max-w-md">
            <InputWithLabel<TCustomerFormData>
              fieldTitle="Zip Code"
              nameInSchema="zip"
            />

            <InputWithLabel<TCustomerFormData>
              fieldTitle="Email"
              nameInSchema="email"
            />

            <InputWithLabel<TCustomerFormData>
              fieldTitle="Phone"
              nameInSchema="phone"
            />

            <TextAreaWithLabel<TCustomerFormData>
              fieldTitle="Notes"
              nameInSchema="notes"
              className="h-40"
            />

            {isManager && customer?.id ? (
              <CheckboxWithLabel<TCustomerFormData>
                fieldTitle="Active"
                nameInSchema="active"
                message="Yes"
              />
            ) : null}

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
                title="Reset"
                className="w-1/4"
                onClick={() => {
                  form.reset(defaultValues);
                }}
              >
                Reset
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default CustomerForm;
