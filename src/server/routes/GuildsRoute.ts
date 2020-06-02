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

import { Guild, Permissions } from 'discord.js';
import Route from "./Route";
import DiscordApiClient from '../DiscordApiClient';

class GuildsRoute extends Route {

  setup() {
      this._router.get('/', async (req, res) => {
          try {
              const guilds = await DiscordApiClient.getGuilds(req.token);

              // message present => error
              if (guilds.message) throw new Error(JSON.stringify(guilds));

              const tmp = [];
              guilds.forEach((guild: Guild) => {
                  if (this._client.guilds.find(g => g.id === guild.id)) {
                      if (guild.me.permissions.hasPermission(Permissions.FLAGS.ADMINISTRATOR)) {
                          tmp.push(guild);
                      }
                  }
              });
  
              return res.json(tmp);
          } catch (e) {
              return res.json(JSON.parse(e.message));
          }
      });

      return this._router;
  }
}

export default GuildsRoute;