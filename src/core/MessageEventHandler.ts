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

import { Guild, Client, Message, Permissions } from 'discord.js';
import { container } from 'tsyringe';
import EventHandler from "./EventHandler";
import { PingCommandHandler, Command, RankCommandHandler, WarnCommandHandler, WarnsCommandHandler } from '../commands';
import { MemberService } from '../db';

class MessageEventHandler extends EventHandler {

  _memberService: MemberService;

  constructor(client: Client, guild: Guild) {
    super(client, guild);

    this._memberService = container.resolve(MemberService);

    this._setupCommands();
    this.onMessage(this._handleNewMessage);
  }

  _setupCommands = () => {
    // all commands come here
    this._commands.push(new Command("ping", [], [], this.onMessage, PingCommandHandler));
    this._commands.push(new Command("rank", [], [], this.onMessage, RankCommandHandler));
    this._commands.push(new Command("warn", ["member", "reason"], [Permissions.FLAGS.ADMINISTRATOR], this.onMessage, WarnCommandHandler));
    this._commands.push(new Command("warns", ["member"], [Permissions.FLAGS.ADMINISTRATOR], this.onMessage, WarnsCommandHandler))
  }

  _handleNewMessage = async (message: Message) => {
    await this._memberService.addMember(message.author.id, this._guild.id, "en");
    await this._memberService.increaseXpAmount(message.author.id);
  }
}

export default MessageEventHandler;