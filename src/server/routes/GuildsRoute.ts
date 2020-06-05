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

import { Permissions, Client, Guild } from 'discord.js';
import { EventEmitter } from 'events';
import { container } from 'tsyringe';
import Route from "./Route";
import DiscordApiClient from '../DiscordApiClient';
import { MemberService, GuildService } from '../../db';

class GuildsRoute extends Route {

  _memberService: MemberService;
  _guildService: GuildService;

  constructor(client: Client, apiEventEmitter: EventEmitter) {
    super(client, apiEventEmitter);

    this._memberService = container.resolve(MemberService);
    this._guildService = container.resolve(GuildService);
  }

  setup() {
      /**
       * GET /
       */
      this._router.get('/', async (req, res) => {
          try {
              const guilds = await DiscordApiClient.getGuilds(req.token);

              // message present => error
              if (guilds.message) throw new Error(JSON.stringify(guilds));

              const tmp = [];
              guilds.forEach((guild: any) => {
                  if (this._client.guilds.resolve(guild.id)) {
                    if (guild.permissions === 2147483647) { // if is admin
                      tmp.push(guild);
                    }
                  }
              });
  
              return res.json(tmp);
          } catch (e) {
              return res.json(JSON.parse(e.message));
          }
      });

      /**
       * GET /{guild.id}/members
       */
      this._router.get('/:guildId/members', async (req, res) => {
        try {          
          let members: Array<any> = await Promise.all((await this._memberService.getAllGuildMembers(req.params.guildId.toString())).map(async member => {
            const user = await this._client.users.fetch(member.discordUserId);
            return {
              username: user.tag,
              avatarUrl: user.displayAvatarURL({ format: "png" }),
              xpAmount: member.xpAmount,
            }
          }));

          members.sort((a, b) => b.xpAmount > a.xpAmount ? 1 : -1);
          
          return res.json(members);
        } catch (e) {
          return res.send(e.message);
        }
      });

      /**
       * /{guild.id}/commands/{command}/{action}
       */
      this._router.put('/:guildId/commands/:command/:action', async (req, res) => {
        try {          
          const { guildId, command, action }: any = req.params;

          if (action !== "enable" && action !== "disable") throw new Error(JSON.stringify({ error: true, message: "Action can only be enable or disable !" }));

          if (action === "enable") {
            await this._guildService.enableCommand(guildId, command);
          } else if (action === "disable") {
            await this._guildService.disableCommand(guildId, command);
          }

          this._apiEventEmitter.emit("reloadCommands", { guildId });
          
          return res.json({ success: true });
        } catch (e) {
          return res.send(e.message);
        }
      });

      /**
       * /{guild.id}/features/{feature}/{action}
       */
      this._router.put('/:guildId/features/:feature/:action', async (req, res) => {
        try {          
          const { guildId, feature, action }: any = req.params;

          if (action !== "enable" && action !== "disable") throw new Error(JSON.stringify({ error: true, message: "Action can only be enable or disable !" }));

          if (action === "enable") {
            await this._guildService.enableFeature(guildId, feature);
          } else if (action === "disable") {
            await this._guildService.disableFeature(guildId, feature);
          }

          this._apiEventEmitter.emit("reloadFeatures", { guildId });
          
          return res.json({ success: true });
        } catch (e) {
          return res.send(e.message);
        }
      });

      /**
       * /{guild.id}/{channel.id}/send
       */
      this._router.post('/:guildId/:channelId/send', async (req, res) => {
        try {          
          const { guildId, channelId }: any = req.params;
          const { message }: any = req.body;

          this._apiEventEmitter.emit("sendMessage", { guildId, channelId, message });
          
          return res.json({ success: true });
        } catch (e) {
          return res.send(e.message);
        }
      });

       /**
       * /{guild.id}/enabledCommands
       */
      this._router.get('/:guildId/commands', async (req, res) => {
        try {          
          const { guildId }: any = req.params;

          const guild = await this._guildService.getGuild(guildId)
          
          return res.json(JSON.parse(guild.enabledCommands));
        } catch (e) {
          return res.send(e.message);
        }
      });

      /**
       * /{guild.id}/enabledFeatures
       */
      this._router.get('/:guildId/features', async (req, res) => {
        try {          
          const { guildId }: any = req.params;

          const guild = await this._guildService.getGuild(guildId)
          
          return res.json(JSON.parse(guild.enabledFeatures));
        } catch (e) {
          return res.send(e.message);
        }
      });

      /**
       * /{guild.id}/enabledFeatures
       */
      this._router.get('/:guildId/channels', async (req, res) => {
        try {          
          const { guildId }: any = req.params;

          const guild: Guild = this._client.guilds.resolve(guildId);

          const channels = {};
          guild.channels.cache.array().forEach(channel => {
            const categoryName = channel.parent ? channel.parent.name : "Others";
            if (channel.type === "category" || channel.type === "voice") return;
            if (channels[categoryName]) {
              channels[categoryName] = [
                ...channels[categoryName],
                {
                  id: channel.id,
                  name: channel.name
                }
              ];
            } else {
              channels[categoryName] = [
                {
                  id: channel.id,
                  name: channel.name
                }
              ];
            }
          });
          
          return res.json(channels);
        } catch (e) {
          return res.send(e.message);
        }
      });

      return this._router;
  }
}

export default GuildsRoute;