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

import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn } from "typeorm";
import Member from './Member';
import Guild from './Guild';

@Entity()
export default class Warn {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(type => Guild, guild => guild.warns)
    guild: Guild;

    @ManyToOne(type => Member, member => member.receivedWarns)
    member: Member;

    @ManyToOne(type => Member, member => member.emittedWarns)
    byMember: Member;

    @Column()
    reason: string;

    @CreateDateColumn()
    createdAt: Date;
}