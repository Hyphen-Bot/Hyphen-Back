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
import { GuildService } from '../../db';

class MuteCommandHandler extends CommandHandler {

  _guildService: GuildService;

  constructor(message: Message, payload: any) {
    super(message, payload);

    this._guildService = container.resolve(GuildService);
  }

  handler = async () => {
    if (!this._payload.mentions[0].guild) throw new Error("Please mention a valid user !");

    const reason = this._payload.args.reason ? this._payload.args.reason : "No reason provided!";

    const mutedRoleId = (await this._guildService.getGuild(this.guild.id)).mutedRoleId;
    await this.guild.member(this._payload.mentions[0].user.id).roles.add(mutedRoleId);

    const embed = new MessageEmbed()
      .setAuthor(`Successfully muted ${this._payload.mentions[0].user.tag}`, this._payload.mentions[0].user.avatarURL)
      .setFooter(`Muted by ${this.user.tag}`)
      .addField("Reason", reason);
    
    await this.sendData(embed);
  }
}

export default MuteCommandHandler;