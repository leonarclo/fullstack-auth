"use client";
import React, { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { useUserContext } from "@/context/userContext";
import { useRouter } from "next/navigation";
import Loading from "@/components/Loading";
import { useYoutubeApiContext } from "@/context/youtubeApi";
import Image from "next/image";

function Dashboard() {
  const router = useRouter();
  const { loading, userData } = useUserContext();
  const { loadingPlaylist, playlists } = useYoutubeApiContext();

  if (loading || loadingPlaylist) {
    return <Loading />;
  }

  if (!userData && !loading) {
    router.push("/login");
    return null;
  }

  return (
    <div className="h-screen flex flex-col">
      <Navbar />
      <section className="bg-black w-screen flex-1">
        <div className="container m-auto p-10 flex items-center justify-center h-full">
          <div className="border border-white rounded text-white flex flex-col gap-10 p-10">
            <div className="container m-auto flex flex-row items-center flex-wrap gap-6 justify-center">
              {playlists?.map((playlist: any) => (
                <div key={playlist.id} className="text-black">
                  <Link href={"/course"}>
                    <div className="bg-white rounded p-10 m-10 w-[280px] text-center">
                      <h2>{playlist.title}</h2>
                      <Image
                        src={playlist.thumbnail}
                        alt=""
                        width={210}
                        height={115}
                      />
                    </div>
                  </Link>
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
