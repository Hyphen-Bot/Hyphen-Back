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

import { RichEmbed, Message } from 'discord.js';
import { container } from 'tsyringe';
import * as moment from 'moment';
import CommandHandler from './CommandHandler';
import { WarnService } from '../db';
import Warn from '../db/entity/Warn';

class WarnsCommandHandler extends CommandHandler {

  _warnService: WarnService;

  constructor(message: Message, payload: any) {
    super(message, payload);

    this._warnService = container.resolve(WarnService);
  }

  handler = async () => {
    if (!this._payload.mentions[0].guild) throw new Error("Please mention a valid user !");

    const warns: Warn[] = await this._warnService.getUserWarnsByGuild(this._payload.mentions[0].user.id, this.guild.id);

    const embed = new RichEmbed()
      .setAuthor(`${this._payload.mentions[0].user.tag}'s warns`, this._payload.mentions[0].user.avatarURL)
      .setColor("#f8cd65")
      .setThumbnail("https://cdn.discordapp.com/attachments/717011525105090661/717082034169970688/289673858e06dfa2e0e3a7ee610c3a30.png")
      .setFooter(`Requested by ${this.user.tag}`, this.user.avatarURL);

    for (const warn of warns.sort((a, b) => moment(b.createdAt).isSameOrBefore(moment(a.createdAt)) ? -1 : 1)) {
      const byMember = await this._message.guild.fetchMember(warn.byMember.discordUserId);
      embed.addField(moment(warn.createdAt).fromNow(), `${warn.reason}\n\`by ${byMember.user.tag}\``);
    }

    if (warns.length <= 0) {
      embed.setDescription("This user does not have any warns!");
    }
    
    await this.sendData(embed);
  }
}

export default WarnsCommandHandler;