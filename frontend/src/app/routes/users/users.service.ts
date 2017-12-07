/**
 * @license
 * Solid GEAR Projects S.L.
 * http://solidgeargroup.com
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://opensource.org/licenses/MIT
 */
import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions, URLSearchParams }  from '@angular/http';
import {Observable} from "rxjs/Observable";
import {HttpService} from "../../shared/network/http.service";
import {ApiService} from "../../shared/network/api.service";

@Injectable()
export class UsersService {

  private usersMeUrl = function() {
    return this.apiservice.getBaseUrl() + '/users/me/';
  };

  private editUserUrl = function() {
    return this.apiservice.getBaseUrl() + '/users/updatePassword';
  }

  constructor(private http: HttpService, private apiservice: ApiService) {

  }

  getUserMe(): Observable<any> {
    let headers = new Headers({ 'Authorization': localStorage.getItem('token')});
    let options = new RequestOptions({ headers: headers });
    return this.http.get(this.usersMeUrl(), options)
        .map(this.extractUserMe)
        .catch(this.handleError);
  }

  resetPassword(data): Observable<any> {
    let headers = new Headers({'Authorization': localStorage.getItem('token')});
    let options = new RequestOptions({ headers: headers });
    return this.http.post(this.editUserUrl(), data, options);
  }

  private extractUserMe(res: Response | any) {
    let body = res.json();
    return body || {};
  }

  private handleError (error: Response | any) {
    let errMsg: string;
    if (error.status == 404) {
      errMsg = error.statusText;
    } else {
      errMsg = error.json() || '';
    }
    return Observable.throw(errMsg);
  }
}
