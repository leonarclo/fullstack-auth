"use client";
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

interface IPlaylists {
  playlists: Array<{ title: string; id: string; thumbnail: string }>;
}

interface IYoutubeApiContext {
  playlists?: IPlaylists | null;
  loadingPlaylist: boolean;
  setPlaylists: (playlists: IPlaylists | null) => void;
  setLoadingPlaylist: (loadingPlaylist: boolean) => void;
}

export const YoutubeApiContext = createContext<IYoutubeApiContext>({
  playlists: null,
  loadingPlaylist: true,
  setPlaylists: () => {},
  setLoadingPlaylist: () => {},
});

export const YoutubeApiContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [playlists, setPlaylists] = useState<IPlaylists | null>(null);
  const [loadingPlaylist, setLoadingPlaylist] = useState<boolean>(true);

  const getPlaylistsData = async () => {
    try {
      const response = await fetch(
        "http://localhost:3001/api/youtube/playlists",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();
      if (response.ok) {
        setPlaylists(data.playlists);
      } else {
        console.log(data.message);
      }
    } catch (error: any) {
      console.error("Erro ao acessar api de playlists:", error);
    } finally {
      setLoadingPlaylist(false);
    }
  };
  useEffect(() => {
    getPlaylistsData();
  }, []);

  return (
    <YoutubeApiContext.Provider
      value={{ playlists, loadingPlaylist, setPlaylists, setLoadingPlaylist }}
    >
      {children}
    </YoutubeApiContext.Provider>
  );
};

export const useYoutubeApiContext = () => useContext(YoutubeApiContext);
