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

import { Message, GuildMember } from 'discord.js';
import CommandHandler from '../CommandHandler';
import { CommandType } from '../CommandType';
import { Commands } from '../Commands';

class ClearCommandHandler extends CommandHandler<ClearCommandHandler> {

  constructor() {
    super({
      command: Commands.CLEAR,
      type: CommandType.MODERATION,
      arguments: ["amount", "toDelete"],
      usage: "<amount> <member / keyword>",
      description: "Clears a specific amount of messages in the channel. You can specify a member or a keyword."
    });
  }

  handler = async (message: Message, payload: any) => {
    await message.delete();

    let amount = 0;

    if (payload.args.toDelete) {
      if (payload.mentions[0]) {
        amount = (await message.channel.bulkDelete((await message.channel.messages.fetch()).filter(msg => msg.author.id === payload.mentions[0].id).first(payload.args.amount).map(msg => msg.id))).size;
      } else {
        amount = (await message.channel.bulkDelete((await message.channel.messages.fetch()).filter(msg => msg.content.includes(payload.args.toDelete)).first(payload.args.amount).map(msg => msg.id))).size;
      }
    } else {
      amount = (await message.channel.bulkDelete(payload.args.amount)).size;
    }

    message.channel.send(`Successfully cleared ${amount} messages !`).then(msg => {
      msg.delete({ timeout: 2000 });
    });
  }
}

export default ClearCommandHandler;