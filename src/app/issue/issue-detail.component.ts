import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ApiService} from '../api.service';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';

@Component({
  selector: 'app-issue',
  templateUrl: './issue-detail.component.html',
  styleUrls: ['./issue.component.css']
})
export class IssueDetailComponent implements OnInit {
  actions = [];
  dataSource = null;
  selectedIssue = {};

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

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

  displayedColumns = ['action', 'actionStatus'];

  constructor(private api: ApiService, public router: Router, private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.api.getTrackedEntity(params.get('id'), this.issueAttributes).subscribe((a) => {
        this.selectedIssue = a;
      });

      this.api
        .getEvents(params.get('id'), this.actionDataElements)
        .subscribe(
          (events) => {
            this.actions = events;
            if (events.length > 0) {
              this.dataSource = new MatTableDataSource<any>(events);
              this.dataSource.paginator = this.paginator;
              this.dataSource.sort = this.sort;
            }
          });
    });
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
  }

}
