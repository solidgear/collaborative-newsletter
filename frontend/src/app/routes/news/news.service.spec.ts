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
import {RouterTestingModule} from "@angular/router/testing";

import {TranslateModule} from "ng2-translate/index";

import { NewsService } from './news.service';
import { HttpService } from "../../shared/network/http.service";
import {ApiService} from "../../shared/network/api.service";
import {ConfigurationService} from "../../shared/configuration/configuration.service";


class MockApi {
    public getBaseUrl() {
        return 'http://localhost/api';
    }
}

class MockConf {
    public getConfigurationKey(key) {
        return ''
    }
}

describe('NewsService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                TranslateModule.forRoot(),
                RouterTestingModule.withRoutes([]),
                HttpModule
            ],
            providers: [
                NewsService,
                HttpService,
                {provide: ApiService, useClass: MockApi},
                {provide: ConfigurationService, useClass: MockConf}
            ]
        });
    });

    it('should ...', inject([NewsService], (service: NewsService) => {
        expect(service).toBeTruthy();
    }));
});
