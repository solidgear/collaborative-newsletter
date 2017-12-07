/**
 * @license
 * Solid GEAR Projects S.L.
 * http://solidgeargroup.com
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://opensource.org/licenses/MIT
 */
import { TestBed, inject } from '@angular/core/testing';
import { ApiService } from './api.service';
import {ConfigurationService} from "../configuration/configuration.service";

class MockConf {
    public getConfigurationKey(key) {
        return ''
    }
}

describe('ApiService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
          ApiService,
          {provide: ConfigurationService, useClass: MockConf}
      ]
    });
  });

  it('should ...', inject([ApiService], (service: ApiService) => {
    expect(service).toBeTruthy();
  }));
});
