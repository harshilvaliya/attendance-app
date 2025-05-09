"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LogOut, Mail, Phone, User, Building, Calendar, Camera } from "lucide-react";
import Image from "next/image";

interface UserProfile {
  name: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  selfieUrl: string;
  department: string;
  position: string;
  joinDate: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          router.push("/login");
          return;
        }
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/user/get-user`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch user profile");
        }
        setUser(data.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };
    fetchUserProfile();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-red-50 text-red-600 p-6 rounded-lg shadow-md max-w-md w-full">
          <h3 className="font-semibold mb-2">Error</h3>
          {error}
        </div>
      </div>
    );
  }
  if (!user) return null;

  const imageUrl = `${process.env.NEXT_PUBLIC_API_URL}/${user.selfieUrl.replace(/\\/g, '/')}`;
  // console.log("Image URL:", imageUrl);

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-4 sm:px-6 space-y-6 max-w-4xl">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">
              My Profile
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground mt-1">
              Manage your personal information and settings
            </p>
          </div>
          <Button
            variant="outline"
            className="mt-4 sm:mt-0 shadow-sm hover:shadow-md transition-all flex items-center"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-12">
          {/* Profile Card */}
          <Card className="shadow-md hover:shadow-lg transition-shadow md:col-span-4 bg-white border-0">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                {imageError ? (
                  <div className="h-32 w-32 rounded-full bg-gray-100 flex items-center justify-center border border-gray-200 shadow-sm mb-4">
                    <Camera className="h-12 w-12 text-gray-400" />
                  </div>
                ) : (
                  <Image
                    src={imageUrl}
                    alt="User Profile"
                    className="h-32 w-32 rounded-full object-cover border border-gray-200 shadow-sm mb-4"
                    height={128}
                    width={128}
                    unoptimized={true}
                    onError={() => setImageError(true)}
                  />
                )}
                <h2 className="text-xl font-bold text-gray-900 mt-2">
                  {user.firstName} {user.lastName}
                </h2>
                <p className="text-gray-600 text-sm">{user.position}</p>
                <div className="flex items-center justify-center mt-2 text-gray-500 text-xs">
                  <Calendar className="h-3 w-3 mr-1" />
                  <span>
                    Joined {new Date(user.joinDate).toLocaleDateString(undefined, {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Information Cards */}
          <div className="md:col-span-8 space-y-6">
            {/* Personal Information Card */}
            <Card className="shadow-sm hover:shadow-md transition-shadow bg-white border-0">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-semibold flex items-center">
                  <User className="h-5 w-5 mr-2 text-blue-500" />
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="flex items-center p-3 rounded-lg bg-gray-50">
                    <div className="h-9 w-9 rounded-full bg-blue-50 flex items-center justify-center mr-3">
                      <Mail className="h-4 w-4 text-blue-500" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500">Email</p>
                      <p className="text-sm font-medium">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center p-3 rounded-lg bg-gray-50">
                    <div className="h-9 w-9 rounded-full bg-blue-50 flex items-center justify-center mr-3">
                      <Phone className="h-4 w-4 text-blue-500" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500">Phone</p>
                      <p className="text-sm font-medium">{user.phone}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Employment Details Card */}
            <Card className="shadow-sm hover:shadow-md transition-shadow bg-white border-0">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-semibold flex items-center">
                  <Building className="h-5 w-5 mr-2 text-blue-500" />
                  Employment Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="flex items-center p-3 rounded-lg bg-gray-50">
                    <div className="h-9 w-9 rounded-full bg-blue-50 flex items-center justify-center mr-3">
                      <Building className="h-4 w-4 text-blue-500" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500">Department</p>
                      <p className="text-sm font-medium">{user.department}</p>
                    </div>
                  </div>
                  <div className="flex items-center p-3 rounded-lg bg-gray-50">
                    <div className="h-9 w-9 rounded-full bg-blue-50 flex items-center justify-center mr-3">
                      <User className="h-4 w-4 text-blue-500" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500">Position</p>
                      <p className="text-sm font-medium">{user.position}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
