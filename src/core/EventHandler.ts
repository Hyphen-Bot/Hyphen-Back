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

import { Client, Guild, Message } from 'discord.js';
import { EventEmitter } from 'events';
import Command from '../commands/CommandDispatcher';

class EventHandler {
  
  _client: Client;
  _guild: Guild;
  _apiEventEmitter: EventEmitter;

  _commands: Array<Command>;

  _messageListeners: any;

  constructor(client: Client, guild: Guild, apiEventEmitter: EventEmitter) {
    this._client = client;
    this._guild = guild;
    this._apiEventEmitter = apiEventEmitter;
    this._commands = [];
    this._messageListeners = {};
  }

  _messageListener = (message: Message, listener: (message: Message) => void) => {
    if (message.guild.id === this._guild.id) {
      listener(message);
    }
  }

  onMessage = (name: string, listener: (message: Message) => void) => {
    const messageListener = (message: Message) => this._messageListener(message, listener);
    if (this._messageListeners[name]) {
      this.destroyMessageListener(name);
    }
    this._messageListeners[name] = messageListener;
    this._client.on("message", messageListener);
  }

  destroyMessageListener = (name: string) => {    
    this._client.removeListener("message", this._messageListeners[name]);
    delete this._messageListeners[name];
  }
}

export default EventHandler;