/**
 * @license
 * Solid GEAR Projects S.L.
 * http://solidgeargroup.com
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://opensource.org/licenses/MIT
 */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpModule} from '@angular/http';
import {RouterTestingModule} from "@angular/router/testing";

import {TranslateModule} from "ng2-translate/index";
import {MockComponent} from "ng2-mock-component/index";
import {ModalModule} from "ng2-bootstrap/index";

import { NewsComponent } from './news.component';
import {HttpService} from "../../../shared/network/http.service";
import {ApiService} from "../../../shared/network/api.service";
import {ConfigurationService} from "../../../shared/configuration/configuration.service";

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

describe('NewsComponent', () => {
    let component: NewsComponent;
    let fixture: ComponentFixture<NewsComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                ModalModule.forRoot(),
                RouterTestingModule.withRoutes([]),
                TranslateModule.forRoot(),
                HttpModule
            ],
            declarations: [
                NewsComponent,
                MockComponent({ selector: 'news-card', inputs: ['data'] })
            ],
            providers: [
                HttpService,
                {provide: ApiService, useClass: MockApi},
                {provide: ConfigurationService, useClass: MockConf},
            ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(NewsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
