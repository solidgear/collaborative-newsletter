/**
 * @license
 * Solid GEAR Projects S.L.
 * http://solidgeargroup.com
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://opensource.org/licenses/MIT
 */

import { TestBed, async, inject } from '@angular/core/testing';
import { HeaderComponent } from './header.component';

import { UserblockService } from '../sidebar/userblock/userblock.service';
import { SettingsService } from '../../core/settings/settings.service';
import { MenuService } from '../../core/menu/menu.service';
import {UsersService} from "../../routes/users/users.service";
import {Observable} from "rxjs/Observable";
import {AuthService} from "../../shared/authentication/auth.service";

class MockUsers {

    public getUserMe() {
        return Observable.of({
            name: 'test',
            role: 'ADMIN'
        });
    }
}

class MockAuth {
    logout() {
        return true;
    }
}

describe('Component: Header', () => {

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                MenuService,
                SettingsService,
                {provide: AuthService, useClass: MockAuth},
                {provide: UsersService, useClass: MockUsers}
            ]
        }).compileComponents();
    });

    it('should create an instance', async(inject([MenuService, SettingsService, AuthService, UsersService],
        (menuService, settingsService, authService, usersService) => {
        let component = new HeaderComponent(menuService, settingsService, authService, usersService);
        expect(component).toBeTruthy();
    })));
});
