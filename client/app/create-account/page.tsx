"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm, SubmitHandler } from "react-hook-form";

type Inputs = {
  name: string;
  email: string;
};

function CreateAccount() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      const response = await fetch("http://localhost:3001/create-account", {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      const res = await response.json();
      if (response.ok) {
        alert(res.message);
        router.push("/login");
      } else {
        alert(res.message);
      }
    } catch (error: any) {
      console.log(error);
    }
  };

  return (
    <section className="bg-black h-screen w-sreen">
      <div className="container m-auto p-10 flex items-center justify-center h-full">
        <div className="border border-white rounded text-white flex flex-col gap-10 p-10">
          <h1 className="text-center text-xl">Cadastrar novo email</h1>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-6"
          >
            <div className="flex flex-col">
              <label>Nome</label>
              <input
                className="bg-black border border-white rounded"
                {...register("name", { required: "O nome é obrigatório." })}
              />
              {errors.name && <p>{errors.name.message}</p>}
            </div>
            <div className="flex flex-col">
              <label>Email</label>
              <input
                className="bg-black border border-white rounded"
                {...register("email", { required: "O email é obrigatório." })}
              />
              {errors.email && <p>{errors.email.message}</p>}
            </div>
            <Link href={"/login"}>Go to Login</Link>
            <button type="submit" className="p-2 border border-white rounded">
              Submit
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

export default CreateAccount;
