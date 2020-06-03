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
import { EventEmitter } from 'events';
import * as express from "express";
import * as bearerToken from "express-bearer-token";
import * as bodyParser from "body-parser";
import * as cors from "cors";
import { GuildsRoute, CommandsRoute, UsersRoute } from './routes';

class Server {

  _client: Client;
  _apiEventEmitter: EventEmitter;

  _app: any;
  _http: any;

  constructor(client: Client, apiEventEmitter: EventEmitter) {
    this._client = client;
    this._apiEventEmitter = apiEventEmitter;
    this._app = express();
    this._http = require("http").createServer(this._app);
  }

  start() {
      this.registerMiddleware();
      this.registerRoutes();

      // Start rest server
      let port = process.env.PORT || 4000;
      this._http.listen(port, () => {
          console.log('Rest server started on port ' + port);
      });
  }

  registerMiddleware() {
      this._app.use(bearerToken());
      this._app.use(cors());
      this._app.use(bodyParser.json());
      // this._app.use(express.static(path.join(__dirname, '/../../../build')));
  }

  registerRoutes() {
      this._app.use('/guilds', new GuildsRoute(this._client, this._apiEventEmitter).setup());
      this._app.use('/commands', new CommandsRoute(this._client, this._apiEventEmitter).setup());
      this._app.use('/users', new UsersRoute(this._client, this._apiEventEmitter).setup());

      // this._app.get('*', (req, res) => res.sendFile(path.join(`${__dirname}/../../../build/index.html`)));
  }
} 

export default Server;