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

import { Client, Guild } from 'discord.js';
import { container } from 'tsyringe';
import EventHandler from './EventHandler';
import { Logger } from '../utils';
import MessageEventHandler from './MessageEventHandler';
import { GuildService } from '../db';

class GuildDispatcher {

  static connectGuild(client: Client, guild: Guild) {
    new GuildDispatcher(client, guild).setupClientStack();
  }

  _client: Client;
  _guild: Guild;

  _guildService: GuildService;

  _eventHandlers: Array<EventHandler>;

  constructor(client: Client, guild: Guild) {
    this._client = client;
    this._guild = guild;
    this._eventHandlers = [];
    this._guildService = container.resolve(GuildService);
  }

  setupClientStack() {
    Logger.info(`Setting up guild ${this._guild.id}...`);

    // initialize db table
    this._guildService.addGuild(this._guild.id, "en");

    // create child handlers
    this._eventHandlers.push(new MessageEventHandler(this._client, this._guild));
  }
}

export default GuildDispatcher;