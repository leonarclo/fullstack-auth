"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

function AcessToken() {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const urlToken = window.location.search.split("=")[1];
    if (urlToken) {
      setToken(urlToken);
    }

    const getAccessToken = async () => {
      try {
        const response = await fetch("http://localhost:3001/access-token", {
          method: "POST",
          body: JSON.stringify({ token }),
          headers: {
            "Content-Type": "application/json",
          },
        });

        const res = await response.json();
        if (response.ok) {
          alert(res.message);
          router.push("/login");
        }
      } catch (error: any) {
        alert(error);
        router.push("/login");
      }
    };
    getAccessToken();
  }, []);

  return (
    <section className="bg-black h-screen w-sreen">
      <div className="container m-auto p-10 flex items-center justify-center h-full">
        <div className="border border-white rounded text-white flex flex-col gap-10 p-10">
          <h1 className="text-center text-xl">
            {token ? "Acesso Liberado!" : "Loading..."}
          </h1>
          <div className="flex flex-col gap-4">
            <Link href={"/login"}>Go to Login</Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AcessToken;
