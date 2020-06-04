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

import { Message, MessageAttachment, User } from 'discord.js';
import { container } from 'tsyringe';
import { createCanvas, loadImage } from "canvas";
import CommandHandler from '../CommandHandler';
import { MemberService } from '../../db';
import { CommandType } from '../CommandType';
import { Commands } from '../Commands';

class RankCommandHandler extends CommandHandler<RankCommandHandler> {

  _memberService: MemberService;

  constructor() {
    super({
      command: Commands.RANK,
      type: CommandType.LEVEL,
      description: "See your rank on this server."
    });

    this._memberService = container.resolve(MemberService);
  }

  handler = async (message: Message, payload: any) => {
    const xpAmount = await this._memberService.getXpAmount(message.author.id, message.guild.id);
    const image = await this._generateImage(xpAmount, message.author);
    await message.channel.send(new MessageAttachment(image));
  }

  _generateImage = async (xpAmount, user: User) => {
    const canvas = createCanvas(700, 250)
    const ctx = canvas.getContext('2d')

    // background image
    const background = await loadImage(user.displayAvatarURL({format: "png" }));
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

    // filter
    // ctx.beginPath();
    // ctx.rect(0, 0, canvas.width, canvas.height);
    // ctx.fillStyle = "#9484e3";
    // ctx.fill();

    // filter
    ctx.beginPath();
    ctx.rect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#000000AA";
    ctx.fill();

    // Add text
    ctx.font = '30px Impact';
    ctx.fillStyle = '#FFF';
    ctx.fillText(user.tag, canvas.width / 2.5, canvas.height / 3.5);

    // Add text
    ctx.font = '60px Impact';
    ctx.fillStyle = '#FFF';
    ctx.fillText(`${xpAmount} XPs !`, canvas.width / 2.5, canvas.height / 1.8);

    // Round image
    ctx.beginPath();
    ctx.arc(125, 125, 65, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.clip();
      
    // add user avatar
    const avatar = await loadImage(user.displayAvatarURL({ format: "png" }));
    ctx.drawImage(avatar, 50, 50, 150, 150);

    return canvas.toBuffer();
  }
}

export default RankCommandHandler;