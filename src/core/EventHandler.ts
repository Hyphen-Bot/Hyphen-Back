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

import { Client, Guild, Message, GuildChannel } from 'discord.js';
import Command from '../commands/Command';

class EventHandler {
  
  _client: Client;
  _guild: Guild;

  _commands: Array<Command>;

  constructor(client: Client, guild: Guild) {
    this._client = client;
    this._guild = guild;
    this._commands = [];
  }

  onMessage = (listener: (message: Message) => void) => {
    this._client.on("message", (msg: Message) => {
      if (msg.guild.id === this._guild.id) {
        listener(msg);
      }
    });
  }

  onChannelCreate = (listener: (channel: GuildChannel) => void) => {
    this._client.on("channelCreate", (channel: GuildChannel) => {
      if (channel.guild.id === this._guild.id) {
        listener(channel);
      }
    });
  }
}

export default EventHandler;