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
import * as moment from "moment";
import CommandHandler from '../CommandHandler';
import { CommandType } from '../CommandType';
import { Commands } from './../Commands';

class PingCommandHandler extends CommandHandler<PingCommandHandler> {

  constructor() {
    super({
      command: Commands.PING,
      type: CommandType.COMMON
    });
  }

  handler = async (message: Message, payload: any) => {
    const msg: Message = <Message>await message.channel.send(`Calculating...`);
    await msg.edit(Math.abs(moment(msg.createdTimestamp).milliseconds() - moment(message.createdTimestamp).milliseconds()) + " ms");
  }
}

export default PingCommandHandler;