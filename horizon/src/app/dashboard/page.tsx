"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { account } from "../../../service/appwrite"; // Make sure Models is imported
import { Models } from "appwrite"

export default function DashboardPage() {
  const [user, setUser] = useState<Models.User<Models.Preferences> | null>(null);
  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      try {
        const currentUser = await account.get(); // Fetch the logged-in user
        setUser(currentUser); // Set user state
      } catch (err) {
        console.error("No user session found. Redirecting to login.");
        router.push("/login"); // Redirect to login if no session is found
      }
    };
    getUser();
  }, [router]);

  const handleLogout = async () => {
    try {
      await account.deleteSession("current");
      router.push("/login");
    } catch (err) {
      console.error("Error logging out:", err);
    }
  };

  if (!user) {
    return <p>Loading...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold text-gray-900">Welcome, {user.email}!</h1>
      <p className="mt-4 text-lg text-gray-700">You are now logged into the dashboard.</p>
      <button
        onClick={handleLogout}
        className="mt-6 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-500"
      >
        Log Out
      </button>
    </div>
  );
}
