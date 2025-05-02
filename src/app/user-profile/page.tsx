"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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

// Mock user data
const userData = {
  name: "John Doe",
  email: "john.doe@example.com",
  phone: "+1 (555) 123-4567",
  department: "Engineering",
  position: "Software Developer",
  joinDate: "2022-01-15",
  avatar: "/placeholder.svg?height=100&width=100",
};

export default function ProfilePage() {
  const router = useRouter();
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  const handleLogout = () => {
    // In a real app, you would handle logout logic here
    // For now, we'll just redirect to a hypothetical login page
    router.push("/");
  };

  return (
    <div className="container p-4 animate-fade-in">
      <h1 className="text-2xl font-bold mb-6 tracking-tight">Profile</h1>

      <div className="flex flex-col items-center mb-8">
        <div className="relative mb-4">
          <Avatar className="h-24 w-24 border-4 border-background shadow-lg">
            <AvatarImage
              src={userData.avatar || "/placeholder.svg"}
              alt={userData.name}
            />
            <AvatarFallback className="text-xl">
              {userData.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div className="absolute bottom-0 right-0 h-6 w-6 rounded-full bg-green-500 border-2 border-background"></div>
        </div>
        <h2 className="text-xl font-semibold">{userData.name}</h2>
        <p className="text-muted-foreground">{userData.position}</p>
      </div>

      <Card className="mb-6 card-hover border-border/40">
        <CardHeader>
          <CardTitle className="text-lg font-medium">
            Personal Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center">
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
              <Mail className="h-4 w-4 text-primary" />
            </div>
            <span className="text-sm">{userData.email}</span>
          </div>
          <div className="flex items-center">
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
              <Phone className="h-4 w-4 text-primary" />
            </div>
            <span className="text-sm">{userData.phone}</span>
          </div>
          <div className="flex items-center">
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
              <Building className="h-4 w-4 text-primary" />
            </div>
            <span className="text-sm">{userData.department}</span>
          </div>
        </CardContent>
      </Card>

      <Card className="card-hover border-border/40">
        <CardHeader>
          <CardTitle className="text-lg font-medium">
            Employment Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center">
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
              <User className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium">Position</p>
              <p className="text-sm text-muted-foreground">
                {userData.position}
              </p>
            </div>
          </div>
          <div className="flex items-center">
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
              <Building className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium">Department</p>
              <p className="text-sm text-muted-foreground">
                {userData.department}
              </p>
            </div>
          </div>
          <div className="flex items-center">
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
              <Calendar className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium">Join Date</p>
              <p className="text-sm text-muted-foreground">
                {new Date(userData.joinDate).toLocaleDateString()}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="mt-8">
        <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
          <AlertDialogTrigger asChild>
            <Button
              variant="destructive"
              className="w-full rounded-full shadow-md hover:shadow-lg transition-all"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Are you sure you want to logout?
              </AlertDialogTitle>
              <AlertDialogDescription>
                You will need to login again to access your account.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="rounded-full">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleLogout}
                className="rounded-full"
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
