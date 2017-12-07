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
import { ReactiveFormsModule } from '@angular/forms';
import {RouterTestingModule} from "@angular/router/testing";

import { TranslateModule, TranslateService } from 'ng2-translate/ng2-translate';
import {TranslateStaticLoader, TranslateLoader} from "ng2-translate/index";
import {Observable} from "rxjs/Observable";

import { NewsFormComponent } from './news-form.component';
import {NewsService} from "../news.service";

class MockNews {
    getRss() {
        return Observable.of('');
    }
    setRssId() {
        return Observable.of('');
    }
    getNew() {
        return Observable.of('');
    }
    getImagePreview() {
        return Observable.of('');
    }
    postNews() {
        return Observable.of('');
    }
    editNewsItem() {
        return Observable.of('');
    }
}

class FakeLoader implements TranslateLoader {
    getTranslation(lang: string): Observable<any> {
        return Observable.of('');
    }
}

describe('NewsFormComponent', () => {
    let component: NewsFormComponent;
    let fixture: ComponentFixture<NewsFormComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                TranslateModule.forRoot(),
                ReactiveFormsModule,
                RouterTestingModule.withRoutes([]),
            ],
            declarations: [ NewsFormComponent ],
            providers: [
                {provide: NewsService, useClass: MockNews}
            ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(NewsFormComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
