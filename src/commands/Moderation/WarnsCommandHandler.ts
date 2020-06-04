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

import { MessageEmbed, Message } from 'discord.js';
import { container } from 'tsyringe';
import * as moment from 'moment';
import CommandHandler from '../CommandHandler';
import { WarnService } from '../../db';
import Warn from '../../db/entity/Warn';
import { CommandType } from '../CommandType';
import { Commands } from '../Commands';

class WarnsCommandHandler extends CommandHandler<WarnsCommandHandler> {

  _warnService: WarnService;

  constructor() {
    super({
      command: Commands.WARNS,
      type: CommandType.MODERATION,
      arguments: ["member"],
      description: "Show users's warns. If member is not specified, it will show your own warns."
    });

    this._warnService = container.resolve(WarnService);
  }

  handler = async (message: Message, payload: any) => {
    const user = (payload.mentions && payload.mentions[0].guild) ? payload.mentions[0].user : message.author;
    const warns: Warn[] = await this._warnService.getUserWarnsByGuild(user.id, message.guild.id);

    const embed = new MessageEmbed()
      .setAuthor(`${user.tag}'s warns`, user.avatarURL)
      .setColor("#f8cd65")
      .setThumbnail("https://cdn.discordapp.com/attachments/717011525105090661/717082034169970688/289673858e06dfa2e0e3a7ee610c3a30.png")
      .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL());

    for (const warn of warns.sort((a, b) => moment(b.createdAt).isSameOrBefore(moment(a.createdAt)) ? -1 : 1)) {
      const byMember = await message.guild.members.resolve(warn.byMember.discordUserId);
      embed.addField(moment(warn.createdAt).fromNow(), `${warn.reason}\n\`by ${byMember.user.tag}\``);
    }

    if (warns.length <= 0) {
      embed.setDescription("This user does not have any warns!");
    }
    
    await message.channel.send(embed);
  }
}

export default WarnsCommandHandler;