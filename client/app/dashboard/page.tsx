"use client";
import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { useUserContext } from "@/context/userContext";
import { useRouter } from "next/navigation";
import Loading from "@/components/Loading";

function Dashboard() {
  const router = useRouter();
  const { userData, loading } = useUserContext();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const handleCategorySelect = (categoryTitle: string) => {
    setSelectedCategory(categoryTitle);
    console.log(categoryTitle);
  };

  const categories = [
    { id: 1, title: "Curso 1" },
    { id: 2, title: "Curso 2" },
    { id: 3, title: "Curso 3" },
  ];

  if (loading) {
    return <Loading />;
  }

  if (!userData && !loading) {
    router.push("/login");
    return null;
  }

  return (
    <div className="h-screen flex flex-col">
      <Navbar />
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
