import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiService } from '../api.service';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { environment } from '../../environments/environment';
import * as _ from 'lodash';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})
export class ReportComponent implements OnInit {

  reportDataElements = {
    reportStartDate: 'BNoMKfDs0Oj',
    reportEndDate: 'kc42dsL4xqA',
    reportDate: 'bmYlImBre1I',
    reportTitle: 'v7oRIJaqdVO',
    achievementsSummary: 'O7QsM6bgg6C',
    achievements: 'ShLKMDTLfEp',
    constraints: 'R9vh1aiBWJT',
    lessons: 'F7RpXNihiHI',
    report: 'yxGmEyvPfwl',
    reportStatus: 'wuc2PKLJoRI'
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

  dataSource = null;
  activities = [];

  API_URL = environment.apiUrl + '/events/files?';


  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  events = [];

  displayedColumns = [
    'activity',
    'reportStartDate',
    'reportEndDate',
    'orgUnitName',
    'action'
  ];

  constructor(private api: ApiService) {
  }

  ngOnInit() {
    this.api.getTrackedEntities('MLb410Oz6cU', this.activityAttributes).subscribe(activities => {
      this.activities = activities;
    }, e => console.log(e), () => {
      this.api
        .getAllEvents('MLb410Oz6cU', this.reportDataElements)
        .subscribe(
          (events) => {
            this.events = events;
          }, error1 => console.log(error1), () => {
            const events = this.events.map(e => {
              console.log(e);
              const entity = _.find(this.activities, { trackedEntityInstance: e.trackedEntityInstance });
              return { ...e, ...{ download: this.API_URL + 'eventUid=' + e.event + '&dataElementUid=yxGmEyvPfwl', activity: entity.activity } };
            });
            this.dataSource = new MatTableDataSource<any>(events);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
          });
    });
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
  }
}
