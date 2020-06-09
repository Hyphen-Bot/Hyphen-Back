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

import { Guild, Client, TextChannel, MessageEmbed, GuildMember } from 'discord.js';
import { container } from 'tsyringe';
import { EventEmitter } from 'events';
import EventHandler from "./EventHandler";
import { GuildService } from '../db';

class GuildMemberRemoveEventHandler extends EventHandler {

  _guildService: GuildService;

  constructor(client: Client, guild: Guild, apiEventEmitter: EventEmitter) {
    super(client, guild, apiEventEmitter);

    this._guildService = container.resolve(GuildService);

    // listeners
    this._client.on("guildMemberRemove", this._handleGuildMemberRemove);
  }

  _handleGuildMemberRemove = async (member: GuildMember) => {
    if (member.guild.id === this._guild.id) {
      const guild = await this._guildService.getGuild(this._guild.id);
      const logChannel = <TextChannel>this._guild.channels.resolve(guild.logChannelId);
      const embed = new MessageEmbed();
      embed.setAuthor(`${member.user.tag} • Member left`, member.user.displayAvatarURL());
      embed.setThumbnail(member.user.displayAvatarURL());
      embed.addField("Roles", member.roles.cache.map(role => `<@&${role.id}>`).join(", "));
      embed.addField("Joined", member.joinedAt.toLocaleString());

      embed.setTimestamp();

      logChannel.send(embed);
    }
  }
}

export default GuildMemberRemoveEventHandler;