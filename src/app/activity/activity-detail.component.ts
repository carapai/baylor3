import { Component, Inject, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef, MatPaginator, MatSnackBar, MatSort, MatTableDataSource } from '@angular/material';
import * as _ from 'lodash';
import * as Moment from 'moment';
import { ApiService } from '../api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActionDialogComponent, IssueDialogComponent } from './dialogs.component';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs/Observable';
import { distinctUntilChanged, map, startWith, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-activity',
  templateUrl: './activity-detail.component.html',
  styleUrls: ['./activity.component.css']
})
export class ActivityDetailComponent implements OnInit {
  activity = {};
  report = null;
  elements = {};
  reportStatuses: Observable<any[]>;
  actions = [];
  activities = [];
  issues = [];
  orgUnits = {};
  issue = null;
  dataSource = null;
  actionDataSource = null;
  showReport = false;

  selectedActivity = {};
  selectedReport = null;
  selectedIssue = null;

  formLabel = 'Save';
  API_URL = environment.apiUrl + '/events/files?';

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

  actionDataElements = {
    action: 'r7rY6fZhPtJ',
    currentIssueStatus: 'eQve0e2UQZB',
    actionStartDate: 'wkNRYneBckD',
    actionEndDate: 'HzV3uTFF5Dk',
    actionTakenBy: 'utFCefwUzgS',
    actionDescription: 'uF8CZbF5Kyb',
  };

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

  reportForm: FormGroup;

  issueColumns = ['issue', 'issueStatus', 'actions'];

  actionColumns = ['action', 'currentIssueStatus'];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  @ViewChild(MatPaginator) actionPaginator: MatPaginator;
  @ViewChild(MatSort) actionSort: MatSort;

  canApprove = false;

  maxDate = new Date();

  constructor(private api: ApiService, public router: Router, private route: ActivatedRoute, private fb: FormBuilder,
    public dialog: MatDialog, public snackBar: MatSnackBar) {
  }

  public ngOnInit() {

    this.getReport();

    this.reportStatuses = this.reportForm.get('reportStatus').valueChanges
      .pipe(
        startWith(null),
        distinctUntilChanged(),
        switchMap(val => {
          return this.filter(val || '');
        })
      );

      this.api.getUserDetails().subscribe(u => {
        console.log(u);
      });
  }

  getReport() {
    this.createForm(this.report);
    const reportStartDate = this.reportForm.get('reportStartDate');
    const reportEndDate = this.reportForm.get('reportEndDate');
    const reportDate = this.reportForm.get('reportDate');
    const reportTitle = this.reportForm.get('reportTitle');
    const achievementsSummary = this.reportForm.get('achievementsSummary');
    const achievements = this.reportForm.get('achievements');
    const constraints = this.reportForm.get('constraints');
    const lessons = this.reportForm.get('lessons');
    const reportStatus = this.reportForm.get('reportStatus');
    this.route.paramMap.subscribe(params => {
      this.api.getTrackedEntity(params.get('id'), this.activityAttributes).subscribe((activity) => {
        this.selectedActivity = activity;
      });

      this.api
        .getEvents(params.get('id'), this.reportDataElements)
        .subscribe(
          (events) => {
            if (events.length > 0) {
              this.report = events[0];
              this.selectedReport = events[0];
              this.API_URL = this.API_URL + 'eventUid=' + this.selectedReport.event + '&dataElementUid=yxGmEyvPfwl';
              this.showReport = true;
              this.formLabel = 'Update Report';
              reportStartDate.setValue(this.report['reportStartDate'] || '');
              reportEndDate.setValue(this.report['reportEndDate'] || '');
              reportDate.setValue(this.report['reportDate'] || '');
              reportTitle.setValue(this.report['reportTitle'] || '');
              achievementsSummary.setValue(this.report['achievementsSummary'] || '');
              achievements.setValue(this.report['achievements'] || '');
              constraints.setValue(this.report['constraints'] || '');
              lessons.setValue(this.report['lessons'] || '');
              reportStatus.setValue(this.report['reportStatus'] || 'Pending Approval');
              this.api.issues(this.selectedReport['event']).subscribe(issues => {
                this.issues = issues;
                this.dataSource = new MatTableDataSource<any>(this.issues);
                this.dataSource.paginator = this.paginator;
                this.dataSource.sort = this.sort;
              });
            }
          });
    });
  }

  openDialog(data): void {
    data.transactionCode = this.selectedActivity['transactionCode'];
    data.report = this.selectedReport;
    const dialogRef = this.dialog.open(IssueDialogComponent, {
      data,
      width: '600px'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const date = result['registrationDate'].format('YYYY-MM-DD');
        const expectedResolutionDate = result['expectedResolutionDate'];

        if (expectedResolutionDate instanceof Moment) {
          result['expectedResolutionDate'] = result['expectedResolutionDate'].format('YYYY-MM-DD');
        } else if (Object.prototype.toString.call(expectedResolutionDate) === '[object Date]') {
          result['expectedResolutionDate'] = Moment(expectedResolutionDate).format('YYYY-MM-DD');
        }
        let attributes = [];
        const enrollments = [{
          orgUnit: this.activity['orgUnit'],
          program: 'bsg7cZMTqgI',
          enrollmentDate: date,
          incidentDate: date
        }];

        _.forOwn(this.issueAttributes, function (attribute, key) {
          if (result[key]) {
            attributes = [...attributes, { attribute, value: result[key] }];
          }
        });
        const trackedEntityInstance = {
          orgUnit: this.selectedReport['orgUnit'],
          trackedEntityType: 'MCPQUTHX1Ze',
          attributes,
          enrollments
        };
        if (result.trackedEntityInstance) {
          trackedEntityInstance['trackedEntityInstance'] = result.trackedEntityInstance;

        }
        this.api.postTrackedEntity(trackedEntityInstance).subscribe(hero => {
          this.getReport();
          this.snackBar.open('Issue saved successfully', 'OK', {
            duration: 2000,
          });
        }, error => {
          this.snackBar.open(error, 'Failed to save or update issue', {
            duration: 2000,
          });
        });
      }
    });
  }

  openActionDialog(data, issue): void {
    this.selectedIssue = issue;
    data.issue = issue.issue;
    const dialogRef = this.dialog.open(ActionDialogComponent, {
      data,
      width: '600px'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const ecd = result['actionStartDate'];
        const od = result['actionEndDate'];

        if (ecd instanceof Moment) {
          result['actionStartDate'] = result['actionStartDate'].format('YYYY-MM-DD');
        } else if (Object.prototype.toString.call(ecd) === '[object Date]') {
          result['actionStartDate'] = Moment(ecd).format('YYYY-MM-DD');
        }

        if (od instanceof Moment) {
          result['actionEndDate'] = result['actionEndDate'].format('YYYY-MM-DD');
        } else if (Object.prototype.toString.call(od) === '[object Date]') {
          result['actionEndDate'] = Moment(od).format('YYYY-MM-DD');
        }

        let dataValues = [];
        _.forOwn(this.actionDataElements, function (dataElement, key) {
          if (result[key]) {
            dataValues = [...dataValues, { dataElement, value: result[key] }];
          }
        });

        let event = {
          trackedEntityInstance: this.selectedIssue.trackedEntityInstance,
          program: 'bsg7cZMTqgI',
          orgUnit: this.selectedIssue.orgUnit,
          programStage: 'KO6z9FXmPLv',
          eventDate: result['eventDate'] || Moment().format('YYYY-MM-DD'),
          dataValues
        };

        if (result.event) {
          event['event'] = result.event;
        }

        this.api.postEvent(event).subscribe(e => {
          this.snackBar.open('Action saved successfully', 'OK', {
            duration: 2000,
          });
          if (result.currentIssueStatus) {
            const attributes = _.map(this.selectedIssue.attributes, (value, key) => (
              { attribute: key, value: key === this.issueAttributes.issueStatus ? result.currentIssueStatus : value }
            ));

            const trackedEntityInstance = {
              orgUnit: this.selectedReport['orgUnit'],
              trackedEntityInstance: this.selectedIssue.trackedEntityInstance,
              trackedEntityType: 'MCPQUTHX1Ze',
              attributes,
            };

            this.api.postTrackedEntity(trackedEntityInstance).subscribe(hero => {
              this.getReport();
              this.snackBar.open('Issue updated successfully', 'OK', {
                duration: 2000,
              });
            }, error => {
              this.snackBar.open(error, 'Failed to save or update issue', {
                duration: 2000,
              });
            });
            this.getReport();
          }
        }, error => {
          this.snackBar.open(error, 'Failed', {
            duration: 2000,
          });
        });
      }
    });
  }

  createForm(data) {
    this.reportForm = this.fb.group({
      reportStartDate: [null, Validators.required],
      reportEndDate: [null, Validators.required],
      reportTitle: [null, Validators.required],
      reportDate: [null, Validators.required],
      achievementsSummary: [null],
      achievements: [null],
      constraints: [null],
      lessons: [null],
      reportStatus: ['Pending Approval']
    });
  }

  updateIssue(issueId, attributes) {
    const trackedEntityInstanceUpdate = {
      orgUnit: this.selectedReport['orgUnit'],
      attributes,
    };

    this.api.updateTrackedEntity(issueId, trackedEntityInstanceUpdate).subscribe(hero => {
      this.snackBar.open('Issue updated successfully', 'OK', {
        duration: 2000,
      });
    }, error => {
      this.snackBar.open(error, 'Failed', {
        duration: 2000,
      });
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
        dataValues = [...dataValues, { dataElement, value: form[key] }];
      }
    });

    const event = {
      trackedEntityInstance: this.selectedActivity['trackedEntityInstance'],
      program: 'MLb410Oz6cU',
      orgUnit: this.selectedActivity['orgUnit'],
      status: 'COMPLETED',
      programStage: 'FxImolXHCbY',
      eventDate: form['startDate'],
      dataValues
    };

    if (this.selectedReport !== null) {
      event['event'] = this.selectedReport.event;
    }

    this.api.postEvent(event).subscribe(e => {
      // const ref = e['response']['importSummaries'][0]['reference'];
      this.getReport();
      this.snackBar.open('Report updated successfully', 'OK', {
        duration: 2000,
      });
    });

  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
  }

  filter(val: string): Observable<any[]> {
    return this.api.getOptions('cm9EILDQe8K')
      .pipe(
        map(response => response.filter(option => {
          return option.code.toLowerCase().indexOf(val.toLowerCase()) === 0;
        }))
      );
  }

  approveReport() {
    if (this.selectedReport.event !== null) {
      const dataValues = [{ dataElement: this.reportDataElements.reportStatus, value: 'Approved' }];
      const event = {
        trackedEntityInstance: this.selectedActivity['trackedEntityInstance'],
        program: 'MLb410Oz6cU',
        orgUnit: this.selectedActivity['orgUnit'],
        programStage: 'FxImolXHCbY',
        event: this.selectedReport.event,
        dataValues
      };

      this.api.postEvent(event).subscribe(e => {
        this.getReport();
        this.snackBar.open('Report Appproved', 'OK', {
          duration: 2000,
        });
      });

    }
  }

  selectIssue(row) {
    if (row) {
      this.selectedIssue = row;
      this.api.getEvents(row.trackedEntityInstance, this.actionDataElements).subscribe((events) => {
        events = events.map(e => {
          e.issue = row.issue;
          return e;
        });
        this.actions = events;
        this.actionDataSource = new MatTableDataSource<any>(events);
        this.actionDataSource.paginator = this.actionPaginator;
        this.actionDataSource.sort = this.actionSort;
      });
    }
  }
  myFilter = (d): boolean => {
    const startDate = this.reportForm.get('reportStartDate').value;
    if (startDate) {
      if (startDate instanceof Moment) {
        return d >= startDate && d <= Moment();
      } else {
        return d.format('YYYY-MM-DD') >= startDate && d.format('YYYY-MM-DD') <= Moment().format('YYYY-MM-DD');
      }
    }
    return false;
  }
}
