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
import { CommandType } from './CommandType';
import { Logger } from '../utils';
import { Commands } from './Commands';
import { CommandException } from '../exceptions';

class CommandMetadata {
  public command: Commands;
  public description?: string;
  public type: CommandType;
  public usage?: string;
  public arguments?: Array<string> = [];

  public constructor(init?:Partial<CommandMetadata>) {
      Object.assign(this, init);
  }
}

class CommandHandler<T> {

  private _metadata: CommandMetadata;

  constructor(metadata: CommandMetadata) {
    this._metadata = metadata;
  }

  /**
   * Default handler wrapper, responsible for error catching
   */
  handle = async (message: Message, payload: any) => {
    try {
      await this.handler(message, payload);
    } catch (e) {
      if (e instanceof CommandException) {
        message.channel.send(e.message);
      } else {
        Logger.error(e);
      }
    }
  }

  /**
   * Public handler, this is the main command runtime
   */
  handler = async (message: Message, payload: any) => {
    // nothing
  }
  
  /**
   * Get the command metadata
   */
  get metadata(): CommandMetadata {
    return this._metadata;
  }
}

export default CommandHandler;