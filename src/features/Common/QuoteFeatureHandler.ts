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
import FeatureHandler from '../FeatureHandler';
import { Features } from './../Features';

class QuoteFeatureHandler extends FeatureHandler<QuoteFeatureHandler> {

  constructor() {
    super({
      feature: Features.QUOTE,
      description: "Quotes message links."
    });
  }

  handler = async (message: Message) => {    
    if (message.content.match(/https:\/\/(discord|discordapp).com\/channels(\/[0-9]+){3}/g)) {
      const split = message.content.split("/");
      const parsed = split.slice(split.length - 3, split.length);

      const channelId = parsed[1];
      const messageId = parsed[2];

      const channel: TextChannel = <TextChannel>message.guild.channels.resolve(channelId);
      const msg: Message =  await channel.messages.fetch(messageId);

      if (msg) {
        const member = message.guild.members.resolve(msg.author.id);
        const embed = new MessageEmbed();
        embed.setDescription(msg.content);
        embed.setTimestamp(msg.createdAt);
        embed.setColor(member.roles.highest.color);
        embed.setFooter(`Sent in #${channel.name} by ${msg.author.tag} • Quoted by ${message.author.tag}`);

        message.channel.send(embed);
        message.delete();
      }
    }
  }
}

export default QuoteFeatureHandler;