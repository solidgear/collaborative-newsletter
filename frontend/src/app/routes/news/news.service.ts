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
import {ConfigurationService} from "../../shared/configuration/configuration.service";

@Injectable()
export class NewsService {

  private rssId;
  private rssName;
  private rssUrl;

  private newsUrl = function() {
      return this.apiservice.getBaseUrl() + '/feeds/' + this.rssId +'/items/';
  };
  private previewImageUrl = this.apiservice.getBaseUrl() + '/feeds/image?url=';

  constructor(private http: HttpService,
              private apiservice: ApiService,
              private configurationService: ConfigurationService) {
    this.rssName = this.configurationService.getConfigurationKey("rssName");
    this.rssUrl = this.apiservice.getBaseUrl() + '/feeds/feed_search?name=' + this.rssName;
  }

  getRss(): Observable<any> {
    let headers = new Headers({ 'Authorization': localStorage.getItem('token')});
    let options = new RequestOptions({ headers: headers });
    return this.http.get(this.rssUrl, options)
      .map(this.extractRss)
      .catch(this.handleError);
  }

  public setRssId = function (rssId) {
    this.rssId = rssId;
  }

  getNews(): Observable<any> {
    let headers = new Headers({ 'Authorization': localStorage.getItem('token')});
    let options = new RequestOptions({ headers: headers });
    return this.http.get(this.newsUrl(), options)
      .map(this.extractNews)
      .catch(this.handleError);
  }

  getNew(id): Observable<any> {
    let headers = new Headers({ 'Authorization': localStorage.getItem('token')});
    let options = new RequestOptions({ headers: headers });
    return this.http.get(this.newsUrl() + id, options)
      .map(this.extractNews)
      .catch(this.handleError);
  }

  postNews(data): Observable<any> {
    let headers = new Headers({ 'Authorization': localStorage.getItem('token')});
    let options = new RequestOptions({ headers: headers });
    return this.http.post(this.newsUrl(), data, options)
      .catch(this.handleError);
  }

  editNewsItem(id, data): Observable<any> {
    let headers = new Headers({ 'Authorization': localStorage.getItem('token')});
    let options = new RequestOptions({ headers: headers });
    return this.http.put(this.newsUrl() + id, data, options)
      .catch(this.handleError);
  }

  removeNew(id): Observable<any> {
    let headers = new Headers({ 'Authorization': localStorage.getItem('token')});
    let options = new RequestOptions({ headers: headers });
    return this.http.delete(this.newsUrl() + id, options)
      .catch(this.handleError);
  }

  getImagePreview(url): Observable<any> {
    let headers = new Headers({ 'Authorization': localStorage.getItem('token')});
    let options = new RequestOptions({ headers: headers });
    return this.http.get(this.previewImageUrl + url, options)
      .map(this.extractImage)
      .catch(this.handleError);
  }

  private extractRss(res: Response) {
    let body = res.json();
    return body || {};
  }

  private extractNews(res: Response) {
    let body = res.json();
    return body || {};
  }

  private extractImage(res: Response | any) {
    let body = res.json();
    return body || {};
  }

  private handleError (error: Response | any) {
    let errMsg: string;
    if (error.status == 404) {
      errMsg = error.statusText;
    } else {
      const body = error.json() || '';
      const err = body.error || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    }
    return Observable.throw(errMsg);
  }
}
