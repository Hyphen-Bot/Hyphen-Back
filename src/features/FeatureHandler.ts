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
import { Features } from './Features';
import { Logger } from '../utils';

class FeatureMetadata {
  public feature: Features;
  public description?: string;

  public constructor(init?:Partial<FeatureMetadata>) {
      Object.assign(this, init);
  }
}

class FeatureHandler<T> {

  private _metadata: FeatureMetadata;

  constructor(metadata: FeatureMetadata) {
    this._metadata = metadata;
  }

  /**
   * Default handler wrapper, responsible for error catching
   */
  handle = async (message: Message) => {
    try {
      await this.handler(message);
    } catch (e) {
      Logger.error(e);
    }
  }

  /**
   * Public handler, this is the main command runtime
   */
  handler = async (message: Message) => {
    // nothing
  }
  
  /**
   * Get the command metadata
   */
  get metadata(): FeatureMetadata {
    return this._metadata;
  }
}

export default FeatureHandler;