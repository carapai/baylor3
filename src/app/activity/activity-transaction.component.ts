import {Component, Inject, OnInit, ViewChild, ChangeDetectorRef} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef, MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import * as _ from 'lodash';
import * as Moment from 'moment';
import {ApiService} from '../api.service';
import {ActivatedRoute, Router} from '@angular/router';
import {FormBuilder, FormGroup, NgForm, Validators} from '@angular/forms';
import {ActionDialogComponent, IssueDialogComponent, ReportDialogComponent} from './dialogs.component';

@Component({
  selector: 'app-activity-transaction',
  templateUrl: './activity-transaction.component.html',
  styleUrls: ['./activity.component.css']
})
export class ActivityTransactionComponent implements OnInit {
  activity = {};
  report = null;
  elements = {};
  districts = [];
  actions = [];
  activities = [];
  issues = [];
  orgUnits = {};
  issue = null;
  dataSource = null;
  actionDataSource = null;
  showReport = false;

  selectedActivity = null;
  selectedReport = null;
  selectedIssue = null;

  formLabel = 'Save';

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

  reportForm: FormGroup;
  transaction = '';

  issueColumns = ['issue', 'issueStatus', 'actions'];

  actionColumns = ['action', 'actionStatus'];

  constructor(private api: ApiService, public router: Router, private route: ActivatedRoute, private fb: FormBuilder,
              public dialog: MatDialog) {
  }

  public ngOnInit() {
    this.api.getOptions('NgCRbyGZhIM').subscribe((options) => {
      this.districts = options;
    });
    this.route.paramMap.subscribe(params => {
      this.transaction = params.get('transaction');
      this.api.getReports(params.get('transaction')).subscribe((activities) => {
        this.activities = activities;
        const orgUnits = _.uniq(activities.map(o => o.orgUnit)).join(',');
        this.api.getOrgUnits(orgUnits).subscribe((units) => {
          this.orgUnits = units;
        });
      });
    });
  }

  getReport() {
    this.createForm();
    this.selectedIssue = null;
    this.selectedReport = null;
    this.formLabel = 'Save Report';
    const reportStartDate = this.reportForm.get('reportStartDate');
    const reportEndDate = this.reportForm.get('reportEndDate');
    const reportDate = this.reportForm.get('reportDate');
    const achievementsSummary = this.reportForm.get('achievementsSummary');
    const achievements = this.reportForm.get('achievements');
    const constraints = this.reportForm.get('constraints');
    const lessons = this.reportForm.get('lessons');

    this.selectIssue(null);
    this.api
      .getEvents(this.selectedActivity.trackedEntityInstance, this.reportDataElements)
      .subscribe(
        (events) => {
          if (events.length > 0) {
            this.report = events[0];
            this.selectedReport = events[0];
            this.showReport = true;
            this.formLabel = 'Update Report';
            reportStartDate.setValue(this.report['reportStartDate'] || '');
            reportEndDate.setValue(this.report['reportEndDate'] || '');
            reportDate.setValue(this.report['reportDate'] || '');
            achievementsSummary.setValue(this.report['achievementsSummary'] || '');
            achievements.setValue(this.report['achievements'] || '');
            constraints.setValue(this.report['constraints'] || '');
            lessons.setValue(this.report['lessons'] || '');

            this.api.issues(this.selectedReport['event']).subscribe(issues => {
              this.issues = issues;
              this.dataSource = new MatTableDataSource<any>(this.issues);
            });
          }
        });
  }

  openDialog(data): void {
    data.transactionCode = this.selectedActivity.transactionCode;
    data.report = this.report.event;

    const dialogRef = this.dialog.open(IssueDialogComponent, {
      data,
      width: '600px'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const date = result['registrationDate'].format('YYYY-MM-DD');
        let attributes = [];
        const enrollments = [{
          orgUnit: this.activity['orgUnit'],
          program: 'bsg7cZMTqgI',
          enrollmentDate: date,
          incidentDate: date
        }];

        _.forOwn(this.issueAttributes, function (attribute, key) {
          if (result[key]) {
            attributes = [...attributes, {attribute, value: result[key]}];
          }
        });
        const trackedEntityInstance = {
          orgUnit: this.selectedReport['orgUnit'],
          trackedEntityType: 'MCPQUTHX1Ze',
          attributes,
          enrollments
        };
        if (result.trackedEntityInstance) {
          const trackedEntityInstanceUpdate = {
            orgUnit: this.selectedReport['orgUnit'],
            attributes,
          };
          this.api.updateTrackedEntity(result.trackedEntityInstance, trackedEntityInstanceUpdate).subscribe(hero => {
            this.getReport();
          });
        } else {

          this.api.postTrackedEntity(trackedEntityInstance).subscribe(hero => {
            this.getReport();
          });
        }
      }
    });
  }

  openActionDialog(data): void {
    const dialogRef = this.dialog.open(ActionDialogComponent, {
      data,
      width: '600px'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const ecd = result['expectedCompletionDate'];
        const od = result['outcomeDate'];

        if (ecd instanceof Moment) {
          result['expectedCompletionDate'] = result['expectedCompletionDate'].format('YYYY-MM-DD');
        } else if (Object.prototype.toString.call(ecd) === '[object Date]') {
          result['expectedCompletionDate'] = Moment(ecd).format('YYYY-MM-DD');
        }

        if (od instanceof Moment) {
          result['outcomeDate'] = result['outcomeDate'].format('YYYY-MM-DD');
        } else if (Object.prototype.toString.call(ecd) === '[object Date]') {
          result['outcomeDate'] = Moment(od).format('YYYY-MM-DD');
        }

        let dataValues = [];
        _.forOwn(this.actionDataElements, function (dataElement, key) {
          if (result[key]) {
            dataValues = [...dataValues, {dataElement, value: result[key]}];
          }
        });

        const event = {
          trackedEntityInstance: this.selectedIssue.trackedEntityInstance,
          program: 'bsg7cZMTqgI',
          orgUnit: this.selectedIssue.orgUnit,
          programStage: 'KO6z9FXmPLv',
          eventDate: result['eventDate'] || Moment().format('YYYY-MM-DD'),
          dataValues
        };

        if (result.event) {
          this.api.updateEvent(result['event'], event).subscribe(e => {
            this.selectIssue(this.selectedIssue);
          });
        } else {
          this.api.postEvent(event).subscribe(e => {
            this.selectIssue(this.selectedIssue);
          });
        }
      }
    });
  }

  openReportDialog(actvity): void {
    const dialogRef = this.dialog.open(ReportDialogComponent, {
      data: {actvity},
      width: '600px',
    });
    dialogRef.afterClosed().subscribe(result => {
    });
  }

  createForm() {
    this.reportForm = this.fb.group({
      reportStartDate: [null, Validators.required],
      reportEndDate: [null, Validators.required],
      reportDistrict: [null],
      reportDate: [null, Validators.required],
      achievementsSummary: [null],
      achievements: [null],
      constraints: [null],
      lessons: [null]
    });
  }

  onFormSubmit(form: NgForm) {
    const rsd = form['reportStartDate'];
    const red = form['reportEndDate'];
    const rd = form['reportDate'];

    if (rsd instanceof Moment) {
      form['reportStartDate'] = form['reportStartDate'].format('YYYY-MM-DD');
    } else if (Object.prototype.toString.call(rsd) === '[object Date]') {
      form['reportStartDate'] = Moment(rsd).format('YYYY-MM-DD');
    }

    if (red instanceof Moment) {
      form['reportEndDate'] = form['reportEndDate'].format('YYYY-MM-DD');
    } else if (Object.prototype.toString.call(red) === '[object Date]') {
      form['reportEndDate'] = Moment(red).format('YYYY-MM-DD');
    }

    if (rd instanceof Moment) {
      form['reportDate'] = form['reportDate'].format('YYYY-MM-DD');
    } else if (Object.prototype.toString.call(rd) === '[object Date]') {
      form['reportDate'] = Moment(rd).format('YYYY-MM-DD');
    }

    let dataValues = [];
    _.forOwn(this.reportDataElements, function (dataElement, key) {
      if (form[key]) {
        dataValues = [...dataValues, {dataElement, value: form[key]}];
      }
    });

    const event = {
      trackedEntityInstance: this.selectedActivity.trackedEntityInstance,
      program: 'MLb410Oz6cU',
      orgUnit: this.selectedActivity.orgUnit,
      status: 'COMPLETED',
      programStage: 'FxImolXHCbY',
      eventDate: form['startDate'],
      dataValues
    };

    if (this.selectedReport !== null) {
      this.api.updateEvent(this.selectedReport.event, event).subscribe(e => {
      });
    } else {
      this.api.postEvent(event).subscribe(e => {
        const ref = e['response']['importSummaries'][0]['reference'];
        this.api.getEvent(ref).subscribe((ev) => {
          this.formLabel = 'Update';
          this.selectedReport = ev;
        });
      });
    }

  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
  }

  selectIssue(row) {
    if (row) {
      this.selectedIssue = row;
      this.api.getEvents(row.trackedEntityInstance, this.actionDataElements).subscribe((events) => {
        this.actions = events;
        this.actionDataSource = new MatTableDataSource<any>(events);
      });
    } else {
      this.actionDataSource = null;
    }
  }
}
