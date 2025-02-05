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

import Route from "./Route";
import * as C from './../../commands';

class CommandsRoute extends Route {

  setup() {
      this._router.get('/', async (req, res) => {
          try {
            const commandKeys = Object.values(C.Commands); 
            const commands = [];
            Object.keys(C).forEach(c => {
              if (c.match(/.+CommandHandler/g)) {
                const cmd: C.CommandHandler<any> = new C[c]();
                if (commandKeys.includes(cmd.metadata.command)) {
                  commands.push({
                    ...cmd.metadata,
                    type: Object.values(C.CommandType)[cmd.metadata.type]
                  });
                }
              }
            });
            return res.json(commands);
          } catch (e) {
            return res.send(e.message);
          }
      });

      return this._router;
  }
}

export default CommandsRoute;