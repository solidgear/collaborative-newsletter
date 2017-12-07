/**
 * @license
 * Solid GEAR Projects S.L.
 * http://solidgeargroup.com
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://opensource.org/licenses/MIT
 */
import { Injectable }                               from '@angular/core';
import { Http, Response, Headers, RequestOptions }  from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';

import { ApiService } from "../network/api.service";
import { Router } from "@angular/router";
import { HttpService } from '../network/http.service';

@Injectable()
export class AuthService {

  private loginUrl = this.apiService.getBaseUrl() + '/auth/basic';  // URL to web API
  private usersMeUrl = this.apiService.getBaseUrl() + '/users/me';  // URL to web API
  private sendResetPasswordCodeUrl = this.apiService.getBaseUrl() + '/users/sendResetPasswordCode';  // URL to web API
  private resetPasswordUrl = this.apiService.getBaseUrl() + '/users/resetPassword';  // URL to web API
  private me;

  constructor (private router: Router, private http: HttpService, private apiService: ApiService) {}
  login (username, password): Observable<any> {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
    let data = {"username": username, "password": password};
    return this.http.post(this.loginUrl, data, options)
      .map(this.extractLoginData)
      .catch(this.handleError)
  }

  getResetPasswordCode (email): Observable<any> {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
    let data = {"email": email};
    return this.http.post(this.sendResetPasswordCodeUrl, data, options)
      .map(res => res.text())
      .catch(this.handleError)
  }

  resetPassword (email, code, password): Observable<any> {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
    let data = {"email": email, "code": code, "password": password};
    return this.http.post(this.resetPasswordUrl, data, options)
      .map(res => res.text())
      .catch(this.handleError)
  }

  logout () {
    localStorage.clear();
    this.router.navigate(['/login']);
  }

  isAuthenticated() {
    if (localStorage.getItem('token')) {
      return true;
    }
    return false;
  }

  getUsersMe () {
    if (this.me) {
      return this.me;
    } else {
      let headers = new Headers ({'Content-Type': 'application/json', 'Authorization': localStorage.getItem('token')});
      let options = new RequestOptions({ headers: headers });
      return this.http.get(this.usersMeUrl,options)
        .map(this.extractUsersMeData)
        .catch(this.handleError);
    }
  }

  private extractLoginData(res: Response) {
    let body = res.json();
    if (body.token !== "" && body.refreshToken !== "") {
      localStorage.setItem('token', body.token);
      localStorage.setItem('refreshToken', body.refreshToken);
      return {"result": 200};
    }
    return {"result": 401}
  }

  private extractUsersMeData(res: Response) {
    let body = res.json();
    return body || { };
  }
  
  private handleError (error: Response | any) {
    let errMsg: string;
    const body = error.json() || '';
    const err = body.error || JSON.stringify(body);
    errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    return Observable.throw(errMsg);
  }
}
