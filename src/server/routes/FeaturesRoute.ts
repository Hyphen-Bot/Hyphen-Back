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
import * as F from '../../features';

class FeaturesRoute extends Route {

  setup() {
      this._router.get('/', async (req, res) => {
          try {
            const featureKeys = Object.values(F.Features); 
            const features = [];
            Object.keys(F).forEach(f => {
              if (f.match(/.+FeatureHandler/g)) {
                const feat: F.FeatureHandler<any> = new F[f]();
                if (featureKeys.includes(feat.metadata.feature)) {
                  features.push({
                    ...feat.metadata,
                  });
                }
              }
            });
            return res.json(features);
          } catch (e) {
            return res.send(e.message);
          }
      });

      return this._router;
  }
}

export default FeaturesRoute;