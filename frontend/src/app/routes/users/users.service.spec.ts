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

import { UsersService } from './users.service';
import {HttpService} from "../../shared/network/http.service";
import {ApiService} from "../../shared/network/api.service";

class MockApi {
    public getBaseUrl() {
        return 'http://localhost/api';
    }
}

describe('UsersService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                TranslateModule.forRoot(),
                RouterTestingModule.withRoutes([]),
                HttpModule
            ],
            providers: [
                {provide: ApiService, useClass: MockApi},
                UsersService,
                HttpService
            ]
        });
    });

    it('should ...', inject([UsersService, HttpService], (service: UsersService, httpService: HttpService) => {
        expect(service).toBeTruthy();
    }));
});
