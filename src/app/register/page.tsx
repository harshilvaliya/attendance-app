// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";

// export default function RegisterPage() {
//   const router = useRouter();
//   const [username, setUsername] = useState("");
//   const [phoneNumber, setPhoneNumber] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError("");
//     setLoading(true);

//     if (password !== confirmPassword) {
//       setError("Passwords do not match");
//       setLoading(false);
//       return;
//     }

//     try {
//       const res = await fetch(
//         `${process.env.NEXT_PUBLIC_API_URL}/user/register`,
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             username,
//             phoneNumber,
//             email,
//             password,
//             confirm_password: confirmPassword,
//           }),
//         }
//       );

//       const data = await res.json();

//       if (!res.ok) {
//         setError(data.message || "Registration failed");
//         return;
//       }

//       alert("Registration successful!");
//       router.push("/login");
//     } catch (err) {
//       console.error("Error during registration:", err);
//       setError("Something went wrong");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-background">
//       <div className="w-full max-w-md space-y-8 p-8">
//         <div className="text-center">
//           <h1 className="text-3xl font-bold tracking-tight">Create Account</h1>
//           <p className="text-muted-foreground mt-2">
//             Register to start managing your attendance
//           </p>
//         </div>
//         <form className="space-y-6" onSubmit={handleSubmit}>
//           <div className="space-y-4">
//             <div>
//               <label htmlFor="username" className="text-sm font-medium">
//                 Username
//               </label>
//               <input
//                 id="username"
//                 type="text"
//                 required
//                 className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
//                 placeholder="Enter your username"
//                 value={username}
//                 onChange={(e) => setUsername(e.target.value)}
//               />
//             </div>
//             <div>
//               <label htmlFor="phoneNumber" className="text-sm font-medium">
//                 Phone Number
//               </label>
//               <input
//                 id="phoneNumber"
//                 type="tel"
//                 required
//                 className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
//                 placeholder="Enter your phone number"
//                 value={phoneNumber}
//                 onChange={(e) => setPhoneNumber(e.target.value)}
//               />
//             </div>
//             <div>
//               <label htmlFor="email" className="text-sm font-medium">
//                 Email
//               </label>
//               <input
//                 id="email"
//                 type="email"
//                 required
//                 className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
//                 placeholder="Enter your email"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//               />
//             </div>
//             <div>
//               <label htmlFor="password" className="text-sm font-medium">
//                 Password
//               </label>
//               <input
//                 id="password"
//                 type="password"
//                 required
//                 className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
//                 placeholder="Enter your password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//               />
//             </div>
//             <div>
//               <label htmlFor="confirmPassword" className="text-sm font-medium">
//                 Confirm Password
//               </label>
//               <input
//                 id="confirmPassword"
//                 type="password"
//                 required
//                 className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
//                 placeholder="Confirm your password"
//                 value={confirmPassword}
//                 onChange={(e) => setConfirmPassword(e.target.value)}
//               />
//             </div>
//           </div>

//           {error && <p className="text-red-500 text-sm text-center">{error}</p>}

//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
//           >
//             {loading ? "Creating account..." : "Create Account"}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    username: "",
    phoneNumber: "",
    email: "",
    password: "",
    confirmPassword: "",
    selfie: null as File | null,
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;
    if (name === "selfie" && files) {
      setForm((f) => ({ ...f, selfie: files[0] }));
    } else {
      setForm((f) => ({ ...f, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }
    if (!form.selfie) {
      setError("Please upload a selfie");
      setLoading(false);
      return;
    }

    try {
      const data = new FormData();
      data.append("username", form.username);
      data.append("phoneNumber", form.phoneNumber);
      data.append("email", form.email);
      data.append("password", form.password);
      data.append("confirm_password", form.confirmPassword);
      data.append("selfie", form.selfie);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/user/register`,
        {
          method: "POST",
          body: data, // automatically sets multipart/form-data
        }
      );

      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.message || "Registration failed");
      }

      alert("Registration successful!");
      router.push("/login");
    } catch (err: any) {
      console.error("Error during registration:", err);
      setError(err.message || "Something went wrong");
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
                className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                placeholder="Enter your username"
                value={form.username}
                onChange={handleChange}
              />
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
                className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                placeholder="Enter your phone number"
                value={form.phoneNumber}
                onChange={handleChange}
              />
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
                className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                placeholder="Enter your email"
                value={form.email}
                onChange={handleChange}
              />
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
                className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                placeholder="Enter your password"
                value={form.password}
                onChange={handleChange}
              />
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
                className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                placeholder="Confirm your password"
                value={form.confirmPassword}
                onChange={handleChange}
              />
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
                onChange={handleChange}
                className="mt-1 block w-full"
              />
            </div>
          </div>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
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
