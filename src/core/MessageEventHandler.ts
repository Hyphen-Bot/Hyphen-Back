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

import { Guild, Client, Message, Permissions, RichEmbed } from 'discord.js';
import { container } from 'tsyringe';
import EventHandler from "./EventHandler";
import { PingCommandHandler, Command, RankCommandHandler, WarnCommandHandler, WarnsCommandHandler, PunchCommandHandler, MuteCommandHandler, UnmuteCommandHandler } from '../commands';
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
    this._commands.push(new Command("warns", ["member"], [Permissions.FLAGS.ADMINISTRATOR], this.onMessage, WarnsCommandHandler));
    this._commands.push(new Command("mute", ["member", "reason"], [Permissions.FLAGS.ADMINISTRATOR], this.onMessage, MuteCommandHandler));
    this._commands.push(new Command("unmute", ["member"], [Permissions.FLAGS.ADMINISTRATOR], this.onMessage, UnmuteCommandHandler));
    this._commands.push(new Command("punch", ["member"], [], this.onMessage, PunchCommandHandler))
  }

  _handleNewMessage = async (message: Message) => {
    await this._memberService.addMember(message.author.id, this._guild.id, "en");
    await this._memberService.increaseXpAmount(message.author.id, this._guild.id);

    if (message.content.startsWith(process.env.BOT_PREFIX + "help")) {
      return this._handleGenerateAndSendHelp(message);
    }
  }

  _handleGenerateAndSendHelp = async (message: Message) => {
    const embed = new RichEmbed()
      .setTitle("All commands enabled on this guild")
      .setDescription(`Format : \`${process.env.BOT_PREFIX}command <argument1> <argument2>...\``)
      .setColor("#3467eb")
      .setThumbnail("https://cdn.discordapp.com/attachments/717308535020584966/717308958599151666/--3.png")
      .setFooter(`Requested by ${message.author.tag}`, message.author.avatarURL);

    this._commands.forEach((command: Command) => {
      const permissionNames = Object.keys(Permissions.FLAGS);
      const permissionValues = Object.values(Permissions.FLAGS);
      embed.addField(
        `${process.env.BOT_PREFIX}${command.command} ${command.args.map(arg => `<${arg}>`).join(" ")}`, 
        `Perms allowed : ${command.allowedPermissionFlags.length <= 0 ? "ALL" : command.allowedPermissionFlags.map(flag => permissionNames[permissionValues.indexOf(flag)]).join(" ")}`
      );
    });
    
    await message.channel.send(embed);
  }
}

export default MessageEventHandler;