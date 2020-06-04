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
import { TempMuteCommandHandler, CommandType, Commands } from '..';

class MuteCommandHandler extends CommandHandler<TempMuteCommandHandler> {

  _guildService: GuildService;

  constructor() {
    super({
      command: Commands.TEMPMUTE,
      type: CommandType.MODERATION,
      arguments: ["member", "timeoutMn", "reason"],
      description: "Temporary mute a member on the server. Timeout's default is 10 minutes, and the reason is optional."
    });

    this._guildService = container.resolve(GuildService);
  }

  handler = async (message: Message, payload: any) => {
    if (!payload.mentions[0].guild) throw new Error("Please mention a valid user !");

    const reason = payload.args.reason ? payload.args.reason : "No reason provided!";
    const timeoutMs = payload.args.timeoutMn ? payload.args.timeoutMn * 60 * 1000 : 10 * 60 * 1000;

    const mutedRoleId = (await this._guildService.getGuild(message.guild.id)).mutedRoleId;
    await message.guild.member(payload.mentions[0].user.id).roles.add(mutedRoleId);

    setTimeout(async () => {
      await message.guild.member(payload.mentions[0].user.id).roles.remove(mutedRoleId);
    }, timeoutMs);

    const embed = new MessageEmbed()
      .setAuthor(`Successfully muted ${payload.mentions[0].user.tag} for ${payload.args.timeoutMn} minute(s) !`, payload.mentions[0].user.avatarURL)
      .setFooter(`Muted by ${message.author.tag}`)
      .addField("Reason", reason);
    
    await message.channel.send(embed);
  }
}

export default MuteCommandHandler;