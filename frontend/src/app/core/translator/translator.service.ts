/**
 * @license
 * Solid GEAR Projects S.L.
 * http://solidgeargroup.com
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://opensource.org/licenses/MIT
 */
import { Injectable } from '@angular/core';
import { TranslateService } from 'ng2-translate/ng2-translate';

@Injectable()
export class TranslatorService {

    defaultLanguage: string = 'en';
    availablelangs: any;

    constructor(private translate: TranslateService) {
        // this language will be used as a fallback when a translation isn't found in the current language
        translate.setDefaultLang(this.defaultLanguage);

        this.availablelangs = [
            { code: 'en', text: 'English' },
            { code: 'es_AR', text: 'Spanish' }
        ];

        this.useLanguage();

    }

    useLanguage(lang: string = this.defaultLanguage) {
        this.translate.use(lang);
    }

    getAvailableLanguages() {
        return this.availablelangs;
    }

}
