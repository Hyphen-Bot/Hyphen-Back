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
import { WarnEntity, GuildEntity, MemberEntity } from './entity';
import Warn from './entity/Warn';

class WarnRepository {

  _warnRepository: Repository<WarnEntity>;
  _guildRepository: Repository<GuildEntity>;
  _memberRepository: Repository<MemberEntity>;

  constructor(connection: Connection) {
    this._warnRepository = connection.getRepository(WarnEntity);
    this._guildRepository = connection.getRepository(GuildEntity);
    this._memberRepository = connection.getRepository(MemberEntity);
  }

  async warnMember(id: string, byUserId: string, guildId: string, reason: string) {
    const member = await this._memberRepository.findOne(id);
    const byMember = await this._memberRepository.findOne(byUserId);
    const guild = await this._guildRepository.findOne(guildId);

    if (!member) {
      await this._memberRepository
    }

    const warn = new Warn();
    warn.member = member;
    warn.byMember = byMember;
    warn.guild = guild;
    warn.reason = reason;

    return this._warnRepository.save(warn);
  }

  async getUserWarns(userId: string) {
    return this._warnRepository.find({ where: { member: { id: userId } }, relations: ["member", "byMember"] });
  }
}

export default WarnRepository;
