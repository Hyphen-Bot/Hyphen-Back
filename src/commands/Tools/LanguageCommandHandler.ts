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
import * as franc from "franc";
import CommandHandler from '../CommandHandler';
import { CommandType } from '../CommandType';
import { Commands } from '../Commands';

class PhoneticCommandHandler extends CommandHandler<PhoneticCommandHandler> {

  constructor() {
    super({
      command: Commands.LANGUAGE,
      type: CommandType.TOOLS,
      arguments: ["text"],
      description: "Returns the texts language."
    });
  }

  handler = async (message: Message, payload: any) => {
    message.channel.send(`This text is written in ${franc(payload.args.text)} !`);
  }
}

export default PhoneticCommandHandler;