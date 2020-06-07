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
  CommandDispatcher, 
  CommandHandler,
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
  TempMuteCommandHandler,
  UserInfoCommandHandler,
  CountdownCommandHandler
} from '../commands';
import { MemberService, GuildService } from '../db';
import { FeatureHandler, FeatureDispatcher, QuoteFeatureHandler, Features } from '../features';

class MessageEventHandler extends EventHandler {

  _memberService: MemberService;
  _guildService: GuildService;

  constructor(client: Client, guild: Guild, apiEventEmitter: EventEmitter) {
    super(client, guild, apiEventEmitter);

    this._memberService = container.resolve(MemberService);
    this._guildService = container.resolve(GuildService);

    this._loadCommands();
    this._loadFeatures();

    // listeners
    this.onMessage("main", this._handleNewMessage);
    this._apiEventEmitter.on("reloadCommands", this._handleReloadCommands);
    this._apiEventEmitter.on("reloadFeatures", this._handleReloadFeatures);
  }

  _loadCommands = async () => {
    // initialize
    const commands = JSON.parse((await this._guildService.getGuild(this._guild.id)).enabledCommands);
    this._commands.forEach((command: CommandDispatcher) => {
      if (!commands.includes(command.command)) this.destroyMessageListener(command.command);
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
    if (commands.includes(Commands.TEMPMUTE)) this._enableCommand(TempMuteCommandHandler, []);
    if (commands.includes(Commands.USERINFO)) this._enableCommand(UserInfoCommandHandler, []);
    if (commands.includes(Commands.COUNTDOWN)) this._enableCommand(CountdownCommandHandler, []);

  }

  _loadFeatures = async () => {
    // initialize
    const features = JSON.parse((await this._guildService.getGuild(this._guild.id)).enabledFeatures);
    this._features.forEach((feature: FeatureDispatcher) => {
      if (!features.includes(feature.feature)) this.destroyMessageListener(feature.feature);
    });
    this._features = [];

    // all features come here
    if (features.includes(Features.QUOTE)) this._enableFeature(QuoteFeatureHandler);

  }

  _handleReloadCommands = ({ guildId }: any) => {
    if (guildId === this._guild.id) {
      this._loadCommands();
    }
  }

  _handleReloadFeatures = ({ guildId }: any) => {
    if (guildId === this._guild.id) {
      this._loadFeatures();
    }
  }

  _enableCommand = (handler: CommandHandler<any> | any, allowedPerms: Array<number>) => {
    this._commands.push(new CommandDispatcher(handler, allowedPerms, this.onMessage));
  }

  _enableFeature = (handler: FeatureHandler<any> | any) => {
    this._features.push(new FeatureDispatcher(handler, this.onMessage));
  }

  _handleNewMessage = async (message: Message) => {
    await this._memberService.addMember(message.author.id, this._guild.id, "en");
    await this._memberService.increaseXpAmount(message.author.id, this._guild.id);

    if (message.content.startsWith(process.env.BOT_PREFIX + "commands") || message.content.startsWith(process.env.BOT_PREFIX + "help")) {
      return this._handleGenerateAndSendHelp(message, message.content.split(" ")[1]);
    }
  }

  _handleGenerateAndSendHelp = async (message: Message, includeDetails?: any) => {
    const embed = new MessageEmbed()
      .setTitle("📗 Guild Enabled Commands")
      .setDescription(`This is the list of all the commands that are enabled on this guild. Please see the dashboard to have a list of all the available commands and to manage them !`)
      .setColor("#dbebff")
      .setThumbnail(this._guild.iconURL({ dynamic: true }))
      .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL())
      .setTimestamp();

    const permissionNames = Object.keys(Permissions.FLAGS);
    const permissionValues = Object.values(Permissions.FLAGS);

    Object.keys(CommandType).forEach((key: string) => {
      const commands = this._commands.filter(command => command.type === CommandType[key]).map(command => {
        return (
          `\`${process.env.BOT_PREFIX}${command.command} ${command.usage ? process.env.BOT_PREFIX + command.usage : (command.args ? command.args.map(arg => `<${arg}>`).join(" ") : "")}\`` +
          `${includeDetails ? 
            `\n${command.description ? `${command.description}` + "\n" : ""}` +
            `**Allowed for :** ${command.allowedPermissionFlags.length <= 0 ? "everyone" : command.allowedPermissionFlags.map(flag => permissionNames[permissionValues.indexOf(flag)].toLowerCase()).join(", ")}\n`
          : ""}`
        );
      }).join("\n");

      if (commands) {
        embed.addField(
          `__**📌 ${key}**__`, 
          commands
        );
      }
    });
    
    await message.channel.send(embed);
  }
}

export default MessageEventHandler;