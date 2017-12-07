/**
 * @license
 * Solid GEAR Projects S.L.
 * http://solidgeargroup.com
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://opensource.org/licenses/MIT
 */
import { Injectable }   from '@angular/core';
import { ConfigurationService } from '../configuration/configuration.service';

@Injectable()
export class ApiService {

  constructor (private configurationService: ConfigurationService) {}
  getBaseUrl(){
    return this.configurationService.getConfigurationKey("baseURL");
  }
}
