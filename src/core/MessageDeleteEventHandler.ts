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

class MessageDeleteEventHandler extends EventHandler {

  _guildService: GuildService;

  constructor(client: Client, guild: Guild, apiEventEmitter: EventEmitter) {
    super(client, guild, apiEventEmitter);

    this._guildService = container.resolve(GuildService);

    // listeners
    this._client.on("messageDelete", this._handleMessageDeleted);
  }

  _handleMessageDeleted = async (message: Message) => {
    if (message.guild.id === this._guild.id) {
      const guild = await this._guildService.getGuild(this._guild.id);
      const logChannel = <TextChannel>this._guild.channels.resolve(guild.logChannelId);
      const embed = new MessageEmbed();
      if (!message.content) return;
      embed.setAuthor("Message deleted", message.author.displayAvatarURL());
      embed.setColor("#e04a4a");
      embed.addField("Content", "```" + message.content + "```");
      embed.setDescription(
        `**Author:** <@${message.author.id}> (${message.author.tag})\n` +
        `**Channel:** <#${message.channel.id}>`
      );

      if (message.attachments.size === 1) {
        embed.setImage(message.attachments.array()[0].url);
      } else if (message.attachments.size > 1) {
        let attachments = "";
        message.attachments.array().forEach(attachment => {
            attachments += `• ${attachment.url}\n`;
        });
        embed.addField("Additional attachments", attachments);
      }

      embed.setTimestamp();

      logChannel.send(embed);
    }
  }
}

export default MessageDeleteEventHandler;