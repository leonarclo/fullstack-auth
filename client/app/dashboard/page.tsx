"use client";
import React, { useContext, useState } from "react";
import Navbar from "@/components/Navbar";
import { useUserContext } from "@/context/userContext";

function Dashboard() {
  const { userData, loading } = useUserContext();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = [
    { id: 1, title: "animes" },
    { id: 2, title: "memes" },
    { id: 3, title: "sitcom" },
  ];

  if (!userData || loading) {
    return <p>Loading...</p>;
  }
  return (
    <div className="h-screen flex flex-col">
      <Navbar name={userData?.name} />
      <section className="bg-black w-screen flex-1">
        <div className="container m-auto p-10 flex items-center justify-center h-full">
          <div className="border border-white rounded text-white flex flex-col gap-10 p-10">
            <div className="container m-auto flex flex-row items-center flex-wrap gap-6">
              <h3>Categoria: {selectedCategory}</h3>
              {categories.map((category) => (
                <div key={category.id} className="text-black">
                  <button onClick={() => setSelectedCategory(category.title)}>
                    <div className="bg-white rounded p-10 m-10 w-100 h-100">
                      <h2>{category.title}</h2>
                    </div>
                  </button>
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
