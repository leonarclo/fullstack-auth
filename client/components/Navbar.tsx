import { useGetUserQuery, useLogOutMutation } from "@/redux/features/apiSlice";
import { logOut, setCredentials } from "@/redux/features/authSlice";
import { useAppSelector } from "@/redux/store";
import { useRouter } from "next/navigation";

import React, { useEffect } from "react";
import { useDispatch } from "react-redux";

function Navbar() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [LogoutUser] = useLogOutMutation();

  const userData = useAppSelector((state) => state.auth.authData);

  const handlerLogOut = async () => {
    try {
      await LogoutUser("").unwrap();
      dispatch(logOut());
      router.push("/login");
    } catch (error: any) {
      console.error(error);
    }
  };

  return (
    <nav className="bg-black w-screen py-4 mb-1">
      <div className="container mx-auto flex items-center justify-between">
        {userData?.accessToken ? (
          <>
            <h1 className="text-slate-50">{`Bem-Vindo(a), ${userData?.user}!`}</h1>
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
              onClick={handlerLogOut}
            >
              Sair
            </button>
          </>
        ) : (
          <button
            className="text-slate-50 py-2 px-6 border rounded"
            onClick={() => router.push("/login")}
          >
            Entrar
          </button>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
