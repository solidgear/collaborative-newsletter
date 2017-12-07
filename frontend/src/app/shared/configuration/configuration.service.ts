import { Injectable }   from '@angular/core';
import { Http, Response, Headers, RequestOptions }  from '@angular/http';
import 'rxjs/add/operator/toPromise';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class ConfigurationService {

  configuration = null;
  constructor (private http: Http) {}

  load() {
    var promise = this.http.get('./app/config.json')
      .map(res => res.json())
      .catch(this.handleError)
      .toPromise()
      .then(config => {
        this.configuration = config
      });
    return promise;
  }

  getConfiguration() {
    return this.configuration;
  }

  getConfigurationKey(key) {
    return this.extractKey(key, this.configuration);
  }

  private extractKey(key: string, configuration) {
    return (configuration[key] !== undefined) ? configuration[key] : null;
  }

  private handleError (error: Response | any) {
    let errMsg: string;
    const body = error.json() || '';
    const err = body.error || JSON.stringify(body);
    errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    console.error(errMsg);
    return Observable.throw(errMsg);
  }

}
