/**
 * @license
 * Solid GEAR Projects S.L.
 * http://solidgeargroup.com
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://opensource.org/licenses/MIT
 */
import {Injectable} from '@angular/core';
import {Http, XHRBackend, RequestOptions, Request, RequestOptionsArgs, Response, Headers} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/mergeMap';
import { Router } from '@angular/router';
import { ApiService } from "../network/api.service";
import {TranslateService} from "ng2-translate/index";

@Injectable()
export class HttpService extends Http {

  private refreshTokenUrl = this.apiService.getBaseUrl() + '/token';
  private rerequest;

  constructor (backend: XHRBackend, options: RequestOptions,
               private router: Router,
               private http: Http,
               private apiService: ApiService,
               private translateService: TranslateService) {
    super(backend, options);
  }

  request(url: string | Request, request?: RequestOptionsArgs): Observable<Response> {

    if (url instanceof Request) {
        url.headers.append("accept-language", this.translateService.currentLang);
    } else {
        request.headers.append("accept-language", this.translateService.currentLang);
    }

    return this.http.request(url, request)
      .catch(initialError => {
        if (initialError && initialError.status === 401) {
          // token might be expired, try to refresh token
          return this.refreshToken()
          // flatten response so it's
            .mergeMap( authenticationResult => {
              var response = authenticationResult.json()
              if (response.token) {
                localStorage.setItem('token', response.token);
                if (typeof url === "string") {
                  request.headers = new Headers ({'Content-Type': 'application/json', 'Authorization': response.token, 'Accept-Language': 'en_GB'});
                } else {
                  url.headers = new Headers ({'Content-Type': 'application/json', 'Authorization': response.token, 'Accept-Language': 'en_GB'});
                }
                return this.http.request(url, request);
              } else {
                localStorage.clear();
                this.router.navigate(['login']);
                return Observable.throw(initialError);
              }
            })
            .catch(refreshError => {
              localStorage.clear();
              this.router.navigate(['login']);
              return Observable.throw(refreshError);
            });
        }
        else if (initialError.status === 0 || initialError.status === 500) {
          localStorage.clear();
          this.router.navigate(['login']);
          return Observable.throw(initialError);
        } else {
          return Observable.throw(initialError);
        }
      });
  }

  refreshToken () {
    let headers = new Headers ({'Content-Type': 'application/json'});
    let options = new RequestOptions({ headers: headers });
    return this.http.post(this.refreshTokenUrl, {refreshToken: localStorage.getItem('refreshToken')}, options);
  }
  
}
