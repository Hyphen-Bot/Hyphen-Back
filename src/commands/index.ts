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

import Command from "./Command";
import { Commands } from "./Commands";
import { CommandType } from "./CommandType";
import PingCommandHandler from "./PingCommandHandler";
import RankCommandHandler from "./RankCommandHandler";
import WarnCommandHandler from "./WarnCommandHandler";
import WarnsCommandHandler from "./WarnsCommandHandler";
import PunchCommandHandler from "./PunchCommandHandler";
import MuteCommandHandler from "./MuteCommandHandler";
import UnmuteCommandHandler from "./UnmuteCommandHandler";
import ClearCommandHandler from "./ClearCommandHandler";
import KissCommandHandler from "./KissCommandHandler";
import SlapCommandHandler from "./SlapCommandHandler";

export {
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
  SlapCommandHandler
}