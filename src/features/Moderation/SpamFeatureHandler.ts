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

import { Message, TextChannel, MessageEmbed } from 'discord.js';
import * as moment from "moment";
import { container } from 'tsyringe';
import FeatureHandler from '../FeatureHandler';
import { Features } from '../Features';
import { GuildService } from '../../db';

class SpamFeatureHandler extends FeatureHandler<SpamFeatureHandler> {

  _guildService: GuildService;

  constructor() {
    super({
      feature: Features.SPAM,
      description: "Detect, delete, handle & log spam."
    });

    this._guildService = container.resolve(GuildService);
  }

  handler = async (message: Message) => {    
    let duplicateMessages = [];
    let spamMessages = [];
    message.channel.messages.cache.array().reduce((previousMsg: Message, currentMsg: Message) => {
      if (previousMsg.content.replace(" ", "").toLowerCase() === currentMsg.content.replace(" ", "").toLowerCase()) duplicateMessages.push(currentMsg);
      if (Math.abs(moment(previousMsg.createdTimestamp).milliseconds() - moment(currentMsg.createdTimestamp).milliseconds()) < 500) spamMessages.push(currentMsg);
      return currentMsg;
    });

    if (duplicateMessages.length > 3 || spamMessages.length > 3) {
      const embed = new MessageEmbed();
      if (duplicateMessages.length > spamMessages.length) {
        embed.setAuthor("Duplicated messages detected", message.author.displayAvatarURL(), message.url);
        embed.addField("Messages", duplicateMessages.map(msg => msg.content ? "```" + msg.content + "```" : ""));
      } else {
        embed.setAuthor("Spam detected", message.author.displayAvatarURL(), message.url);
        embed.addField("Messages", spamMessages.map(msg => msg.content ? "```" + msg.content + "```" : ""));
      }

      embed.setColor("#ffd900");
      embed.setTimestamp();

      duplicateMessages.forEach(msg => msg.delete());
      spamMessages.forEach(msg => msg.delete());

      const guild = await this._guildService.getGuild(message.guild.id);
      const logChannel = <TextChannel>message.guild.channels.resolve(guild.logChannelId);
      logChannel.send(embed);
    }
  }
}

export default SpamFeatureHandler;