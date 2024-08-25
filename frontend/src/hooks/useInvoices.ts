import { keepPreviousData, useQuery } from "@tanstack/react-query";
import {
  PaginatedInvoicesSchema,
  PaginatedInvoicesSchemaType,
} from "../schemas/invoice.schema";
import client from "../axios/client";
import { isAxiosError } from "axios";

const fetchInvoices = async (page: number, limit: number) => {
  const response = await client.get(`/invoices?page=${page}&limit=${limit}`);
  const parsedData = PaginatedInvoicesSchema.safeParse(response.data);

  if (!parsedData.success) {
    throw new Error("Invalid data structure");
  }
  return response.data;
};

export const useInvoices = (page: number, limit: number) => {
  return useQuery<PaginatedInvoicesSchemaType>({
    queryKey: ["invoices", page, limit],
    queryFn: () => fetchInvoices(page, limit),
    placeholderData: keepPreviousData,
    retry: (count, error) =>
      isAxiosError(error) ? error.response?.status !== 401 : count < 3,
  });
};
