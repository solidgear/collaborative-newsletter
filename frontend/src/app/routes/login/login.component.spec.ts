/**
 * @license
 * Solid GEAR Projects S.L.
 * http://solidgeargroup.com
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://opensource.org/licenses/MIT
 */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import {RouterTestingModule} from "@angular/router/testing";

import { TranslateModule } from 'ng2-translate/ng2-translate';

import { LoginComponent } from './login.component';
import {AuthService} from "../../shared/authentication/auth.service";

class MockAuth {
    login() {
        return '';
    }
}

describe('LoginComponent', () => {
    let component: LoginComponent;
    let fixture: ComponentFixture<LoginComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                RouterTestingModule.withRoutes([]),
                TranslateModule.forRoot(),
                ReactiveFormsModule
            ],
            declarations: [ LoginComponent ],
            providers: [
                {provide: AuthService, useClass: MockAuth}
            ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(LoginComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
