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

import { MessageEmbed } from 'discord.js';
import fetch from "node-fetch";
import CommandHandler from './CommandHandler';
import { Color } from '../utils';

class KissCommandHandler extends CommandHandler {
  handler = async () => {
    const response = await fetch('https://neko-love.xyz/api/v1/kiss');
    const json = await response.json();

    const target = this._payload.mentions ? this._payload.mentions[0].user.username : this.user.username;
    
    const embed = new MessageEmbed()
      .setAuthor(`${this.user.username} kissed ${target} 💋`, this.user.displayAvatarURL())
      .setColor(Color.random())
      .setImage(json.url);

    await this.sendData(embed);
  }
}

export default KissCommandHandler;