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

import { Message, TextChannel, MessageEmbed, Permissions } from 'discord.js';
import { container } from 'tsyringe';
import FeatureHandler from '../FeatureHandler';
import { Features } from '../Features';
import { GuildService } from '../../db';

class LinkPreventionFeatureHandler extends FeatureHandler<LinkPreventionFeatureHandler> {

  _guildService: GuildService;

  constructor() {
    super({
      feature: Features.LINKPREVENTION,
      description: "Deletes and logs unallowed links sent in guild."
    });

    this._guildService = container.resolve(GuildService);
  }

  handler = async (message: Message) => {    
    if (message.content.search(/(http(s)?:\/\/)(.*)\.(.+)/g) !== -1) {
      if (!message.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
        // say
        const id = Array(9).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('');
        const embed = new MessageEmbed();
        embed.setColor("#e04a4a");
        embed.setAuthor(`${message.author.tag} • Unauthorized link (ID ${id})`);
        embed.setDescription("Please have your link approved before publishing it here!");
        await message.channel.send(embed);

        // log
        embed.setAuthor(`Unauthorized link deleted (ID ${id})`, message.author.displayAvatarURL());
        embed.setDescription(
          `**Author:** <@${message.author.id}> (${message.author.tag})\n` +
          `**Channel:** <#${message.channel.id}>`
        );
        embed.addField("Content", "```" + message.content + "```");
        embed.setTimestamp();

        const guild = await this._guildService.getGuild(message.guild.id);
        const logChannel = <TextChannel>message.guild.channels.resolve(guild.logChannelId);
        await logChannel.send(embed);

        // DM
        await message.author.send(`__**Link deleted (ID ${id})**__\nYour message has been deleted because it contained an unapproved link. Please take a screenshot of this message and DM a moderator to have your link approved.\n\n__**Message:**__ \`\`\`${message.content}\`\`\``);
        await message.delete();
      }
    }
  }
}

export default LinkPreventionFeatureHandler;