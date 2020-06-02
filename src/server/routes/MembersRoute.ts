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

import { Client } from 'discord.js';
import { container } from 'tsyringe';
import Route from "./Route";
import { MemberService } from '../../db';

class MembersRoute extends Route {

  _memberService: MemberService;

  constructor(client: Client) {
    super(client);

    this._memberService = container.resolve(MemberService);
  }

  setup() {
      this._router.get('/xp', async (req, res) => {
          try {
            if (!req.query.guildId) throw new Error(JSON.stringify({ error: true, message: "Please provide a guildId querystring !" }));
            
            let members: Array<any> = (await this._memberService.getAllGuildMembers(req.query.guildId.toString())).map(member => ({
              username: this._client.users.find(user => user.id === member.discordUserId).tag,
              xpAmount: member.xpAmount,
            }));

            members.sort((a, b) => b.xpAmount > a.xpAmount ? 1 : -1);
            
            return res.json(members);
          } catch (e) {
            return res.send(e.message);
          }
      });

      return this._router;
  }
}

export default MembersRoute;