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
import { CommandType } from '../CommandType';
import { Commands } from '../Commands';

class UnmuteCommandHandler extends CommandHandler<UnmuteCommandHandler> {

  _guildService: GuildService;

  constructor() {
    super({
      command: Commands.UNMUTE,
      type: CommandType.MODERATION,
      arguments: ["member"],
      description: "Unmute a muted member on the server."
    });

    this._guildService = container.resolve(GuildService);
  }

  handler = async (message: Message, payload: any) => {
    if (!payload.mentions[0].guild) throw new Error("Please mention a valid user !");

    const mutedRoleId = (await this._guildService.getGuild(message.guild.id)).mutedRoleId;
    await message.guild.member(payload.mentions[0].user.id).roles.remove(mutedRoleId);

    const embed = new MessageEmbed()
      .setAuthor(`📢 Successfully unmuted ${payload.mentions[0].user.tag}`, payload.mentions[0].user.displayAvatarURL({ dynamic: true }))
      .setFooter(`Unmuted by ${message.author.tag}`)
    
    await message.channel.send(embed);
  }
}

export default UnmuteCommandHandler;