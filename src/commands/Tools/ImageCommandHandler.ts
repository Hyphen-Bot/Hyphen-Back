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

import { MessageAttachment, Message } from 'discord.js';
import * as jimp from 'jimp';
import CommandHandler from '../CommandHandler';
import { Color } from '../../utils';
import { Commands } from '../Commands';
import { CommandType } from '../CommandType';

class ImageCommandHandler extends CommandHandler<ImageCommandHandler> {

  constructor() {
    super({
      command: Commands.IMAGE,
      type: CommandType.TOOLS,
      arguments: ["effect", "amount", "imageUrl"],
      description: "Apply effects on a given image. Effect can be `blur`, `pixelate` and many more... Amount is how much the effect should be applied (default 10) and imageUrl is optional. You can also attach an image to your message."
    });
  }

  handler = async (message: Message, payload: any) => {
    let { effect, amount, imageUrl }: any = payload.args ? payload.args : { effect: {} };
    if (!imageUrl) {
      if (message.attachments.size > 0) {
        imageUrl = message.attachments.array()[0].url;
      } else {
        imageUrl = message.author.displayAvatarURL({ format: "png", size: 4096 });
      }
    }

    if (!amount) amount = 10;
    else amount = parseInt(amount);

    const image = await jimp.read(imageUrl);

    switch(effect) {
      case "blur": image.blur(amount);
      break;

      case "invert": image.invert();
      break;

      case "greyscale": image.color([{ apply: "greyscale", params: [amount] }]);
      break;

      case "lighten": image.color([{ apply: "lighten", params: [amount] }]);
      break;

      case "brighten": image.color([{ apply: "brighten", params: [amount] }]);
      break;

      case "darken": image.color([{ apply: "darken", params: [amount] }]);
      break;

      case "desaturate": image.color([{ apply: "desaturate", params: [amount] }]);
      break;

      case "saturate": image.color([{ apply: "saturate", params: [amount] }]);
      break;

      case "hue":
      case "spin": image.color([{ apply: "spin", params: [amount] }]);
      break;

      case "mix": image.color([{ apply: "mix", params: [Color.random(), amount] }]);
      break;

      case "tint": image.color([{ apply: "tint", params: [amount] }]);
      break;

      case "shade": image.color([{ apply: "shade", params: [amount] }]);
      break;

      case "red": image.color([{ apply: "red", params: [amount] }]);
      break;

      case "green": image.color([{ apply: "green", params: [amount] }]);
      break;

      case "blue": image.color([{ apply: "blue", params: [amount] }]);
      break;

      case "pixelate": image.pixelate(amount);
      break;

      case "dither": image.dither565();
      break;

      case "normalize": image.normalize();
      break;

      case "circle": image.circle();
      break;

      case "shadow": image.shadow();
      break;

      case "fisheye": image.fisheye();
      break;
    }

    await message.channel.send(new MessageAttachment(await image.getBufferAsync("image/png")));
  }
}

export default ImageCommandHandler;