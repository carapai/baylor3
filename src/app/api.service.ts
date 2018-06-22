import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {environment} from '../environments/environment';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import * as _ from 'lodash';

import keysToCamelCase from './changeKeys';
import {MatSnackBar} from '@angular/material';
import {Observable} from 'rxjs/Observable';

const API_URL = environment.apiUrl;

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  })
};

@Injectable()
export class ApiService {

  issueAttributes = {
    issue: 'Rx5m6JIiwsD',
    technicalArea: 'cUAfyTK25b0',
    transactionCode: 'VLWHxrfUs9T',
    report: 'RIxrFZS2TIe',
    issueStatus: 'aPPyoe3xwaH',
    responsiblePerson: 'uusr7MxWHCU',
    expectedResolutionDate: 'RDw6wqmcP0H'
  };

  activityAttributes = {
    activityCode: 'BM1qjC9ke9m',
    transactionCode: 'VLWHxrfUs9T',
    activity: 'fFdw1k3qOTs',
    plannedStartDate: 'S3u1kJtu3F3',
    plannedEndDate: 'ONjxIAJocCi',
    projectName: 'dDdnI8H7ZXa',
    resultArea: 'kuPCRXqKCot',
    objective: 'YXvcAptJDNJ',
    implementor: 'ZZ8RXVKurHZ',
    officerPosition: 'gGxE6DkOZqB'
  };

  constructor(private http: HttpClient, public snackBar: MatSnackBar) {
  }

  public getAttributes(program): Observable<any> {
    const params = new HttpParams()
      .set('fields', 'programTrackedEntityAttributes[id,displayName]');
    return this.http
      .get(API_URL + '/programs/' + program, {params})
      .map(response => {
        if (response.hasOwnProperty('programTrackedEntityAttributes')) {
          const attributes = response['programTrackedEntityAttributes'];
          return _.fromPairs(_.map(attributes, i => [i.id, i.displayName]));
        }
      });
  }

  public getAllEvents(program, dataElements): Observable<any[]> {
    dataElements = _.invert(dataElements);
    const params = new HttpParams()
      .set('paging', 'false')
      .set('ouMode', 'ALL')
      .set('program', program)
      .set('fields', ':all');
    return this.http
      .get(API_URL + '/events', {params})
      .map(response => {
        if (response.hasOwnProperty('events')) {
          const events = response['events'];
          return events.map(r => {
            return {
              ...r,
              ..._.fromPairs(_.map(r.dataValues, i => [dataElements[i.dataElement], i.value]))
            };
          });
        }
      });
  }


  public getEvent(event): Observable<any> {
    const params = new HttpParams()
      .set('fields', ':all');
    return this.http
      .get(API_URL + '/events/' + event, {params})
      .map(response => {
        return {
          ...response,
          dataValues: _.fromPairs(_.map(response['dataValues'], i => [i.dataElement, i.value]))
        };
      });
  }

  public getEvents(trackedEntityInstance, dataElements): Observable<any[]> {
    const elements = _.invert(dataElements);
    const params = new HttpParams()
      .set('paging', 'false')
      .set('trackedEntityInstance', trackedEntityInstance);
    return this.http
      .get(API_URL + '/events', {params})
      .map(response => {
        if (response.hasOwnProperty('events')) {
          const events = response['events'];
          return events.map(r => {
            return {
              ...r,
              dataValues: _.fromPairs(_.map(r.dataValues, i => [elements[i.dataElement], i.value])),
              ..._.fromPairs(_.map(r.dataValues, i => [elements[i.dataElement], i.value]))
            };
          });
        }
      });
  }

  public getReports(activityTransaction): Observable<any[]> {
    const attributes = _.invert(this.activityAttributes);
    const params = new HttpParams()
      .set('paging', 'false')
      .set('program', 'MLb410Oz6cU')
      .set('filter', 'VLWHxrfUs9T:EQ:' + activityTransaction)
      .set('ouMode', 'ALL');
    return this.http
      .get(API_URL + '/trackedEntityInstances', {params})
      .map(response => {
        if (response.hasOwnProperty('trackedEntityInstances')) {
          const results = response['trackedEntityInstances'];
          const orgUnits = _.uniq(results.map(o => o.orgUnit)).join(',');
          return results.map(r => {
            return {
              ...r,
              attributes: _.fromPairs(_.map(r.attributes, i => [i.attribute, i.value])),
              ..._.fromPairs(_.map(r['attributes'], i => [attributes[i.attribute], i.value])),
              orgUnits
            };
          });
        }
      });
  }


  public getTrackedEntity(entity, attributes): Observable<any> {
    attributes = _.invert(attributes);
    const params = new HttpParams()
      .set('fields', ':all');
    return this.http
      .get(API_URL + '/trackedEntityInstances/' + entity, {params})
      .map(response => {
        return {
          ...response,
          attributes: _.fromPairs(_.map(response['attributes'], i => [i.attribute, i.value])),
          ..._.fromPairs(_.map(response['attributes'], i => [attributes[i.attribute], i.value])),
        };
      });
  }

  public getTrackedEntities(program, a): Observable<any[]> {
    const attributes = _.invert(a);
    const params = new HttpParams()
      .set('paging', 'false')
      .set('ouMode', 'ALL')
      .set('program', program);

    return this.http
      .get(API_URL + '/trackedEntityInstances', {params})
      .map(response => {
        if (response.hasOwnProperty('trackedEntityInstances')) {
          const results = response['trackedEntityInstances'];
          const orgUnits = _.uniq(results.map(o => o.orgUnit)).join(',');
          return results.map(r => {
            return {
              ...r,
              attributes: _.fromPairs(_.map(r.attributes, i => [i.attribute, i.value])),
              ..._.fromPairs(_.map(r.attributes, i => [attributes[i.attribute], i.value])),
              orgUnits
            };
          });
        }
      });
  }

  public issues(activityTransaction): Observable<any[]> {
    const attributes = _.invert(this.issueAttributes);
    const params = new HttpParams()
      .set('paging', 'false')
      .set('ouMode', 'ALL')
      .set('filter', 'RIxrFZS2TIe:EQ:' + activityTransaction)
      .set('program', 'bsg7cZMTqgI');

    return this.http
      .get(API_URL + '/trackedEntityInstances', {params})
      .map(response => {
        if (response.hasOwnProperty('trackedEntityInstances')) {
          const results = response['trackedEntityInstances'];
          const orgUnits = _.uniq(results.map(o => o.orgUnit)).join(',');
          return results.map(r => {
            return {
              ...r,
              ..._.fromPairs(_.map(r.attributes, i => [attributes[i.attribute], i.value])),
              attributes: _.fromPairs(_.map(r.attributes, i => [i.attribute, i.value])),
              orgUnits
            };
          });
        }
      });
  }

  public getOrgUnits(units): Observable<any> {
    const params = new HttpParams().set('filter', 'id:in:[' + units + ']').set('paging', 'false');
    return this.http
      .get(API_URL + '/organisationUnits', {params})
      .map(response => {
        if (response.hasOwnProperty('organisationUnits')) {
          return _.fromPairs(_.map(response['organisationUnits'], i => [i.id, i.displayName]));
        }
      });
  }

  public getOrgUnitChildren(unit, level): Observable<any[]> {
    const params = new HttpParams()
      .set('fields', level)
      .set('paging', 'false');
    return this.http
      .get(API_URL + '/organisationUnits/' + unit, {params})
      .map(response => {
        return keysToCamelCase(response);
      });
  }

  public getDataElements(elements): Observable<any[]> {
    const params = new HttpParams()
      .set('filter', 'id:in:[' + elements + ']')
      .set('paging', 'false');
    return this.http
      .get(API_URL + '/dataElements', {params})
      .map(response => {
        if (response.hasOwnProperty('dataElements')) {
          return response['dataElements'];
        }
      });
  }

  public getOptions(optionSet): Observable<any[]> {
    const params = new HttpParams()
      .set('fields', 'options[id,displayName,code]');
    return this.http
      .get(API_URL + '/optionSets/' + optionSet, {params})
      .map(response => {
        if (response.hasOwnProperty('options')) {
          return response['options'];
        }
      });
  }

  public postTrackedEntity(data) {
    return this.http.post(API_URL + '/trackedEntityInstances', data, httpOptions).catch(this.handleError);
  }

  public postEvent(data) {
    return this.http.post(API_URL + '/events', data, httpOptions).catch(this.handleError);
  }

  public updateEvent(event, data) {
    return this.http.put(API_URL + '/events/' + event, data, httpOptions).catch(this.handleError);
  }

  public updateTrackedEntity(trackedEntity, data) {
    return this.http.put(API_URL + '/trackedEntityInstances/' + trackedEntity, data, httpOptions).catch(this.handleError);
  }

  private handleError(error: Response | any) {
    let message = '';
    if (error['status'] === 409) {
      const summaries = error['error']['response']['importSummaries'];
      if (summaries) {
        message = _.map(summaries, 'description').join('\n');
        /*this.snackBar.open(message, 'OK', {
          duration: 2000,
        });*/
      }
    } else if (error['status'] === 500) {
      console.log(error);
    }
    return Observable.throw(message);
  }

  public convert(data) {
    return {
      text: data.displayName,
      value: data.id,
      children: data.children.map(this.convert)

    };
  }

  public getUserDetails() {
    const params = new HttpParams()
      .set('fields', 'id,surname,firstName,displayName,userCredentials[userRoles[name,code,authorities]]');
    return this.http
      .get(API_URL + '/me', {params})
      .map(response => {
        return response;
      });
  }

  public getAllUserDetails() {
    const params = new HttpParams()
      .set('fields', 'id,surname,firstName,displayName,userCredentials[userRoles[name,code,authorities]]')
      .set('paging', 'false');
    return this.http
      .get(API_URL + '/users', {params})
      .map(response => {
        return response['users'];
      });
  }

  public getLevels() {
    const params = new HttpParams()
      .set('paging', 'false')
      .set('fields', 'id,level,displayName,name');
    return this.http
      .get(API_URL + '/organisationUnitLevels', {params})
      .map(response => {
        return response['organisationUnitLevels'];
      });
  }

  public addToDataStore(namespace, key, value): Observable<any> {
    return this.http.post(API_URL + '/dataStore/' + namespace + '/' + key, value, httpOptions);
  }

  public updateDataStore(namespace, key, value): Observable<any> {
    return this.http.put(API_URL + '/dataStore/' + namespace + '/' + key, value, httpOptions);
  }

  public getFromDataStore(namespace, key): Observable<any> {
    return this.http.get(API_URL + '/dataStore/' + namespace + '/' + key);
  }

  public getAllDataStore(namespace): Observable<any> {
    return this.http.get(API_URL + '/dataStore/' + namespace);
  }
}
