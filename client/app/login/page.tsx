"use client";
import Link from "next/link";
import { useForm, SubmitHandler } from "react-hook-form";
import { useLoginMutation } from "@/redux/features/apiSlice";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { setCredentials } from "@/redux/features/authSlice";
import { useEffect } from "react";

type Inputs = {
  email: string;
  password: string;
};

function Login() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [loginUser, { data: loginData, isLoading, error }] = useLoginMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      await loginUser(data).unwrap();
      dispatch(setCredentials(loginData));
      console.log(loginData);
      router.push("/dashboard");
    } catch (err: any) {
      alert(error);
    }
  };

  return (
    <section className="bg-black h-screen w-sreen">
      <div className="container m-auto p-10 flex items-center justify-center h-full">
        <div className="border border-white rounded text-white flex flex-col gap-10 p-10">
          <h1 className="text-center text-xl">Login</h1>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-6"
          >
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
              disabled={isLoading}
            >
              {isLoading ? "Entrando..." : "Enviar"}
            </button>
          </form>
          <div className="flex flex-col gap-4">
            <Link href={"/register"}>Cadastrar</Link>
            <Link href={"/password/forget"}>Esqueci minha senha</Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Login;
