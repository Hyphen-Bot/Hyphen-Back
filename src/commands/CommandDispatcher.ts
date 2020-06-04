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
import CommandHandler from './CommandHandler';

class CommandDispatcher {

  private _handler: CommandHandler<any>;
  private _allowedPermissionFlags: Array<number>;
  private _onMessage: (name: string, listener: (message: Message) => void) => void;

  // command metadata
  private _command: string;
  private _args: Array<string>;
  private _type: CommandType;
  private _description: string;
  private _usage: string;

  constructor(handler: CommandHandler<any>, allowedPermissionFlags: Array<number>, onMessage: (name: string, listener: (message: Message) => void) => void) {
    // @ts-ignore
    this._handler = new handler();
    this._allowedPermissionFlags = allowedPermissionFlags;
    this._onMessage = onMessage;

    this._command = this._handler.metadata.command;
    this._args = this._handler.metadata.arguments;
    this._type = this._handler.metadata.type;
    this._description = this._handler.metadata.description;
    this._usage = this._handler.metadata.usage;

    // start handler
    this._init();
  }

  /**
   * default command listener & parser
   */
  private _init = () => {
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
          this._handler.handle(message, { args, mentions: message.mentions.members.array() });
        }
      } else {
        if (message.content === command) {

          // return without arguments
          if (!isUserAllowed) return message.channel.send(`Missing permissions ! Allowed: ${this._allowedPermissionFlags.length <= 0 ? "ALL" : this._allowedPermissionFlags.map(flag => permissionNames[permissionValues.indexOf(flag)]).join(", ")}`);
          this._handler.handle(message, {});
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

  get description(): string {
    return this._description;
  }

  get usage(): string {
    return this._usage;
  }
}

export default CommandDispatcher;