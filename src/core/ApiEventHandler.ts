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

import { Guild, Client, TextChannel } from 'discord.js';
import { EventEmitter } from 'events';
import EventHandler from "./EventHandler";

class ApiEventHandler extends EventHandler {

  constructor(client: Client, guild: Guild, apiEventEmitter: EventEmitter) {
    super(client, guild, apiEventEmitter);

    // listeners
    this._apiEventEmitter.on("sendMessage", this._handleSendMessage);
  }

  _handleSendMessage = async ({ guildId, channelId, message }: any) => {
    if (this._guild.id === guildId) {
      const channel = <TextChannel>this._guild.channels.resolve(channelId);
      await channel.send(message);
    }
  }
}

export default ApiEventHandler;