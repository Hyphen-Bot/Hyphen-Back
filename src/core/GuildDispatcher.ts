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

import { Client, Guild, GuildChannel } from 'discord.js';
import { EventEmitter } from 'events';
import { container } from 'tsyringe';
import EventHandler from './EventHandler';
import { Logger } from '../utils';
import MessageEventHandler from './MessageEventHandler';
import { GuildService } from '../db';
import { GuildEntity } from '../db/entity';
import ChannelCreateEventHandler from './ChannelCreateEventHandler';
import ApiEventHandler from './ApiEventHandler';
import MessageDeleteEventHandler from './MessageDeleteEventHandler';

class GuildDispatcher {

  static connectGuild(client: Client, guild: Guild, apiEventEmitter: EventEmitter) {
    new GuildDispatcher(client, guild, apiEventEmitter).setupClientStack();
  }

  _client: Client;
  _guild: Guild;
  _apiEventEmitter: EventEmitter;

  _guildService: GuildService;

  _eventHandlers: Array<EventHandler>;

  constructor(client: Client, guild: Guild, apiEventEmitter: EventEmitter) {
    this._client = client;
    this._guild = guild;
    this._apiEventEmitter = apiEventEmitter;
    this._eventHandlers = [];
    this._guildService = container.resolve(GuildService);
  }

  setupClientStack = async () => {
    Logger.info(`Setting up guild ${this._guild.id}...`);

    // initialize guild
    await this._initializeGuild(await this._guildService.getGuild(this._guild.id));

    // create child handlers
    this._eventHandlers.push(new MessageEventHandler(this._client, this._guild, this._apiEventEmitter));
    this._eventHandlers.push(new ChannelCreateEventHandler(this._client, this._guild, this._apiEventEmitter));
    this._eventHandlers.push(new ApiEventHandler(this._client, this._guild, this._apiEventEmitter));
    this._eventHandlers.push(new MessageDeleteEventHandler(this._client, this._guild, this._apiEventEmitter));
  }

  _initializeGuild = async (guild: GuildEntity) => {
    try {
      // initialize db table
      if (!guild) {
        Logger.info(`Creating guild ${this._guild.id}...`);
        guild = await this._guildService.addGuild(this._guild.id, "en");
      }

      // initialize roles
      if (!guild.mutedRoleId) {
        Logger.info(`Adding Muted role to guild ${this._guild.id}...`);
        const position = this._guild.member(this._client.user).roles.highest.position - 1;
        const { id } = await this._guild.roles.create({ data: { name: "Muted", permissions: 0, position }, reason: "Initialize muted role." });
        await this._guildService.setGuildMutedRoleId(this._guild.id, id);
        this._guild.channels.cache.forEach(async (channel: GuildChannel) => {
          await channel.overwritePermissions([{ id, deny: ["SEND_MESSAGES", "SPEAK"] }], "Deny muted role to speak / write in channels.");
        });
      }

      // initialize channels
      if (!guild.logChannelId) {
        Logger.info(`Adding log channel to guild ${this._guild.id}...`);
        const { id } = await this._guild.channels.create("logs", { permissionOverwrites: [{ id: this._guild.roles.everyone.id, deny: ["SEND_MESSAGES", "VIEW_CHANNEL"] }], reason: "Initialized log channel.", topic: "This is Hyphen's log channel." });
        await this._guildService.setGuildLogChannelId(this._guild.id, id);
      }
    } catch (e) {
      Logger.error(e.message);
    }
  }
}

export default GuildDispatcher;