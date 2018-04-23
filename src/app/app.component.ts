import {Component, OnInit, ViewChild} from '@angular/core';
import {ApiService} from './api.service';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import * as _ from 'lodash';
import * as Moment from 'moment';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  events = {};
  displayedColumns = ['eventDate', 'orgUnit', 'activity', 'startDate', 'implementor', 'status'];

  dataSource = null;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private api: ApiService) {
  }

  public ngOnInit() {
    this.api
      .getAllEvents()
      .subscribe(
        (events) => {
          this.events = _.groupBy(events, (e) => {
            return e.trackedEntityInstance;
          });
        }
      );

    this.api
      .getAllEntities()
      .subscribe(
        (entities) => {
          this.api
            .getOrgUnits(entities[0].orgUnits)
            .subscribe(
              (orgUnits) => {
                const r = _.groupBy(orgUnits, 'id');
                const all = entities.map((e) => {
                  e.status = this.getStatus(e).status;
                  const d = this.getStatus(e).eventDate;
                  if (d) {
                    e.eventDate = Moment(this.getStatus(e).eventDate).format('YYYY-MM-DD');
                  } else {
                    e.eventDate = '';
                  }
                  const o = r[e.orgUnit];
                  e.orgUnit = o[0].displayName;
                  return e;
                });
                this.dataSource = new MatTableDataSource<any>(all);
                this.dataSource.paginator = this.paginator;
                this.dataSource.sort = this.sort;
              }
            );
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
}


