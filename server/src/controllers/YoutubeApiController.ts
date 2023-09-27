import { Request, Response } from "express";
import { google } from "googleapis";

export class YoutubeApiController {
  async handlePlaylistsName(req: Request, res: Response) {
    try {
      const youtube = google.youtube({
        version: "v3",
        auth: process.env.YOUTUBE_KEY,
      });

      const channelId = "UCAr4aWzpQbmXieVqTvVNc2w";

      const playlistsResponse = await youtube.playlists.list({
        part: ["snippet"],
        channelId: channelId,
        maxResults: 10,
      });

      const playlists = playlistsResponse.data.items as any[];

      if (playlists && playlists.length > 0) {
        const simplifiedPlaylists = playlists?.map((playlist) => ({
          title: playlist.snippet?.title,
          id: playlist.id,
          thumbnail: playlist.snippet?.thumbnails?.default?.url,
        }));

        return res.status(200).json({ playlists: simplifiedPlaylists });
      } else {
        console.log("Nenhuma playlist encontrada no canal.");
      }
    } catch (error) {
      console.error("Erro ao buscar as playlists do canal:", error);
    }
  }

  async handleVideoPerPlaylist(req: Request, res: Response) {
    try {
      const youtube = google.youtube({
        version: "v3",
        auth: process.env.YOUTUBE_KEY,
      });

      const channelId = "UCAr4aWzpQbmXieVqTvVNc2w";

      const playlistsResponse = await youtube.playlists.list({
        part: ["snippet"],
        channelId: channelId,
        maxResults: 10,
      });

      const playlists = playlistsResponse.data.items as any[];

      if (playlists && playlists.length > 0) {
        const simplifiedPlaylists = playlists?.map((playlist) => ({
          title: playlist.snippet?.title,
          id: playlist.id,
          thumbnail: playlist.snippet?.thumbnails?.default?.url,
        }));

        return res.status(200).json({ playlists: simplifiedPlaylists });
      } else {
        console.log("Nenhuma playlist encontrada no canal.");
      }
    } catch (error) {
      console.error("Erro ao buscar as playlists do canal:", error);
    }
  }
}
