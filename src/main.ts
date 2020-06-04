/*
 * Copyright (c) 2019 Lucien Blunk-Lallet
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import { Client, Guild } from 'discord.js';
import "reflect-metadata";
import { createConnection, Connection } from "typeorm";
import { EventEmitter } from "events";
import { GuildEntity, MemberEntity, WarnEntity } from './db/entity';
import { Logger } from "./utils";
import { GuildDispatcher } from './core';
import { container } from 'tsyringe';
import { MemberService, GuildService, WarnService } from './db';
import { Server } from './server';

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

process.env.TZ = "UTC";

createConnection({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [
    GuildEntity,
    MemberEntity,
    WarnEntity
  ],
  synchronize: true,
}).then((connection: Connection) => {
  // setup repositories
  container.registerInstance<GuildService>(GuildService, new GuildService(connection));
  container.registerInstance<MemberService>(MemberService, new MemberService(connection));
  container.registerInstance<WarnService>(WarnService, new WarnService(connection));

  // setup client
  const client = new Client();

  // setup api / bot eventemitter
  const apiEventEmitter = new EventEmitter();

  // start rest server
  new Server(client, apiEventEmitter).start();

  // setup listeners
  client.on("ready", () => {
    Logger.info("Setting up guilds...");
    client.guilds.cache.forEach((guild: Guild) => GuildDispatcher.connectGuild(client, guild, apiEventEmitter));
    client.user.setPresence({ activity: { name: client.guilds.cache.size + " servers.", type: "WATCHING", url: "http://142.93.173.241:3000" } });
  });

  client.on("guildCreate", (guild: Guild) => {
    Logger.info(`Client joined guild ${guild.id}. Setting up...`);
    GuildDispatcher.connectGuild(client, guild, apiEventEmitter);
    client.user.setPresence({ activity: { name: client.guilds.cache.size + " servers.", type: "WATCHING", url: "http://142.93.173.241:3000" } });
  });

  // login client
  client.login(process.env.BOT_TOKEN).then(() => Logger.info(`Logged in as ${client.user.tag} !`));
}).catch(error => Logger.error(error));
