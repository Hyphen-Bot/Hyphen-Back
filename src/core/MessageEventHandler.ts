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

import { Guild, Client, Message, Permissions, MessageEmbed } from 'discord.js';
import { container } from 'tsyringe';
import { EventEmitter } from 'events';
import EventHandler from "./EventHandler";
import { 
  Command, 
  Commands,
  CommandType,
  PingCommandHandler, 
  RankCommandHandler, 
  WarnCommandHandler, 
  WarnsCommandHandler, 
  PunchCommandHandler, 
  MuteCommandHandler, 
  UnmuteCommandHandler, 
  ClearCommandHandler,
  KissCommandHandler,
  SlapCommandHandler,
  ImageCommandHandler,
  TempMuteCommandHandler
} from '../commands';
import { MemberService, GuildService } from '../db';
import CommandHandler from '../commands/CommandHandler';

class MessageEventHandler extends EventHandler {

  _memberService: MemberService;
  _guildService: GuildService;

  constructor(client: Client, guild: Guild, apiEventEmitter: EventEmitter) {
    super(client, guild, apiEventEmitter);

    this._memberService = container.resolve(MemberService);
    this._guildService = container.resolve(GuildService);

    this._loadCommands();

    // listeners
    this.onMessage("main", this._handleNewMessage);
    this._apiEventEmitter.on("reloadCommands", this._handleReloadCommands);
  }

  _loadCommands = async () => {
    // initialize
    const commands = JSON.parse((await this._guildService.getGuild(this._guild.id)).enabledCommands);
    this._commands.forEach((command: Command) => {
      if (!commands.includes(command.command)) this._destroyCommand(command.command);
    });
    this._commands = [];

    // all commands come here
    if (commands.includes(Commands.PING)) this._enableCommand(PingCommandHandler, []);
    if (commands.includes(Commands.RANK)) this._enableCommand(RankCommandHandler, []);
    if (commands.includes(Commands.WARN)) this._enableCommand(WarnCommandHandler, [Permissions.FLAGS.ADMINISTRATOR]);
    if (commands.includes(Commands.WARNS)) this._enableCommand(WarnsCommandHandler, [Permissions.FLAGS.ADMINISTRATOR]);
    if (commands.includes(Commands.MUTE)) this._enableCommand(MuteCommandHandler, [Permissions.FLAGS.ADMINISTRATOR]);
    if (commands.includes(Commands.UNMUTE)) this._enableCommand(UnmuteCommandHandler, [Permissions.FLAGS.ADMINISTRATOR]);
    if (commands.includes(Commands.CLEAR)) this._enableCommand(ClearCommandHandler, [Permissions.FLAGS.ADMINISTRATOR]);
    if (commands.includes(Commands.PUNCH)) this._enableCommand(PunchCommandHandler, []);
    if (commands.includes(Commands.KISS)) this._enableCommand(KissCommandHandler, []);
    if (commands.includes(Commands.SLAP)) this._enableCommand(SlapCommandHandler, []);
    if (commands.includes(Commands.IMAGE)) this._enableCommand(ImageCommandHandler, []);

  }

  _handleReloadCommands = ({ guildId }: any) => {
    if (guildId === this._guild.id) {
      this._loadCommands();
    }
  }

  _handleNewMessage = async (message: Message) => {
    await this._memberService.addMember(message.author.id, this._guild.id, "en");
    await this._memberService.increaseXpAmount(message.author.id, this._guild.id);

    if (message.content.startsWith(process.env.BOT_PREFIX + "help")) {
      return this._handleGenerateAndSendHelp(message);
    }

    if (message.content.startsWith(process.env.BOT_PREFIX + "enable")) {
      if (this._commands.map(command => command.command).includes(message.content.split(" ")[1])) return message.channel.send("Command already enabled !");
      await this._guildService.enableCommand(this._guild.id, message.content.split(" ")[1]);
      await this._loadCommands();
      await message.channel.send("Command enabled !");
    }

    if (message.content.startsWith(process.env.BOT_PREFIX + "disable")) {
      if (!this._commands.map(command => command.command).includes(message.content.split(" ")[1])) return message.channel.send("Command already disabled !");
      await this._guildService.disableCommand(this._guild.id, message.content.split(" ")[1]);
      await this._loadCommands();
      await message.channel.send("Command disabled !");
    }
  }

  _enableCommand = (handler: CommandHandler<any> | any, allowedPerms: Array<number>) => {
    this._commands.push(new Command(handler, allowedPerms, this.onMessage));
  }

  _destroyCommand = (command: string) => {
    this.destroyMessageListener(command);
  }

  _handleGenerateAndSendHelp = async (message: Message) => {
    const embed = new MessageEmbed()
      .setTitle("Commands enabled on this guild")
      .setDescription(`Format : \`${process.env.BOT_PREFIX}command <argument1> <argument2>...\``)
      .setColor("#3467eb")
      .setThumbnail("https://cdn.discordapp.com/attachments/717308535020584966/717308958599151666/--3.png")
      .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL());

    Object.keys(CommandType).forEach((key: string) => {
      const commands = this._commands.filter(command => command.type === CommandType[key]).map(command => {
        return `\`${process.env.BOT_PREFIX}${command.command} ${command.args.map(arg => `<${arg}>`).join(" ")}\``;
      }).join("\n");

      if (commands) {
        embed.addField(
          key, 
          commands
        );
      }
    });
    
    await message.channel.send(embed);
  }
}

export default MessageEventHandler;