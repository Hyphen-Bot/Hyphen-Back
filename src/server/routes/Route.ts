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

import { Client } from 'discord.js';
import { Router } from "express";
import { EventEmitter } from 'events';

class Route {

  _client: Client;
  _apiEventEmitter: EventEmitter;

  _router: Router;

  constructor(client: Client, apiEventEmitter: EventEmitter) {
      this._client = client;
      this._apiEventEmitter = apiEventEmitter;
      this._router = Router();
  }

  setup() {
      this._router.get('/', function(req, res) {
          res.send("Hello world !");
      });

      return this._router;
  }

}

export default Route;