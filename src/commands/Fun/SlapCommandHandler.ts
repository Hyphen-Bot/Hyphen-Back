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
import fetch from "node-fetch";
import CommandHandler from '../CommandHandler';
import { Color } from '../../utils';
import { Commands } from '../Commands';
import { CommandType } from '../CommandType';

class SlapCommandHandler extends CommandHandler<SlapCommandHandler> {

  constructor() {
    super({
      command: Commands.PUNCH,
      type: CommandType.FUN,
      arguments: ["member"],
      description: "Slap someone !"
    });
  }

  handler = async (message: Message, payload: any) => {
    const response = await fetch('https://neko-love.xyz/api/v1/slap');
    const json = await response.json();

    const target = payload.mentions ? payload.mentions[0].user.username : message.author.username;
    
    const embed = new MessageEmbed()
      .setAuthor(`${message.author.username} slapped ${target} 🖐`, message.author.displayAvatarURL())
      .setColor(Color.random())
      .setImage(json.url);

    await message.channel.send(embed);
  }
}

export default SlapCommandHandler;