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

import { Message, User, Attachment, MessageOptions, RichEmbed } from 'discord.js';

class CommandHandler {

  _message: Message;
  _payload: any;

  constructor(message: Message, payload: any) {
    this._message = message;
    this._payload = payload;
  }

  /**
   * Default handler wrapper, responsible for error catching
   */
  handle = async () => {
    try {
      await this.handler();
    } catch (e) {
      const embed = new RichEmbed()
        .setColor('#cc4137')
        .setTitle('An error occurred !')
        .setDescription(e.message)
      this.sendData(embed);
    }
  }

  /**
   * Public handler, this is the main command runtime
   */
  handler = async () => {
    // nothing
  }

  /**
   * Send a message with optional options in the current channel
   */
  send = async (message: string, options?: MessageOptions | RichEmbed | Attachment) => {
    await this._message.channel.send(message, options);
  }

  /**
   * Send a data message (Embed, Attachment etc...) to the current channel
   */
  sendData = async (options: MessageOptions | RichEmbed | Attachment) => {
    await this._message.channel.send(options);
  }

  /**
   * Get the current user (who triggered the command)
   */
  get user(): User {
    return this._message.author;
  }
}

export default CommandHandler;