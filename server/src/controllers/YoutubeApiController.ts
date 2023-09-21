import { Request, Response } from "express";
import { google } from "googleapis";

export class YoutubeApiController {
  async handle(req: Request, res: Response) {
    try {
      const youtube = google.youtube({
        version: "v3",
        auth: process.env.YOUTUBE_KEY,
      });

      const channelId = "UCAr4aWzpQbmXieVqTvVNc2w";

      const playlistsResponse = await youtube.playlists.list({
        part: ["snippet"],
        channelId: channelId,
      });

      const playlists = playlistsResponse.data.items;

      if (playlists && playlists.length > 0) {
        // Lista as informações de cada playlist
        playlists.forEach((playlist) => {
          console.log("Título da Playlist: " + playlist.snippet?.title);
          console.log(
            "Descrição da Playlist: " + playlist.snippet?.description
          );
          console.log("ID da Playlist: " + playlist.id);
          console.log("---");
        });
      } else {
        console.log("Nenhuma playlist encontrada no canal.");
      }
    } catch (error) {
      console.error("Erro ao buscar as playlists do canal:", error);
    }
  }
}
