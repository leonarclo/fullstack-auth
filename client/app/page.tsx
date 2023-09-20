"use client";
import Loading from "@/components/Loading";
import { IUserData } from "@/context/userContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<IUserData | null>(null);

  const checkAuth = async () => {
    try {
      const response = await fetch("http://localhost:3001/user-data", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      const data = await response.json();
      if (response.ok) {
        setUserData(data);
      } else {
        router.push("/login");
      }
    } catch (error: any) {
      console.error("Error checking authentication:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  if (loading) {
    return <Loading />;
  }

  if (userData) {
    router.push("/dashboard");
  }

  if (!userData) {
    router.push("/login");
  }
}
