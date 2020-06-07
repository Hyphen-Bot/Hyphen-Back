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
import { sha1, sha256, sha384, sha512 } from "crypto-hash";
import CommandHandler from '../CommandHandler';
import { CommandType } from '../CommandType';
import { Commands } from '../Commands';
import { CommandException } from '../../exceptions';

class HashCommandHandler extends CommandHandler<HashCommandHandler> {

  constructor() {
    super({
      command: Commands.HASH,
      type: CommandType.TOOLS,
      arguments: ["type", "text"],
      description: "Hash any text ! Type can be sha1, sha256, sha384 or sha512"
    });
  }

  handler = async (message: Message, payload: any) => {
    const { type, text } = payload.args;
    const embed = new MessageEmbed();

    embed.setTitle("🔑 Text hashed using " + type);
    embed.addField("Original text", text);

    switch (type) {
      case "sha1": {
        embed.addField("Hashed text", await sha1(text));
      }
      break;

      case "sha256": {
        embed.addField("Hashed text", await sha256(text));
      }
      break;

      case "sha384": {
        embed.addField("Hashed text", await sha384(text));
      }
      break;

      case "sha512": {
        embed.addField("Hashed text", await sha512(text));
      }
      break;

      default: throw new CommandException("Type should be one of : sha1, sha256, sha328 or sha512 !");
    }

    message.channel.send(embed);
  }
}

export default HashCommandHandler;