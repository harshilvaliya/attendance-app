"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LogOut, Mail, Phone, User, Building, Calendar } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function ProfilePage() {
  const router = useRouter();
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/user/get-user`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log(token);

        if (response.status === 401) {
          localStorage.removeItem("token");
          router.push("/login");
          return;
        }

        if (!response.ok) throw new Error("Failed to fetch user data");

        const data = await response.json();
        setUserData(data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [router]);

  // Loading and error states
  if (loading) {
    return <div className="container text-center py-8">Loading...</div>;
  }

  if (error || !userData) {
    return (
      <div className="container text-center py-8 text-red-500">
        Error: {error || "Failed to load user data"}
      </div>
    );
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 py-6 space-y-8 max-w-7xl min-h-screen">
      <div className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
          Profile
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Manage your personal information and settings
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card className="shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Account Status
            </CardTitle>
            {userData.selfieUrl ? (
              <img
                src={userData.selfieUrl}
                alt="Profile"
                className="h-10 w-10 rounded-full object-cover"
              />
            ) : (
              <User className="h-4 w-4 text-muted-foreground" />
            )}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userData.username}</div>
            <p className="text-xs text-muted-foreground">{userData.position}</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Join Date</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Date(userData.joinDate).toLocaleDateString(undefined, {
                month: "short",
                year: "numeric",
              })}
            </div>
            <p className="text-xs text-muted-foreground">Member since</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <Card className="shadow-sm hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="text-lg font-medium">
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center p-2 rounded-lg hover:bg-muted/50 transition-colors">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                <Mail className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium">Email</p>
                <p className="text-sm text-muted-foreground">
                  {userData.email}
                </p>
              </div>
            </div>
            <div className="flex items-center p-2 rounded-lg hover:bg-muted/50 transition-colors">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                <Phone className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium">Phone</p>
                <p className="text-sm text-muted-foreground">
                  {userData.phoneNumber}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="text-lg font-medium">
              Employment Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center p-2 rounded-lg hover:bg-muted/50 transition-colors">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                <Building className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium">Department</p>
                <p className="text-sm text-muted-foreground">
                  {userData.department}
                </p>
              </div>
            </div>
            <div className="flex items-center p-2 rounded-lg hover:bg-muted/50 transition-colors">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                <User className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium">Position</p>
                <p className="text-sm text-muted-foreground">
                  {userData.position}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-center sm:justify-end pt-4">
        <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
          <AlertDialogTrigger asChild>
            <Button
              variant="destructive"
              className="w-full sm:w-auto shadow-sm hover:shadow-md transition-all"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="sm:max-w-[425px] rounded-lg">
            <AlertDialogHeader>
              <AlertDialogTitle>
                Are you sure you want to logout?
              </AlertDialogTitle>
              <AlertDialogDescription>
                You will need to login again to access your account.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="sm:space-x-2">
              <AlertDialogCancel className="w-full sm:w-auto">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleLogout}
                className="w-full sm:w-auto bg-destructive hover:bg-destructive/90"
              >
                Logout
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
