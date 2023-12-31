"use client";
import Loading from "@/components/Loading";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";

type Inputs = {
  name: string;
  email: string;
  password: string;
};

function Register() {
  const [loading, setLoading] = useState<boolean | null>(null);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:3001/register", {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const res = await response.json();
      if (response.ok) {
        alert(res.message);
        router.push("/login");
      } else {
        alert(res.message);
      }
    } catch (error: any) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <section className="bg-black h-screen w-sreen">
      <div className="container m-auto p-10 flex items-center justify-center h-full">
        <div className="border border-white rounded text-white flex flex-col gap-10 p-10">
          <h1 className="text-center text-xl">Cadastrar</h1>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-6"
          >
            <div className="flex flex-col">
              <label>Nome</label>
              <input
                className="bg-black border border-white rounded p-2"
                {...register("name", { required: "O nome é obrigatório." })}
              />
              {errors.name && <p>{errors.name.message}</p>}
            </div>
            <div className="flex flex-col">
              <label>Email</label>
              <input
                className="bg-black border border-white rounded p-2"
                {...register("email", { required: "O email é obrigatório." })}
              />
              {errors.email && <p>{errors.email.message}</p>}
            </div>
            <div className="flex flex-col">
              <label>Senha</label>
              <input
                className="bg-black border border-white rounded p-2"
                type="password"
                {...register("password", {
                  required: "A senha é obrigatória.",
                  minLength: {
                    value: 6,
                    message: "A senha precisa conter pelo menos 6 caracteres.",
                  },
                })}
              />
              {errors.password && <p>{errors.password.message}</p>}
            </div>
            <button
              type="submit"
              className="p-2 border border-white rounded hover:bg-white hover:text-black"
            >
              Enviar
            </button>
          </form>
          <Link href={"/login"}>Ir para Login</Link>
        </div>
      </div>
    </section>
  );
}

export default Register;
