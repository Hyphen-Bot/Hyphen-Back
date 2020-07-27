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

import { Message, TextChannel } from 'discord.js';
import CommandHandler from '../CommandHandler';
import { CommandType } from '../CommandType';
import { Commands } from './../Commands';

class SayCommandHandler extends CommandHandler<SayCommandHandler> {

  constructor() {
    super({
      command: Commands.SAY,
      type: CommandType.COMMON,
      arguments: ["channel", "message"],
      description: "Say a message in any channel."
    });
  }

  handler = async (message: Message, payload: any) => {
    const channel: TextChannel = <TextChannel>message.guild.channels.resolve(payload.args.channel.match(/[0-9]+/g)[0]);
    if (!channel) throw new Error("Unrecognized channel !");

    await message.delete();
    await channel.send(payload.args.message);

    await message.channel.send("Done !").then(msg => msg.delete({ timeout: 1500 }));
  }
}

export default SayCommandHandler;