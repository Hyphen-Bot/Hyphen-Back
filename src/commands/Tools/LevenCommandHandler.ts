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
import * as leven from "leven";
import CommandHandler from '../CommandHandler';
import { CommandType } from '../CommandType';
import { Commands } from '../Commands';

class LevenCommandHandler extends CommandHandler<LevenCommandHandler> {

  constructor() {
    super({
      command: Commands.LEVEN,
      type: CommandType.TOOLS,
      arguments: ["word1", "word2"],
      description: "Calculates the levenshtein distance between two words."
    });
  }

  handler = async (message: Message, payload: any) => {
    const { word1, word2 } = payload.args;
    const embed = new MessageEmbed();
    embed.setTitle("🗺 Levenshtein distance");
    embed.addField("Words", word1 + ", " + word2);
    embed.addField("Distance", leven(word1, word2));

    message.channel.send(embed);
  }
}

export default LevenCommandHandler;