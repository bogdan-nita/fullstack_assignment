import { isAxiosError } from "axios";
import { useInvoiceDetails } from "../hooks/useInvoiceDetails";
import { InvoiceType } from "../schemas/invoice.schema";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export interface Props {
  invoiceId: InvoiceType["id"];
  onClose: () => void;
}

export const InvoiceDetail = ({ invoiceId, onClose }: Props) => {
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();
  const {
    data: details,
    isLoading,
    isError,
    error,
  } = useInvoiceDetails(invoiceId);

  useEffect(() => {
    if (isError && isAxiosError(error))
      if (error.response?.status === 401) navigate("/");
  }, [error, isError, navigate]);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  if (isLoading) {
    return <div>Loading details...</div>;
  }

  if (isError) {
    return <div>Error loading invoice details: {(error as Error).message}</div>;
  }

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center z-50 bg-gray-900 bg-opacity-50 transition-opacity duration-300 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
      onClick={handleClose}
    >
      <div
        className={`bg-white rounded-lg shadow-lg p-8 max-w-lg w-full transform transition-transform duration-300 ${
          isVisible ? "scale-100" : "scale-95"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-semibold mb-4">Invoice Details</h2>
        <div className="mb-4">
          <strong>Date:</strong>{" "}
          {new Date(details!.due_date).toLocaleDateString()}
        </div>
        <div className="mb-4">
          <strong>Vendor:</strong> {details!.vendor_name}
        </div>
        <div className="mb-4">
          <strong>Description:</strong> {details!.description}
        </div>
        <div className="mb-4">
          <strong>Amount:</strong> {`$ ${details!.amount.toFixed(2)}`}
        </div>
        <div className="mb-6">
          <strong>Status:</strong>{" "}
          <span className={details!.paid ? "text-green-600" : "text-red-600"}>
            {details!.paid ? "Paid" : "Open"}
          </span>
        </div>
        <button
          onClick={handleClose}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default InvoiceDetail;
