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
import CommandHandler from './CommandHandler';
import { WarnService, MemberService } from '../db';

class WarnCommandHandler extends CommandHandler {

  _warnService: WarnService;
  _memberService: MemberService;

  constructor(message: Message, payload: any) {
    super(message, payload);

    this._warnService = container.resolve(WarnService);
    this._memberService = container.resolve(MemberService);
  }

  handler = async () => {
    if (!this._payload.mentions[0].guild) throw new Error("Please mention a valid user !");

    const reason = this._payload.args.reason ? this._payload.args.reason : "No reason provided!";

    const member = await this._memberService.getGuildMemberByDiscordId(this._payload.mentions[0].user.id, this.guild.id);
    if (!member) {
      await this._memberService.addMember(this._payload.mentions[0].user.id, this._message.guild.id, "en");
    }

    await this._warnService.warnMember(this._payload.mentions[0].user.id, this.user.id, this._message.guild.id, reason);

    const embed = new MessageEmbed()
      .setAuthor(`Successfully warned ${this._payload.mentions[0].user.tag}`, this._payload.mentions[0].user.avatarURL)
      .setColor("#f8cd65")
      .setThumbnail("https://cdn.discordapp.com/attachments/717011525105090661/717082034169970688/289673858e06dfa2e0e3a7ee610c3a30.png")
      .setFooter(`Warned by ${this.user.tag}`)
      .addField("Reason", reason);
    
    await this.sendData(embed);
  }
}

export default WarnCommandHandler;