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

import { Message } from 'discord.js';
import CommandHandler from '../CommandHandler';
import { CommandType } from '../CommandType';
import { Commands } from '../Commands';

class ClearCommandHandler extends CommandHandler<ClearCommandHandler> {

  constructor() {
    super({
      command: Commands.CLEAR,
      type: CommandType.MODERATION,
      arguments: ["amount"],
      description: "Clears a specific amount of messages in the channel."
    });
  }

  handler = async (message: Message, payload: any) => {
    await message.delete();
    const deletedMessage = await message.channel.bulkDelete(payload.args.amount);
    const msg: Message = <Message>await message.channel.send(`Successfully cleared ${deletedMessage.size} messages !`);
    msg.delete({ timeout: 2000 });
  }
}

export default ClearCommandHandler;