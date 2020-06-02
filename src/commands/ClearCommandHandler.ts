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
import CommandHandler from './CommandHandler';

class ClearCommandHandler extends CommandHandler {
  handler = async () => {
    const deletedMessage = await this._message.channel.bulkDelete(this._payload.args.amount);
    const message: Message = <Message>await this.send(`Successfully deleted ${deletedMessage.size} messages !`);
    message.delete(5000);
  }
}

export default ClearCommandHandler;