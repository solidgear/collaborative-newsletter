/**
 * @license
 * Solid GEAR Projects S.L.
 * http://solidgeargroup.com
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://opensource.org/licenses/MIT
 */
import { TestBed, inject } from '@angular/core/testing';
import {RouterTestingModule} from "@angular/router/testing";
import { HttpModule } from '@angular/http';

import {TranslateModule} from "ng2-translate/index";

import { AuthService } from './auth.service';
import {HttpService} from "../network/http.service";
import {ApiService} from "../../shared/network/api.service";

class MockApi {
    public getBaseUrl() {
        return 'http://localhost/api';
    }
}

describe('AuthService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                TranslateModule.forRoot(),
                RouterTestingModule.withRoutes([]),
                HttpModule
            ],
            providers: [
                {provide: ApiService, useClass: MockApi},
                AuthService,
                HttpService
            ]
        });
    });

    it('should ...', inject([AuthService], (service: AuthService) => {
        expect(service).toBeTruthy();
    }));
});
