"use client";
import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Loading from "@/components/Loading";
import { useYoutubeApiContext } from "@/context/youtubeApi";
import Image from "next/image";

function Dashboard() {
  const router = useRouter();
  const { loadingPlaylist, playlists } = useYoutubeApiContext();
  const [playlistTitle, setPlaylistTitle] = useState<string | null>(null);

  const handlePlaylistTitle = (title: string) => {
    setPlaylistTitle(title);
  };

  if (loadingPlaylist) {
    return <Loading />;
  }

  return (
    <div className="h-screen flex flex-col">
      <Navbar />
      <section className="bg-black w-screen flex-1">
        <div className="container m-auto p-10 flex items-center justify-center h-full">
          <div className="border border-white rounded text-white flex flex-col gap-10 p-10">
            <div className="container m-auto flex flex-row items-center flex-wrap gap-20 justify-center">
              {playlists?.map((playlist: any) => (
                <div key={playlist.id} className="text-black">
                  <Link
                    href={"/course"}
                    onClick={() => handlePlaylistTitle(playlist.title)}
                  >
                    <h2 className="text-white text-center mb-4">
                      {playlist.title}
                    </h2>
                    <div className="w-[180px] h-[120px] relative m-auto">
                      <Image
                        src={playlist.thumbnail}
                        alt=""
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
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
