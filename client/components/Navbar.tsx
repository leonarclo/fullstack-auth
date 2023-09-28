import { useAppSelector } from "@/redux/store";
import { useRouter } from "next/navigation";

import React from "react";

function Navbar() {
  const router = useRouter();

  const userData = useAppSelector((state) => state.auth.userData);

  // return (
  //   <nav className="bg-black w-screen py-4 mb-1">
  //     <div className="container mx-auto flex items-center justify-between">
  //       <button
  //         className="text-slate-50 py-2 px-6 border rounded"
  //         onClick={() => router.push("/login")}
  //       >
  //         Entrar
  //       </button>
  //     </div>
  //   </nav>
  // );

  const logOut = async () => {
    try {
      const response = await fetch("http://localhost:3001/logout", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      if (response.ok) {
        router.push("/login");
      }
    } catch (error: any) {
      console.error(error);
    }
  };

  return (
    <nav className="bg-black w-screen py-4 mb-1">
      <div className="container mx-auto flex items-center justify-between">
        <h1 className="text-slate-50">Bem-Vindo(a), {userData?.name}!</h1>
        {userData?.role === "ADMIN" && (
          <button
            className="text-slate-50 py-2 px-6 border rounded"
            onClick={() => router.push("/create-account")}
          >
            Criar Conta
          </button>
        )}
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
