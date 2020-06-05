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
import * as moment from "moment";
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
    embed.setColor(user.presence.member.roles.color ? user.presence.member.roles.color.color : "#dbebff");
    embed.addField("🆔 __**USER ID**__", user.id, false);
    embed.addField("📆 __**ACCOUNT CREATION**__", moment(user.createdAt).format("DD/MM/YYYY"), false);
    if (user.locale) {
      embed.addField("🚩 __**LOCALE**__", user.locale, false);
    }
    embed.addField("🕑 __**JOINED AT**__", moment(user.presence.member.joinedAt).format("DD/MM/YYYY"), false);
    if (user.presence.member.nickname) {
      embed.addField("🧑 __**NICKNAME**__", user.presence.member.nickname, false);
    }
    embed.addField("⚜️ __**PREMIUM SINCE**__", user.presence.member.premiumSince ? moment(user.presence.member.premiumSince).format('DD/MM/YYYY') : "Not Premium", false);
    embed.addField("💯 __**ROLES**__", user.presence.member.roles.cache.map(role => `<@&${role.id}>`).join(", "), false);
    embed.setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL());
    embed.setTimestamp();

    message.channel.send(embed);
  }
}

export default PingCommandHandler;