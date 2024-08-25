import { useQuery } from "@tanstack/react-query";
import client from "../axios/client";
import { InvoiceSchema, InvoiceType } from "../schemas/invoice.schema";
import { isAxiosError } from "axios";

export const fetchInvoiceDetails = async (invoiceId: number) => {
  const response = await client.get(`/invoices/${invoiceId}`);
  const parsedData = InvoiceSchema.safeParse(response.data);

  if (!parsedData.success) {
    throw new Error("Invalid data structure");
  }

  return parsedData.data;
};

export const useInvoiceDetails = (invoiceId: number) => {
  return useQuery<InvoiceType>({
    queryKey: ["invoiceDetails", invoiceId],
    queryFn: () => fetchInvoiceDetails(invoiceId),
    enabled: !!invoiceId,
    retry: (count, error) =>
      isAxiosError(error) ? error.response?.status !== 401 : count < 3,
  });
};
