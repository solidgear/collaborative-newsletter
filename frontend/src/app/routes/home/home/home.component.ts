/**
 * @license
 * Solid GEAR Projects S.L.
 * http://solidgeargroup.com
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://opensource.org/licenses/MIT
 */
import { Component, OnInit } from '@angular/core';
import {ApiService} from "../../../shared/network/api.service";

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

    constructor(private apiService: ApiService) { }

    ngOnInit() {
    }

    getFeedUrl() {
        return this.apiService.getBaseUrl() + '/rss/Bulletin/feed';
    }

}
