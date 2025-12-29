"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { loginUser } from "@/service/login";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Login() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const res = await loginUser(data);

      if (res?.data?.company?.id === "2" || res?.data?.company?.id === "14") {
        const { token } = res.data;

        localStorage.setItem("token", token);
        localStorage.setItem("img", res.data.company.logo);
        localStorage.setItem("contact_person", res.data.company.contact_person);
        localStorage.setItem("email", res.data.company.email);

        router.push("/admin/dashboard");
      } else {
        toast.error("Login failed: invalid id / password");
      }
    } catch (error) {
      toast.error("Login failed: invalid id / password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-full overflow-hidden font-poppins">
      {/* ❌ FIXED: removed leading space before grid */}
      <div className="grid grid-cols-1 md:grid-cols-[35%_65%] items-start h-screen">
        
        {/* LEFT SIDE */}
        <div className="w-full h-full flex flex-col gap-y-10 justify-between px-6 sm:px-10 md:px-20 pt-14 pb-4 bg-gray-50">
          <div>
            <img src="/logo.svg" alt="Logo" className="h-6" />
          </div>

          <div className="flex flex-col gap-y-10">
            <div className="flex flex-col gap-y-5">
              <p className="text-black text-xl sm:text-2xl font-semibold">
                Welcome back,
              </p>
              <p className="text-neutral-600 text-sm w-60">
                We are glad to see you again! Please, enter your details
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
              <div className="flex flex-col gap-y-6">
                
                {/* USERNAME */}
                <div className="relative">
                  <label className="block bg-gray-50 text-xs font-medium text-gray-700 absolute px-1 z-10 left-5 -top-1">
                    Username <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    {...register("username", { required: "Username is required" })}
                    className="mt-1 text-black text-sm w-full px-4 py-3 border border-neutral-500 rounded-xl focus:outline-none"
                    placeholder="Enter username"
                  />
                  {errors.username && (
                    <p className="text-red-500 text-sm">
                      {errors.username.message}
                    </p>
                  )}
                </div>

                {/* PASSWORD */}
                <div className="relative">
                  <label className="block bg-gray-50 text-xs font-medium text-gray-700 px-1 absolute z-10 left-5 -top-1">
                    Password <span className="text-red-500">*</span>
                  </label>
                  <input
                    type={showPassword ? "text" : "password"}
                    {...register("password", {
                      required: "Password is required",
                      minLength: { value: 6, message: "Min 6 characters" },
                    })}
                    className="mt-1 text-black text-sm w-full px-4 py-3 border border-neutral-500 rounded-xl focus:outline-none"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute top-1/2 right-4 -translate-y-1/2 text-gray-600"
                  >
                    {showPassword ? "🙈" : "👁️"}
                  </button>
                  {errors.password && (
                    <p className="text-red-500 text-sm">
                      {errors.password.message}
                    </p>
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-black text-white py-2 rounded-lg border hover:bg-white hover:text-black transition disabled:opacity-50"
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            </form>

            <p className="mt-4 text-center text-xs text-neutral-600">
              By continuing, you agree to Teqbae’s{" "}
              <span className="text-black">Terms & Privacy Policy</span>
            </p>
          </div>

          <p className="text-neutral-600 text-xs text-center">
            Powered by Teqbae Innovations and Solutions India Pvt Ltd
          </p>
        </div>

        {/* RIGHT SIDE */}
        <div className="hidden md:block h-screen w-full">
          <img
            src="/login-img.svg"
            alt="Login Illustration"
            className="h-full w-full object-cover"
          />
        </div>
      </div>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}

export default Login;
