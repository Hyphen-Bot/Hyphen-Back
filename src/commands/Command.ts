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

import { Message, Permissions } from 'discord.js';
import { CommandType } from './CommandType';

class Command {

  _command: string;
  _args: Array<string>;
  _allowedPermissionFlags: Array<number>;
  _type: CommandType;
  _onMessage: (name: string, listener: (message: Message) => void) => void;
  _callback: any;

  constructor(command: string, args: Array<string>, allowedPermissionFlags: Array<number>, type: CommandType, onMessage: (name: string, listener: (message: Message) => void) => void, callback: any) {
    this._command = command;
    this._args = args;
    this._allowedPermissionFlags = allowedPermissionFlags;
    this._type = type;
    this._onMessage = onMessage;
    this._callback = callback;

    // start handler
    this._handler();
  }

  /**
   * default command listener & parser
   */
  _handler = () => {
    const command = process.env.BOT_PREFIX + this._command;

    // message listener
    this._onMessage(this._command, (message: Message) => {
      let isUserAllowed = false;

      // is user allowed?
      if (this._allowedPermissionFlags.length > 0) {
        this._allowedPermissionFlags.forEach(allowedPermissionFlag => {
          if (message.member.permissions.has(allowedPermissionFlag)) isUserAllowed = true;
        });
      } else {
        isUserAllowed = true;
      }

      const permissionNames = Object.keys(Permissions.FLAGS);
      const permissionValues = Object.values(Permissions.FLAGS);

      if (message.content.split(" ").length > 1) {
        if (message.content.startsWith(command + " ")) {
          const args = {};
          this._args.forEach((key, i) => {
            const arg = [...message.content.replace(command + " ", "").split(" ")][i];
            if (i === this._args.length - 1) {
              args[key] = arg ? message.content.substr(message.content.indexOf(arg), message.content.length) : undefined;
            } else {
              args[key] = arg;
            }
          });

          // return with arguments
          if (!isUserAllowed) return message.channel.send(`Missing permissions ! Allowed: ${this._allowedPermissionFlags.length <= 0 ? "ALL" : this._allowedPermissionFlags.map(flag => permissionNames[permissionValues.indexOf(flag)]).join(", ")}`);
          new this._callback(message, { args, mentions: message.mentions.members.array() }).handle();
        }
      } else {
        if (message.content === command) {

          // return without arguments
          if (!isUserAllowed) return message.channel.send(`Missing permissions ! Allowed: ${this._allowedPermissionFlags.length <= 0 ? "ALL" : this._allowedPermissionFlags.map(flag => permissionNames[permissionValues.indexOf(flag)]).join(", ")}`);
          new this._callback(message, {}).handle();
        }
      }
    });
  }

  get command(): string {
    return this._command;
  }

  get args(): Array<string> {
    return this._args;
  }

  get allowedPermissionFlags(): Array<number> {
    return this._allowedPermissionFlags;
  }

  get type(): CommandType {
    return this._type;
  }
}

export default Command;