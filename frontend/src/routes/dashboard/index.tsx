import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import client from "../../axios/client";
import { setAuthenticated } from "../../redux/auth";
import { LoginSchema, LoginSchemaType } from "../../schemas/login.schema";
import { useState } from "react";

export const Dashboard = () => {
  const { register, handleSubmit } = useForm<LoginSchemaType>({
    resolver: zodResolver(LoginSchema),
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (data: LoginSchemaType) => {
    try {
      const response = await client.post("/auth/login", data);

      dispatch(setAuthenticated(response.data));
      navigate("/invoices");
    } catch (error) {
      setError("Login failed. Please check your credentials and try again.");
      console.error("Login failed", error);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen relative">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="p-8 bg-white shadow-md rounded"
      >
        <div className="mb-4">
          <label className="block text-gray-700">Email</label>
          <input
            type="email"
            {...register("email")}
            className="mt-2 p-2 w-full border rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Password</label>
          <input
            type="password"
            {...register("password")}
            className="mt-2 p-2 w-full border rounded"
          />
        </div>
        <button
          type="submit"
          className="w-full p-2 bg-blue-500 text-white rounded"
        >
          Login
        </button>
      </form>

      {error && (
        <div className="absolute top-0 left-0 right-0 p-4 bg-red-500 text-white text-center">
          {error}
          <button
            className="ml-4 text-white underline"
            onClick={() => setError(null)}
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
