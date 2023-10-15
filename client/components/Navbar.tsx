"use client";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { logOut } from "@/redux/auth/slice";
import { useAppSelector } from "@/redux/store";
import { useGetUserQuery, userApi } from "@/redux/user/api";
import Loading from "./Loading";
import { useCookies } from "react-cookie";

// Constants
const CREATE_ACCOUNT_ROUTE = "/create-account";
const LOGIN_ROUTE = "/login";

function Navbar() {
  const router = useRouter();
  const dispatch = useDispatch();
  const userData = useAppSelector((state) => state.authState);
  const [cookies] = useCookies(["logged_in"]);
  const { isLoading, isFetching } = userApi.endpoints.getUser.useQuery(null, {
    skip: false,
    refetchOnMountOrArgChange: true,
  });

  const loading = isLoading || isFetching;

  if (loading) {
    return <Loading />;
  }

  const handleLogOut = async () => {
    try {
      dispatch(logOut());
      router.push(LOGIN_ROUTE);
    } catch (error) {
      console.error(error);
    }
  };

  const isAuthenticated = userData?.authData?.accessToken;

  return (
    <nav className="bg-black w-screen py-4 mb-1">
      <div className="container mx-auto flex items-center justify-between">
        {isAuthenticated ? (
          <>
            <h1 className="text-slate-50">{`Bem-Vindo(a), ${userData?.authData?.name}!`}</h1>
            {userData?.authData?.role === "ADMIN" && (
              <button
                className="text-slate-50 py-2 px-6 border rounded"
                onClick={() => router.push(CREATE_ACCOUNT_ROUTE)}
              >
                Criar Conta
              </button>
            )}
            <button
              className="text-slate-50 py-2 px-6 border rounded"
              onClick={handleLogOut}
            >
              Sair
            </button>
          </>
        ) : (
          <button
            className="text-slate-50 py-2 px-6 border rounded"
            onClick={() => router.push(LOGIN_ROUTE)}
          >
            Entrar
          </button>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
