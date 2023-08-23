import { useRouter } from "next/navigation";
import React from "react";

interface INavbar {
  name: string | undefined;
}

function Navbar({ name }: INavbar) {
  const router = useRouter();

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
  return (
    <nav className="bg-black w-screen py-4 mb-1">
      <div className="container mx-auto flex items-center justify-between">
        <h1 className="text-slate-50">Bem-Vindo(a), {name}!</h1>
        <button
          className="text-slate-50 py-2 px-6 border rounded"
          onClick={logOut}
        >
          Sair
        </button>
      </div>
    </nav>
  );
}

export default Navbar;