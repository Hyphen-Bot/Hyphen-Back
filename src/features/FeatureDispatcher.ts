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

import { Message } from 'discord.js';
import FeatureHandler from './FeatureHandler';
import { Features } from './Features';

class FeatureDispatcher {

  _handler: FeatureHandler<any>;
  _onMessage: (name: string, listener: (message: Message) => void) => void;

  _feature: Features;
  _description: string;

  constructor(handler: FeatureHandler<any>, onMessage: (name: string, listener: (message: Message) => void) => void) {
    // @ts-ignore
    this._handler = new handler();
    this._onMessage = onMessage;

    this._feature = this._handler.metadata.feature;
    this._description = this._handler.metadata.description;

    // start handler
    this._init();
  }

  private _init = () => {
    this._onMessage(this._feature, (message: Message) => {
      this._handler.handle(message);
    });
  }

  get feature(): Features {
    return this._feature;
  }

  get description(): string {
    return this._description;
  }

}

export default FeatureDispatcher;