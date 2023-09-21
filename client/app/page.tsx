"use client";
import Loading from "@/components/Loading";
import { useUserContext } from "@/context/userContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();
  const { userData, loading } = useUserContext();

  useEffect(() => {
    if (userData) {
      router.push("/dashboard");
    } else if (!loading) {
      router.push("/login");
    }
  }, [userData, loading, router]);

  if (loading) {
    return <Loading />;
  }

  return null;
}
