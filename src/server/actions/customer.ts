"use server";

import prisma from "@/lib/db";
import { CustomerSchema, TCustomerFormData } from "@/zod-schemas/customer";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// Create or update customer
export const customerAction = async (data: TCustomerFormData) => {
  // Validate input data using Zod schema
  const result = CustomerSchema.safeParse(data);

  if (!result.success) {
    const fieldErrors: Record<string, string> = {};

    result.error.issues.forEach((issue) => {
      const field = issue.path[0]?.toString() || "form";
      if (!fieldErrors[field]) {
        fieldErrors[field] = issue.message;
      }
    });

    return {
      status: 400,
      message: "Validation failed",
      error: fieldErrors,
    };
  }

  const customer = result.data;

  // Check if user is authenticated
  const { isAuthenticated } = getKindeServerSession();
  const isAuth = await isAuthenticated();

  if (!isAuth) {
    redirect("/login");
  }

  try {
    if (customer.id === 0) {
      // Create new customer
      const newCustomer = await prisma.customer.create({
        data: {
          firstName: customer.firstName,
          lastName: customer.lastName,
          email: customer.email,
          phone: customer.phone,
          address1: customer.address1,
          address2: customer.address2?.trim() || null,
          city: customer.city,
          state: customer.state,
          zip: customer.zip,
          notes: customer.notes?.trim() || null,
        },
      });

      revalidatePath("/customers");

      return {
        status: 201,
        message: `Customer created successfully (ID: ${newCustomer.id})`,
      };
    } else {
      // Update existing customer
      const updatedCustomer = await prisma.customer.update({
        where: { id: customer.id },
        data: {
          firstName: customer.firstName,
          lastName: customer.lastName,
          email: customer.email,
          phone: customer.phone,
          address1: customer.address1,
          address2: customer.address2?.trim() || null,
          city: customer.city,
          state: customer.state,
          zip: customer.zip,
          notes: customer.notes?.trim() || null,
          active: customer.active,
        },
      });

      revalidatePath("/customers");
      revalidatePath(`/customers/form?customerId=${updatedCustomer.id}`);

      return {
        status: 200,
        message: `Customer updated successfully (ID: ${updatedCustomer.id})`,
      };
    }
  } catch (error) {
    console.error(error);

    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      const targets = error.meta?.target as string[];

      const errorObject = Object.fromEntries(
        targets.map((field) => [field, `${field} is already in use.`])
      );

      return {
        status: 400,
        message: "Some fields must be unique.",
        error: errorObject,
      };
    }

    return {
      status: 500,
      message: "Internal server error while saving customer",
    };
  }
};

//delete Customer
export const deleteCustomer = async (id: number) => {
  try {
    await prisma.customer.delete({
      where: {
        id,
      },
    });

    revalidatePath("/customers");
    revalidatePath(`/customers/form?customerId=${id}`);

    return {
      status: 200,
      message: `deleted customer successfully (ID: ${id})`,
    };
  } catch (error) {
    console.error(error);
    return {
      status: 500,
      message: "internalServerError",
    };
  }
};
