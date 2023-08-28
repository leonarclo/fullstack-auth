import { UserContextProvider } from "@/context/userContext";
import Link from "next/link";

export default function Home() {
  return (
    <section className="bg-black h-screen w-sreen">
      <div className="container m-auto p-10 flex items-center justify-center h-full">
        <div className="border border-white rounded text-white flex flex-col gap-10 p-10">
          <Link href="/register">Registrar</Link>
          <Link href="/login">Login</Link>
        </div>
      </div>
    </section>
  );
}
