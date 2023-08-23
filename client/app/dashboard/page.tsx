"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Link from "next/link";

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
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

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

  const handleCategorySelect = (categoryTitle: string) => {
    setSelectedCategory(categoryTitle);
    console.log(categoryTitle);
  };

  const categories = [
    { id: 1, title: "animes" },
    { id: 2, title: "memes" },
    { id: 3, title: "sitcom" },
  ];

  return (
    <div className="h-screen flex flex-col">
      <Navbar name={userData?.name} />
      <section className="bg-black w-screen flex-1">
        <div className="container m-auto p-10 flex items-center justify-center h-full">
          <div className="border border-white rounded text-white flex flex-col gap-10 p-10">
            <div className="container m-auto flex flex-row items-center flex-wrap gap-6">
              {categories.map((category) => (
                <div key={category.id} className="text-black">
                  <Link href={"/course"} onClick={() => handleCategorySelect}>
                    <div className="bg-white rounded p-10 m-10 w-100 h-100">
                      <h2>{category.title}</h2>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Dashboard;
