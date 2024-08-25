import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import InvoiceDetail from "../../components/InvoiceDetails";
import { useInvoices } from "../../hooks/useInvoices";
import { InvoiceType } from "../../schemas/invoice.schema";
import { isAxiosError } from "axios";

export const Invoices = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const { data, isLoading, isError, error } = useInvoices(page, limit);
  const [selectedInvoice, setSelectedInvoice] = useState<
    InvoiceType["id"] | null
  >(null);

  const navigate = useNavigate();

  useEffect(() => {
    if (isError && isAxiosError(error))
      if (error.response?.status === 401) navigate("/");
  }, [error, isError, navigate]);

  useEffect(() => {
    if (!data) return;

    const pageParam = parseInt(searchParams.get("page") || "1", 10);
    const limitParam = parseInt(searchParams.get("limit") || "10", 10);

    const validLimit = Math.min(limitParam, data.total);
    const validPage = Math.min(pageParam, data.pages);

    setPage(validPage);
    setLimit(validLimit);
    setSearchParams({ page: String(validPage), limit: String(validLimit) });
  }, [searchParams, data, setSearchParams]);

  const handlePreviousPage = () => {
    if (page > 1) {
      setSearchParams({
        page: String(page - 1),
        limit: String(limit),
      });
    }
  };

  const handleNextPage = () => {
    if (data && page < data.pages) {
      setSearchParams({
        page: String(page + 1),
        limit: String(limit),
      });
    }
  };

  if (isLoading) {
    return <div>Loading invoices...</div>;
  }

  if (isError) {
    return <div>Error loading invoices: {(error as Error).message}</div>;
  }

  return (
    <div className="container mx-auto p-4 overflow-hidden">
      <h1 className="text-2xl font-bold mb-4">Invoices</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg">
          <thead className="bg-blue-100">
            <tr>
              <th className="px-4 py-2 border-b rounded-tl-lg text-left">
                Date
              </th>
              <th className="px-4 py-2 border-b text-left">Payee</th>
              <th className="px-4 py-2 border-b text-left">Description</th>
              <th className="px-4 py-2 border-b text-left">Due Date</th>
              <th className="px-4 py-2 border-b text-right">Amount</th>
              <th className="px-4 py-2 border-b text-left">Status</th>
              <th className="px-4 py-2 border-b rounded-tr-lg text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {(data?.invoices || []).map((invoice) => (
              <tr key={invoice.id}>
                <td className="px-4 py-2 border-b text-left">
                  {new Date(invoice.due_date).toLocaleDateString()}
                </td>
                <td className="px-4 py-2 border-b text-left">
                  {invoice.vendor_name}
                </td>
                <td className="px-4 py-2 border-b text-left">
                  {invoice.description}
                </td>
                <td className="px-4 py-2 border-b text-left">
                  {new Date(invoice.due_date).toLocaleDateString()}
                </td>
                <td className="px-4 py-2 border-b text-right font-semibold whitespace-nowrap">{`$ ${invoice.amount.toFixed(
                  2
                )}`}</td>
                <td className="px-4 py-2 border-b text-left">
                  {invoice.paid ? (
                    <span className="text-green-600">Paid</span>
                  ) : (
                    <span className="text-red-600">Open</span>
                  )}
                </td>
                <td className="px-4 py-2 border-b text-right">
                  <button
                    onClick={() => setSelectedInvoice(invoice.id)}
                    className="bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-700"
                  >
                    Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center mt-4 sticky bottom-0 bg-white py-2">
        <button
          onClick={handlePreviousPage}
          disabled={page === 1}
          className="bg-gray-300 text-gray-800 py-1 px-3 rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span>
          Page {page} of {data?.pages}
        </span>
        <button
          onClick={handleNextPage}
          disabled={page === data?.pages}
          className="bg-gray-300 text-gray-800 py-1 px-3 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>

      {selectedInvoice && (
        <InvoiceDetail
          invoiceId={selectedInvoice}
          onClose={() => setSelectedInvoice(null)}
        />
      )}
    </div>
  );
};

export default Invoices;
