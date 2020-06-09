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

import { Guild, Client, Message, TextChannel, MessageEmbed } from 'discord.js';
import { container } from 'tsyringe';
import { EventEmitter } from 'events';
import EventHandler from "./EventHandler";
import { GuildService } from '../db';

class MessageUpdateEventHandler extends EventHandler {

  _guildService: GuildService;

  constructor(client: Client, guild: Guild, apiEventEmitter: EventEmitter) {
    super(client, guild, apiEventEmitter);

    this._guildService = container.resolve(GuildService);

    // listeners
    this._client.on("messageUpdate", this._handleMessageUpdated);
  }

  _handleMessageUpdated = async (oldMessage: Message, newMessage: Message) => {
    if (newMessage.guild.id === this._guild.id) {
      const guild = await this._guildService.getGuild(this._guild.id);
      const logChannel = <TextChannel>this._guild.channels.resolve(guild.logChannelId);
      const embed = new MessageEmbed();
      if (!newMessage.content) return;
      embed.setAuthor("Message edited (click here)", newMessage.author.displayAvatarURL(), newMessage.url);
      embed.setColor("#4aa4e0");
      embed.addField("New content", "```" + newMessage.content + "```");
      embed.addField("Old content", "```" + oldMessage.content + "```");
      embed.setDescription(
        `**Author:** <@${newMessage.author.id}> (${newMessage.author.tag})\n` +
        `**Channel:** <#${newMessage.channel.id}>`
      );

      embed.setTimestamp();

      logChannel.send(embed);
    }
  }
}

export default MessageUpdateEventHandler;