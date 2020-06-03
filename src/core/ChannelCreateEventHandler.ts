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

import { Guild, Client, GuildChannel } from 'discord.js';
import { container } from 'tsyringe';
import { EventEmitter } from 'events';
import EventHandler from "./EventHandler";
import { GuildService } from '../db';

class ChannelCreateEventHandler extends EventHandler {

  _guildService: GuildService;

  constructor(client: Client, guild: Guild, apiEventEmitter: EventEmitter) {
    super(client, guild, apiEventEmitter);

    this._guildService = container.resolve(GuildService);

    // listeners
    this._client.on("channelCreate", this._handleChannelCreated);
  }

  _handleChannelCreated = async (channel: GuildChannel) => {
    if (channel.guild.id === this._guild.id) {
      const guild = await this._guildService.getGuild(this._guild.id);

      // add muted overwrite
      await channel.overwritePermissions([{ id: guild.mutedRoleId, deny: ["SEND_MESSAGES", "SPEAK"] }], "Deny muted role to speak / write in channels.");
    }
  }
}

export default ChannelCreateEventHandler;