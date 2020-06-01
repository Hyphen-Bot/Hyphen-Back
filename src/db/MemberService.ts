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
import { MemberEntity, GuildEntity } from './entity';

class MemberService {

  _memberRepository: Repository<MemberEntity>;
  _guildRepository: Repository<GuildEntity>;

  constructor(connection: Connection) {
    this._memberRepository = connection.getRepository(MemberEntity);
    this._guildRepository = connection.getRepository(GuildEntity);
  }

  async getMember(id: string) {
    return this._memberRepository.findOne(id);
  }

  async addMember(id: string, guildId: string, language: string): Promise<MemberEntity> {
    if (await this._memberRepository.count({ where: { id, guild: { id: guildId } } }) <= 0) {
      const guild = await this._guildRepository.findOne(guildId);

      const member = new MemberEntity();
      member.id = id;
      member.guild = guild;
      member.language = language;
      return this._memberRepository.save(member);
    }

    return this._memberRepository.findOne({ where: { id, guild: { id: guildId } } });
  }

  async increaseXpAmount(id: string) {
    const member = await this._memberRepository.findOne({ id });
    member.xpAmount++;
    return this._memberRepository.save(member);
  }

  async getXpAmount(id: string) {
    return (await this._memberRepository.findOne({ id })).xpAmount;
  }

}

export default MemberService;
