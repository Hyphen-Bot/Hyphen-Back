/*
 *   Copyright (c) 2020 Lucien Blunk-Lallet

 *   This program is free software: you can redistribute it and/or modify
 *   it under the terms of the GNU General Public License as published by
 *   the Free Software Foundation, either version 3 of the License, or
 *   (at your option) any later version.

 *   This program is distributed in the hope that it will be useful,
 *   but WITHOUT ANY WARRANTY; without even the implied warranty of
 *   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *   GNU General Public License for more details.

 *   You should have received a copy of the GNU General Public License
 *   along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import { Message, StreamDispatcher, VoiceConnection, MessageEmbed } from 'discord.js'; 
import * as ytdl from "ytdl-core";
import { YTSearcher } from "ytsearcher";
import CommandHandler from '../CommandHandler';
import { CommandType } from '../CommandType';
import { Commands } from '../Commands';
import { CommandException } from '../../exceptions';

class PlayCommandHandler extends CommandHandler<PlayCommandHandler> {

  _message: Message;

  _connection: VoiceConnection;
  _dispatcher: StreamDispatcher;
  _youtube: YTSearcher;

  _queue: Array<any>;
  _current: any;

  constructor() {
    super({
      command: Commands.MUSIC,
      type: CommandType.COMMON,
      arguments: ["action", "music"],
      description: "Play music. Actions can be : play, pause, resume, next, add, queue, clear, disconnect."
    });

    this._youtube = new YTSearcher(process.env.YOUTUBE_API_KEY);
    this._queue = [];
  }

  handler = async (message: Message, payload: any) => {
    this._message = message;

    if (!message.member.voice.channel) throw new CommandException("You can't control the music if you are not in a voice channel !");

    if (!this._connection) {
      this._connection = await message.member.voice.channel.join();
    }

    let musicName: string;
    let musicLink: string;
    if (payload.args.action === "play" || payload.args.action === "add") {
      if (!payload.args.music) throw new CommandException("Please enter a music name or youtube link !");
        const results = await this._youtube.search(payload.args.music, { maxResults: 1 });

        if (results.first && results.first.url) {
          musicLink = results.first.url;
          musicName = results.first.title;
        } else {
          throw new CommandException("No match !");
        }
    }

    switch (payload.args.action) {
      case "play": this._play(musicName, musicLink);
      break;

      case "pause": this._pause();
      break;

      case "resume": this._resume();
      break;

      case "next": this._next();
      break;

      case "add": this._add(musicName, musicLink);
      break;

      case "queue": this._showQueue();
      break;

      case "clear": this._clear();
      break;

      case "disconnect": this._disconnect();
      break;

      case "stop": this._stop();
      break;

      default: throw new CommandException("This action does not exist !");
    }
  }

  _play = (name: string, url: string) => {
    this._stop();
    this._current = { name, url };
    this._dispatcher = this._connection.play(ytdl(url, { filter: 'audioonly' }));

    this._dispatcher.on('finish', () => {
      this._next();
    });

    this._dispatcher.on('error', console.error);
    this._message.react("▶️");
  }

  _next = () => {
    if (this._queue.length > 0) {
      const music = this._queue.shift();
      this._play(music.name, music.url);
    } else {
      this._stop();
    }
  }

  _add = (name: string, url: string) => {
    this._queue.push({ name, url });
    this._message.react("➕");
  }

  _clear = () => {
    this._queue = [];
    this._message.react("🗑");
  }

  _pause = () => {
    if (this._dispatcher) {
      this._dispatcher.pause();
      this._message.react("⏸");
    }
  }

  _resume = () => {
    if (this._dispatcher) {
      this._dispatcher.resume();
      this._message.react("⏯");
    }
  }

  _stop = () => {
    if (this._dispatcher) {
      this._dispatcher.destroy();
      this._dispatcher = undefined;
      this._current = undefined;
      this._message.react("⏹");
    }
  }

  _showQueue = async () => {
    const queueText = this._queue.map((queue, index) => `__**${index + 1}.** ${queue.name}__`).join("\n");
    const embed = new MessageEmbed();
    embed.setTitle(`📄 Queue ${this._current ? `• Currently playing ${this._current.name}` : ""}`);
    embed.setDescription(queueText.length > 0 ? queueText : "The queue is empty !");
    embed.setColor("#dbebff");
    embed.setTimestamp();

    const msg: Message = await this._message.channel.send(embed);
    await msg.react("⏯");
    await msg.react("⏹");
    await msg.react("⏭");
    this._awaitQueueReaction(embed, msg);
  }

  _disconnect = () => {
    this._stop();
    this._queue = [];
    this._connection.disconnect();
    this._connection = undefined;

    this._message.react("👋");
  }

  _awaitQueueReaction = (embed, msg) => {
    this._message.client.once("messageReactionAdd", async (messageReaction, user) => {
      if (messageReaction.message.id === msg.id && !user.bot) {
        await messageReaction.users.remove(user.id);
        if (messageReaction.emoji.name === "⏭") {
          this._next();
          const newQueueText = this._queue.map((queue, index) => `__**${index + 1}.** ${queue.name}__`).join("\n");
          embed.setTitle(`📄 Queue ${this._current ? `• Currently playing ${this._current.name}` : ""}`);
          embed.setDescription(newQueueText.length > 0 ? newQueueText : "The queue is empty !");
          await msg.edit(embed);
          await msg.react("⏭");
        }

        if (messageReaction.emoji.name === "⏯") {
          if (this._dispatcher.paused) {
            this._resume();
          } else {
            this._pause();
          }
          await msg.react("⏯");
        }

        if (messageReaction.emoji.name === "⏹") {
          this._stop();
          await msg.react("⏹");
        }

      }
      this._awaitQueueReaction(embed, msg);
    });
  }
}

export default PlayCommandHandler;