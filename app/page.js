"use client";
import { Puff } from "react-loader-spinner";
import { useEffect } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/message"); // 👈 change this to your main page
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Puff
          height="100"
          width="100"
          color="#59fb59"
          ariaLabel="puff-loading"
          visible={true}
        />
      </div>
    );
  }
  if (!session) {
    return (
      <>
        <div>
          <h1
            onClick={() => {
              router.push("/");
            }}
            className=" text-3xl md:text-8xl text text-center"
          >
            Kathabolo is India's 1st platform
          </h1>
          <h1 className=" text-1xl md:text-3xl text-center">
            where you can easily message anyone without needing their mobile
            number.
          </h1>

          <div className="photo flex items-center justify-center">
            <img
              className="h-[500px] rounded-3xl flex items-center justify-center"
              alt=" image"
              srcSet="https://i.ibb.co/Fk002c6P/hunyuan-image-3-0-a-A-sleek-futuristic.png"
            />
          </div>
          <div className=" flex items-center justify-center my-5">
            <button
              onClick={() => router.push(!session ? "/signin" : "/message")}
              className=" relative inline-flex items-center cursor-pointer justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-cyan-500 to-blue-500 group-hover:from-cyan-500 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-cyan-200 dark:focus:ring-cyan-800"
            >
              <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-transparent group-hover:dark:bg-transparent">
                GET STARTED
              </span>
            </button>
          </div>
                   <div className="mx-auto flex flex-col gap-5 items-center justify-center my-5 px-3">
            <h1 className="font-bold text-2xl text-center">
              How to Create an Account
            </h1>

            <div className="w-full max-w-2xl aspect-video rounded-xl overflow-hidden shadow-md">
              <iframe
                className="w-full h-full"
                src="https://www.youtube.com/embed/wT7Ii5GZhPo?si=AHNtL-J9G36y6hvI"
                title="YouTube video player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      </>
    );
  }
}
