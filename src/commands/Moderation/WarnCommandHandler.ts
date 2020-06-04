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
import CommandHandler from '../CommandHandler';
import { WarnService, MemberService } from '../../db';
import { CommandType } from '../CommandType';
import { Commands } from '../Commands';

class WarnCommandHandler extends CommandHandler<WarnCommandHandler> {

  _warnService: WarnService;
  _memberService: MemberService;

  constructor() {
    super({
      command: Commands.WARN,
      type: CommandType.MODERATION,
      arguments: ["member", "reason"],
      description: "Warn a member on the server. Reason is optional."
    });

    this._warnService = container.resolve(WarnService);
    this._memberService = container.resolve(MemberService);
  }

  handler = async (message: Message, payload: any) => {
    if (!payload.mentions[0].guild) throw new Error("Please mention a valid user !");

    const reason = payload.args.reason ? payload.args.reason : "No reason provided!";

    const member = await this._memberService.getGuildMemberByDiscordId(payload.mentions[0].user.id, message.guild.id);
    if (!member) {
      await this._memberService.addMember(payload.mentions[0].user.id, message.guild.id, "en");
    }

    await this._warnService.warnMember(payload.mentions[0].user.id, message.author.id, message.guild.id, reason);

    const embed = new MessageEmbed()
      .setAuthor(`Successfully warned ${payload.mentions[0].user.tag}`, payload.mentions[0].user.avatarURL)
      .setColor("#f8cd65")
      .setThumbnail("https://cdn.discordapp.com/attachments/717011525105090661/717082034169970688/289673858e06dfa2e0e3a7ee610c3a30.png")
      .setFooter(`Warned by ${message.author.tag}`)
      .addField("Reason", reason);
    
    await message.channel.send(embed);
  }
}

export default WarnCommandHandler;