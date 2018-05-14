import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ApiService} from '../api.service';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';

@Component({
  selector: 'app-issue',
  templateUrl: './issue.component.html',
  styleUrls: ['./issue.component.css']
})
export class IssueComponent implements OnInit {
  actions = [];
  dataSource = null;
  activity = null;

  actionDataElements = {
    actionStatus: 'uHKB4dkX1fq',
    closureDate: 'u6dTu8Ddewe',
    outcomeDate: 'w00xeY8WbiE',
    outcome: 'eQve0e2UQZB',
    action: 'r7rY6fZhPtJ',
    responsiblePerson: 'xA18H9INOMT',
    expectedCompletionDate: 'QGhoE13k2ta'
  };

  issueAttributes = {
    issue: 'Rx5m6JIiwsD',
    technicalArea: 'cUAfyTK25b0',
    transactionCode: 'VLWHxrfUs9T',
    report: 'RIxrFZS2TIe',
    issueStatus: 'aPPyoe3xwaH'
  };

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  displayedColumns = ['transactionCode', 'orgUnit', 'issue', 'issueStatus', 'action'];

  constructor(private api: ApiService, public router: Router, private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.api
      .getTrackedEntities('bsg7cZMTqgI', this.issueAttributes)
      .subscribe(
        (issues) => {
          if (issues.length > 0) {
            this.api
              .getOrgUnits(issues[0].orgUnits)
              .subscribe(
                (orgUnits) => {
                  const all = issues.map((e) => {
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
}
