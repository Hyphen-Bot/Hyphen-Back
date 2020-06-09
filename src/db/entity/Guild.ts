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

import { Entity, CreateDateColumn, PrimaryColumn, OneToMany, Column } from "typeorm";
import Member from './Member';
import Warn from './Warn';

@Entity()
export default class Guild {

    @PrimaryColumn()
    id: string;

    @Column()
    language: string;

    @OneToMany(type => Member, member => member.guild)
    members: Member[];

    @OneToMany(type => Warn, warn => warn.guild)
    warns: Warn[];

    @Column({ default: "[]" })
    enabledCommands: string;

    @Column({ default: "[]" })
    enabledFeatures: string;

    @Column({ nullable: true })
    mutedRoleId: string;

    @Column({ nullable: true })
    logChannelId: string;

    @CreateDateColumn()
    createdAt: Date;
}