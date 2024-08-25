import { z } from "zod";

export const InvoiceSchema = z.object({
  id: z.number().int(),
  vendor_name: z.string(),
  amount: z.number(),
  due_date: z.string().transform((date) => new Date(date)),
  description: z.string(),
  paid: z.boolean(),
});

export type InvoiceType = z.infer<typeof InvoiceSchema>;

export const PaginatedInvoicesSchema = z.object({
  invoices: z.array(InvoiceSchema),
  total: z.number(),
  page: z.number(),
  limit: z.number(),
  pages: z.number(),
});

// TypeScript type for the paginated invoices response
export type PaginatedInvoicesSchemaType = z.infer<
  typeof PaginatedInvoicesSchema
>;
