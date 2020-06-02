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

import { Entity, Column, OneToMany, CreateDateColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import Warn from './Warn';
import Guild from './Guild';

@Entity()
export default class Member {

    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    discordUserId: string;

    @ManyToOne(type => Guild, guild => guild.members)
    guild: Guild;

    @OneToMany(type => Warn, warn => warn.member)
    receivedWarns: Warn[];

    @OneToMany(type => Warn, warn => warn.byMember)
    emittedWarns: Warn[];

    @Column({ default: 0 })
    xpAmount: number;

    @Column()
    language: string;

    @CreateDateColumn()
    createdAt: Date;
}