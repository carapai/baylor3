import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {environment} from '../environments/environment';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import * as _ from 'lodash';

const API_URL = environment.apiUrl;


@Injectable()
export class ApiService {
  constructor(private http: HttpClient) {
  }

  public getAllEvents(): Observable<any[]> {
    const params = new HttpParams()
      .set('paging', 'false')
      .set('orgUnit', 'HrlmR2Iolvn')
      .set('ouMode', 'DESCENDANTS')
      .set('fields', ':all');
    return this.http
      .get(API_URL + '/events', {params})
      .map(response => {
        if (response.hasOwnProperty('events')) {
          return response['events'];
        }
      })
      .catch(this.handleError);
  }

  public getAllEntities(): Observable<any[]> {
    const params = new HttpParams()
      .set('paging', 'false')
      .set('ou', 'HrlmR2Iolvn')
      .set('ouMode', 'DESCENDANTS')
      .set('fields', ':all')
      .set('program', 'MLb410Oz6cU');

    return this.http
      .get(API_URL + '/trackedEntityInstances', {params})
      .map(response => {
        let data = [];
        let results;

        if (response.hasOwnProperty('trackedEntityInstances')) {
          results = response['trackedEntityInstances'];
        }

        if (Array.isArray(results)) {
          const orgUnits = _.uniq(results.map(o => o.orgUnit)).join(',');
          _.forEach(results, (e) => {
            const activity = _.result(_.find(e.attributes, (a) => {
              return a.attribute === 'fFdw1k3qOTs';
            }), 'value');

            const implementor = _.result(_.find(e.attributes, (a) => {
              return a.attribute === 'ZZ8RXVKurHZ';
            }), 'value');

            const startDate = _.result(_.find(e.attributes, (a) => {
              return a.attribute === 'IPwKwPvS64d';
            }), 'value');
            data = [...data, {
              trackedEntityInstance: e.trackedEntityInstance,
              orgUnit: e.orgUnit,
              activity,
              implementor,
              startDate,
              orgUnits
            }];
          });
        }
        return data;
      })
      .catch(this.handleError);
  }

  public getOrgUnits(units): Observable<any[]> {
    const params = new HttpParams().set('filter', 'id:in:[' + units + ']').set('paging', 'false');
    return this.http
      .get(API_URL + '/organisationUnits', {params})
      .map(response => {
        if (response.hasOwnProperty('organisationUnits')) {
          return response['organisationUnits'];
        }
      })
      .catch(this.handleError);
  }

  private handleError(error: Response | any) {
    console.error('ApiService::handleError', error);
    return Observable.throw(error);
  }

}
