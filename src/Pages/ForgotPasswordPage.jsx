import React, { useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { Link } from "react-router-dom";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
    //   const url = import.meta.env.VITE_API_URL + "/user/forgot-password";
      const url = import.meta.env.VITE_API_URL + "/api/user/ForgotPassword";

      const { data } = await axios.post(url, { email });
        console.log(data)
      if (data.status) {
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }

    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-[#172030]">
      <Toaster />
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white rounded-lg shadow-md p-8"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">
          Forgot Password
        </h2>

        <input
          type="email"
          placeholder="Enter your email"
          className="w-full border border-gray-300 rounded-lg p-2.5 mb-4"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <button
          type="submit"
          className="w-full bg-[#101828] hover:bg-[#101828] text-white font-medium rounded-lg px-5 py-2.5"
        >
          Send Reset Link
        </button>

        <p className="text-sm text-gray-500 mt-4 text-center">
          Remember your password?{" "}
          <Link to="/login" className="text-blue-600 hover:underline">
            Back to Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default ForgotPasswordPage;