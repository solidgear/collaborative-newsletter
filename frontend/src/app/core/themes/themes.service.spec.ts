/**
 * @license
 * Solid GEAR Projects S.L.
 * http://solidgeargroup.com
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://opensource.org/licenses/MIT
 */

import { TestBed, async, inject } from '@angular/core/testing';
import { ThemesService } from './themes.service';

describe('Service: Themes', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ThemesService]
    });
  });

  it('should ...', inject([ThemesService], (service: ThemesService) => {
    expect(service).toBeTruthy();
  }));
});
