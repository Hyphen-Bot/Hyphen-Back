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

import { Message, MessageAttachment } from 'discord.js';
import * as QRCode from "qrcode";
import CommandHandler from '../CommandHandler';
import { CommandType } from '../CommandType';
import { Commands } from './../Commands';

class QRCodeCommandHandler extends CommandHandler<QRCodeCommandHandler> {

  constructor() {
    super({
      command: Commands.QRCODE,
      type: CommandType.TOOLS,
      arguments: ["text"],
      description: "Generates a QR code."
    });
  }

  handler = async (message: Message, payload: any) => {
    const dataUrl = await QRCode.toDataURL(payload.args.text);
    const matches = dataUrl.match(/^data:.+\/(.+);base64,(.*)$/);
    const attachment = new MessageAttachment(Buffer.from(matches[2], 'base64'));
    await message.channel.send(attachment);
  }
}

export default QRCodeCommandHandler;