import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import * as _ from 'lodash';
import * as Moment from 'moment';
import { ApiService } from '../api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-activity',
  templateUrl: './activity.component.html',
  styleUrls: ['./activity.component.css']
})
export class ActivityComponent implements OnInit {

  events = {};

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

  reportDataElements = {
    reportStartDate: 'BNoMKfDs0Oj',
    reportEndDate: 'kc42dsL4xqA',
    reportDistrict: 'TjoNheffZEE',
    reportDate: 'bmYlImBre1I',
    achievementsSummary: 'O7QsM6bgg6C',
    achievements: 'ShLKMDTLfEp',
    constraints: 'R9vh1aiBWJT',
    lessons: 'F7RpXNihiHI'
  };

  displayedColumns = [
    'activityCode',
    'transactionCode',
    'activity',
    'orgUnit',
    'plannedStartDate',
    'plannedEndDate',
    // 'projectName',
    // 'resultArea',
    // 'objective',
    'implementor',
    'status',
    'action'
  ];

  dataSource = null;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private api: ApiService, public router: Router, public dialog: MatDialog) {
  }

  public ngOnInit() {
    this.api
      .getAttributes('MLb410Oz6cU')
      .subscribe(
        (attributes) => {
          return attributes;
        }
      );

    this.api
      .getAllEvents('MLb410Oz6cU', this.reportDataElements)
      .subscribe(
        (events) => {
          this.events = _.groupBy(events, 'trackedEntityInstance');
        }
      );
    this.api
      .getTrackedEntities('MLb410Oz6cU', this.activityAttributes)
      .subscribe(
        (activities) => {
          if (activities.length > 0) {
            activities = activities.map(r => {
              return {
                ...r,
                status: this.getStatus(r)
              };
            });
            this.api
              .getOrgUnits(activities[0].orgUnits)
              .subscribe(
                (orgUnits) => {
                  const all = activities.map((e) => {
                    return { ...e, orgUnit: orgUnits[e.orgUnit] };
                  });
                  this.dataSource = new MatTableDataSource<any>(all);
                  this.dataSource.paginator = this.paginator;
                  this.dataSource.sort = this.sort;
                }
              );
          }
        }
      );
  }

  getStatus(o) {
    let events = _.orderBy(this.events[o.trackedEntityInstance], ['eventDate'], ['asc']);
    events = _.filter(events, function (e) {
      return e.reportStartDate !== null;
    });
    const date = Moment();
    if (events.length > 0) {
      return 'complete';
    } else {
      const d = Moment(o.plannedStartDate);
      if (d >= date) {
        if (d.diff(date, 'days') <= 7) {
          return 'approaching';
        } else {
          return 'on schedule';
        }
      } else {
        return 'overdue';
      }
    }
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
  }

  selectRow(row) {
    this.router.navigate(['/activities', row.attributes['VLWHxrfUs9T']]);
  }
}
