/**
 * @license
 * Solid GEAR Projects S.L.
 * http://solidgeargroup.com
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://opensource.org/licenses/MIT
 */
import { TestBed, inject } from '@angular/core/testing';
import { HttpModule } from '@angular/http';

import { ConfigurationService } from './configuration.service';

describe('ConfigurationService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpModule
            ],
            providers: [ConfigurationService]
        });
    });

    it('should ...', inject([ConfigurationService], (service: ConfigurationService) => {
        expect(service).toBeTruthy();
    }));
});
