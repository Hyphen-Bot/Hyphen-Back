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

import { Message, MessageEmbed } from 'discord.js';
import CommandHandler from '../CommandHandler';
import { CommandType } from '../CommandType';
import { Commands } from '../Commands';

class PingCommandHandler extends CommandHandler<PingCommandHandler> {

  constructor() {
    super({
      command: Commands.USERINFO,
      type: CommandType.COMMON,
      arguments: ["user"],
      description: "Returns user information.",
    });
  }

  handler = async (message: Message, payload: any) => {
    let user = (await message.guild.members.fetch(message.author.id)).user;

    if (payload.args && payload.args.user) {
      user = (await message.guild.members.fetch(payload.mentions[0].id)).user;
    }

    const embed = new MessageEmbed();
    embed.setAuthor(user.tag, user.displayAvatarURL());
    embed.setThumbnail(user.displayAvatarURL({ format: "png", dynamic: true, size: 1024 }));
    embed.setColor(user.presence.member.roles.color.color);
    embed.addField("User ID", user.id, true);
    embed.addField("Account Creation", user.createdAt.toLocaleString(), true);
    if (user.locale) {
      embed.addField("Locale", user.locale, true);
    }
    embed.addField("Partial", user.partial ? "Yes" : "No", true);
    embed.addField("Bannable", user.presence.member.bannable ? "Yes" : "No", true);
    embed.addField("Kickable", user.presence.member.kickable ? "Yes" : "No", true);
    embed.addField("Manageable", user.presence.member.manageable ? "Yes" : "No", true);
    embed.addField("Joined At", user.presence.member.joinedAt.toLocaleString(), true);
    if (user.presence.member.nickname) {
      embed.addField("Nickname", user.presence.member.nickname, true);
    }
    embed.addField("Premium Since", user.presence.member.premiumSince ? user.presence.member.premiumSince.toLocaleString() : "Not Premium", true);
    embed.addField("Roles", user.presence.member.roles.cache.map(role => `<@&${role.id}>`).join(", "), true);
    embed.setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL());
    embed.setTimestamp();

    message.channel.send(embed);
  }
}

export default PingCommandHandler;