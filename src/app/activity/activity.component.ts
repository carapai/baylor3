import {Component, OnInit, ViewChild} from '@angular/core';
import {MatDialog, MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import * as _ from 'lodash';
import * as Moment from 'moment';
import {ApiService} from '../api.service';
import {Router} from '@angular/router';
import {ActionDialogComponent, ActivityDialogComponent, IssueDialogComponent} from './dialogs.component';

@Component({
  selector: 'app-activity',
  templateUrl: './activity.component.html',
  styleUrls: ['./activity.component.scss']
})
export class ActivityComponent implements OnInit {

  events = {};
  columns = [
    {columnDef: 'activityCode', header: 'Activity Code', cell: (element) => `${element.activityCode || ''}`},
    {columnDef: 'transactionCode', header: 'Transaction', cell: (element) => `${element.transactionCode || ''}`},
    {columnDef: 'activity', header: 'Activity Name', cell: (element) => `${element.activity || ''}`},
    {columnDef: 'orgUnit', header: 'Unit.', cell: (element) => `${element.orgUnit}`},
    {columnDef: 'plannedStartDate', header: 'Planned activity start date.', cell: (element) => `${element.plannedStartDate || ''}`},
    {columnDef: 'plannedEndDate', header: 'Planned activity end date.', cell: (element) => `${element.plannedEndDate || ''}`},
    {columnDef: 'projectName', header: 'Project.', cell: (element) => `${element.projectName || ''}`},
    {columnDef: 'resultArea', header: 'Result Area.', cell: (element) => `${element.resultArea || ''}`},
    {columnDef: 'objective', header: 'Objective.', cell: (element) => `${element.objective || ''}`},
    {columnDef: 'implementor', header: 'Implementer.', cell: (element) => `${element.implementor || ''}`}
  ];

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

  displayedColumns = [
    'activityCode',
    'transactionCode',
    'activity',
    'orgUnit',
    'plannedStartDate',
    'plannedEndDate',
    'projectName',
    'resultArea',
    'objective',
    'implementor',
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
      .getTrackedEntities('MLb410Oz6cU', this.activityAttributes)
      .subscribe(
        (activities) => {
          if (activities.length > 0) {
            this.api
              .getOrgUnits(activities[0].orgUnits)
              .subscribe(
                (orgUnits) => {
                  const all = activities.map((e) => {
                    return {...e, orgUnit: orgUnits[e.orgUnit]};
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
    const result = {eventDate: '', status: ''};
    let events = _.orderBy(this.events[o.trackedEntityInstance], ['eventDate'], ['asc']);
    events = _.filter(events, function (e) {
      return e.eventDate !== null;
    });
    const date = Moment().format('YYYY-MM-DD');
    if (o.startDate) {
      if (events.length > 0) {
        result.status = 'active';
        result.eventDate = events[0].eventDate;
      } else {
        if (o.startDate >= date) {
          result.status = 'pending';
        } else {
          result.status = 'overdue';
        }
      }
    }
    return result;
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
  }

  selectRow(row) {
    this.router.navigate(['/activities', row.attributes['VLWHxrfUs9T']]);
  }

  openActivityDialog(data) {
    const dialogRef = this.dialog.open(ActivityDialogComponent, {
      data,
      width: '99%'
    });
    dialogRef.afterClosed().subscribe(result => {
    });
  }

}
