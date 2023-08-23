"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface IUserData {
  name: string;
  email: string;
  image?: string;
  token: string;
  account_type?: string | null;
  account_access_token?: string | null;
  account_expires_at?: Date | null;
}

function Dashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<IUserData | null>(null);

  const logOut = async () => {
    try {
      const response = await fetch("http://localhost:3001/logout", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      const data = await response.json();
      if (response.ok) {
        alert(data.message);
        router.push("/login");
      }
    } catch (error: any) {
      console.error(error);
    }
  };

  useEffect(() => {
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
          alert(data.message);
          router.push("/login");
        }
      } catch (error: any) {
        console.error("Error checking authentication:", error);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  return (
    <section className="bg-black h-screen w-screen">
      <div className="container m-auto p-10 flex items-center justify-center h-full">
        <div className="border border-white rounded text-white flex flex-col gap-10 p-10">
          {!loading && userData ? (
            <>
              <h1>Hi! {userData?.name}</h1>
              <h3>Email: {userData?.email}</h3>
              <h4>Tipo de conta: {userData?.account_type}</h4>
              <h2>This is a private route for logged-in users only!</h2>

              <button
                className="p-2 border text-white border-white rounded"
                onClick={logOut}
              >
                Sign Out
              </button>
            </>
          ) : (
            <h2>Loading...</h2>
          )}
        </div>
      </div>
    </section>
  );
}

export default Dashboard;
