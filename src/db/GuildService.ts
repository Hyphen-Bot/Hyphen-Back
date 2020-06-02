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

import { Connection, Repository } from 'typeorm';
import { GuildEntity } from './entity';

class GuildService {

  _guildRepository: Repository<GuildEntity>;

  constructor(connection: Connection) {
    this._guildRepository = connection.getRepository(GuildEntity);
  }

  async getGuild(id: string): Promise<GuildEntity> {
    return this._guildRepository.findOne(id);
  }

  async getAllGuilds(): Promise<Array<GuildEntity>> {
    return this._guildRepository.find();
  }

  async addGuild(id: string, language: string): Promise<GuildEntity> {
    if (await this._guildRepository.count({ where: { id } }) <= 0) {
      const guild = new GuildEntity();
      guild.id = id;
      guild.language = language;
      return this._guildRepository.save(guild);
    }

    return this._guildRepository.findOne({ where: { id } });
  }

  async setGuildMutedRoleId(id: string, roleId: string) {
    const guild = await this.getGuild(id);
    guild.mutedRoleId = roleId;
    return this._guildRepository.save(guild);
  }

}

export default GuildService;
