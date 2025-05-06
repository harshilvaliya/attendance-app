"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useToast } from "@/components/ui/use-toast";

export default function RegisterPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [form, setForm] = useState({
    username: "",
    phoneNumber: "",
    email: "",
    password: "",
    confirmPassword: "",
    selfie: null as File | null,
  });
  const [errors, setErrors] = useState({
    username: "",
    phoneNumber: "",
    email: "",
    password: "",
    confirmPassword: "",
    selfie: "",
  });
  const [loading, setLoading] = useState(false);

  const validateField = (name: string, value: string) => {
    switch (name) {
      case "username":
        if (value.length < 3 || value.length > 30) {
          return "Username must be between 3 and 30 characters";
        }
        break;
      case "phoneNumber":
        if (!/^[0-9]{10}$/.test(value)) {
          return "Phone number must be 10 digits";
        }
        break;
      case "email":
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          return "Invalid email format";
        }
        break;
      case "password":
        if (
          !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
            value
          )
        ) {
          return "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character";
        }
        break;
      case "confirmPassword":
        if (value !== form.password) {
          return "Passwords do not match";
        }
        break;
    }
    return "";
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;
    if (name === "selfie" && files) {
      setForm((f) => ({ ...f, selfie: files[0] }));
      setErrors((e) => ({
        ...e,
        selfie: files[0] ? "" : "Please upload a selfie",
      }));
    } else {
      setForm((f) => ({ ...f, [name]: value }));
      setErrors((e) => ({ ...e, [name]: validateField(name, value) }));
      if (name === "password") {
        setErrors((e) => ({
          ...e,
          confirmPassword: form.confirmPassword
            ? validateField("confirmPassword", form.confirmPassword)
            : "",
        }));
      }
    }
  };

  const isFormValid = () => {
    return (
      !Object.values(errors).some((error) => error !== "") &&
      Object.entries(form).every(([key, value]) => {
        if (key === "selfie") return value !== null;
        return value !== "";
      })
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid()) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Please fix all errors before submitting",
      });
      return;
    }
    setLoading(true);

    try {
      const data = new FormData();
      data.append("username", form.username);
      data.append("phoneNumber", form.phoneNumber);
      data.append("email", form.email);
      data.append("password", form.password);
      data.append("confirm_password", form.confirmPassword);
      data.append("selfie", form.selfie!);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/user/register`,
        {
          method: "POST",
          body: data,
        }
      );

      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.message || "Registration failed");
      }

      toast({
        title: "Success",
        description: "Registration successful!",
      });
      router.push("/login");
    } catch (err: any) {
      console.error("Error during registration:", err);
      toast({
        variant: "destructive",
        title: "Error",
        description: err.message || "Something went wrong",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md space-y-8 p-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Create Account</h1>
          <p className="text-muted-foreground mt-2">
            Register to start managing your attendance
          </p>
        </div>
        <form
          className="space-y-6"
          onSubmit={handleSubmit}
          encType="multipart/form-data"
        >
          <div className="space-y-4">
            <div>
              <label htmlFor="username" className="text-sm font-medium">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                autoComplete="off"
                className={`mt-1 block w-full rounded-md border ${
                  errors.username ? "border-red-500" : "border-input"
                } bg-background px-3 py-2 text-sm`}
                placeholder="Enter your username"
                value={form.username}
                onChange={handleChange}
              />
              {errors.username && (
                <p className="text-red-500 text-xs mt-1">{errors.username}</p>
              )}
            </div>
            <div>
              <label htmlFor="phoneNumber" className="text-sm font-medium">
                Phone Number
              </label>
              <input
                id="phoneNumber"
                name="phoneNumber"
                type="tel"
                required
                autoComplete="off"
                className={`mt-1 block w-full rounded-md border ${
                  errors.phoneNumber ? "border-red-500" : "border-input"
                } bg-background px-3 py-2 text-sm`}
                placeholder="Enter your phone number"
                value={form.phoneNumber}
                onChange={handleChange}
              />
              {errors.phoneNumber && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.phoneNumber}
                </p>
              )}
            </div>
            <div>
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="off"
                className={`mt-1 block w-full rounded-md border ${
                  errors.email ? "border-red-500" : "border-input"
                } bg-background px-3 py-2 text-sm`}
                placeholder="Enter your email"
                value={form.email}
                onChange={handleChange}
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
              )}
            </div>
            <div>
              <label htmlFor="password" className="text-sm font-medium">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                autoComplete="off"
                className={`mt-1 block w-full rounded-md border ${
                  errors.password ? "border-red-500" : "border-input"
                } bg-background px-3 py-2 text-sm`}
                placeholder="Enter your password"
                value={form.password}
                onChange={handleChange}
              />
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password}</p>
              )}
            </div>
            <div>
              <label htmlFor="confirmPassword" className="text-sm font-medium">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                autoComplete="off"
                className={`mt-1 block w-full rounded-md border ${
                  errors.confirmPassword ? "border-red-500" : "border-input"
                } bg-background px-3 py-2 text-sm`}
                placeholder="Confirm your password"
                value={form.confirmPassword}
                onChange={handleChange}
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="selfie" className="text-sm font-medium">
                Upload Selfie
              </label>
              <input
                id="selfie"
                name="selfie"
                type="file"
                accept="image/*"
                required
                autoComplete="off"
                onChange={handleChange}
                className={`mt-1 block w-full ${
                  errors.selfie ? "text-red-500" : ""
                }`}
              />
              {errors.selfie && (
                <p className="text-red-500 text-xs mt-1">{errors.selfie}</p>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !isFormValid()}
            className={`w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground ${
              !isFormValid()
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-primary/90"
            }`}
          >
            {loading ? "Creating account..." : "Create Account"}
          </button>

          <div className="text-center text-sm">
            <p className="text-muted-foreground">
              Already have an account?{" "}
              <Link href="/login" className="text-primary hover:underline">
                Sign in here
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
