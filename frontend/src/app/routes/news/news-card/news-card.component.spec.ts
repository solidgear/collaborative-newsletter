/**
 * @license
 * Solid GEAR Projects S.L.
 * http://solidgeargroup.com
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://opensource.org/licenses/MIT
 */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Http } from '@angular/http';

import { TranslateModule } from 'ng2-translate/ng2-translate';

import { NewsCardComponent } from './news-card.component';

describe('NewsCardComponent', () => {
    let component: NewsCardComponent;
    let fixture: ComponentFixture<NewsCardComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                TranslateModule.forRoot()
            ],
            declarations: [ NewsCardComponent ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(NewsCardComponent);
        component = fixture.componentInstance;
        component.input = {'image': 'test', 'date': null};
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
