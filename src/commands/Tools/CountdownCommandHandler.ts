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
import { CommandException } from '../../exceptions';

class CountdownCommandHandler extends CommandHandler<CountdownCommandHandler> {

  constructor() {
    super({
      command: Commands.COUNTDOWN,
      type: CommandType.TOOLS,
      arguments: ["seconds"],
      description: "Starts a countdown from the given time to zero."
    });
  }

  handler = async (message: Message, payload: any) => {
    if (isNaN(parseInt(payload.args.seconds))) throw new CommandException("Please write a valid number.");

    const msg = await message.channel.send(`${payload.args.seconds} seconds !`);

    let round = 1;
    const interval = setInterval(async () => {
      await msg.edit(`${parseInt(payload.args.seconds) - round} seconds !`);
      round++;
    }, 1000);
    setTimeout(async () => {
      clearInterval(interval);
      await msg.edit(`Countdown finished !`);
    }, parseInt(payload.args.seconds) * 1000)
  }
}

export default CountdownCommandHandler;