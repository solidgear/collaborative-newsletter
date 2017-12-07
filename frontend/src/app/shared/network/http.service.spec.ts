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

import { HttpService } from './http.service';
import {ApiService} from "./api.service";

class MockApi {
    public getBaseUrl() {
        return 'http://localhost/api';
    }
}

describe('HttpService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
        imports: [
            TranslateModule.forRoot(),
            HttpModule,
            RouterTestingModule.withRoutes([]),
        ],
      providers: [
          HttpService,
          {provide: ApiService, useClass: MockApi},
      ]
    });
  });

  it('should ...', inject([HttpService], (service: HttpService) => {
    expect(service).toBeTruthy();
  }));
});
