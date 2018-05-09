import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ApiService} from '../api.service';
import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import * as Moment from 'moment';
import * as _ from 'lodash';

@Component({
  selector: 'app-activity-dialog',
  templateUrl: 'activity-dialog.html',
})
export class ActivityDialogComponent implements OnInit {
  activityForm: FormGroup;

  items = [];
  objectives = [];
  resultAreas = [];
  positions = [];
  orgUnits = [];

  config = {
    hasAllCheckBox: false,
    hasFilter: false,
    hasCollapseExpand: true,
    decoupleChildFromParent: true,
    maxHeight: 500
  };


  constructor(private api: ApiService, public dialogRef: MatDialogRef<ActivityDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder) {
  }

  public ngOnInit() {

    this.api
      .getOrgUnitChildren('HrlmR2Iolvn')
      .subscribe(
        (units) => {
          this.items = [units];
        }
      );

    this.api.getOptions('VTihgLmiPAv').subscribe((options) => {
      this.objectives = options;
    });

    this.api.getOptions('cSq9uATtwqT').subscribe((options) => {
      this.resultAreas = options;
    });

    this.api.getOptions('ohw99gJ7W8F').subscribe((options) => {
      this.positions = options;
    });
    this.createForm();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  createForm() {
    const n = 'A' + Moment().format('YYYYMMDD') + (Math.floor(Math.random() * 1000) + 1).toString().padStart(3, '0');
    this.activityForm = this.fb.group({
      hideRequired: false,
      floatLabel: 'auto',
      activityCode: [null, Validators.required],
      transactionCode: [n],
      activity: [null, Validators.required],
      submissionDate: [Moment(), null],
      plannedStartDate: [null],
      plannedEndDate: [null],
      where: [null],
      output: [null],
      projectName: [null],
      resultArea: [null],
      objective: [null],
      submittedBy: [null],
      implementor: [null],
      officerPosition: [null],

    });
  }

  onSelectedChange(e) {
    const where = this.activityForm.get('where');
    const final = e.map(val => {
      return val.split(',')[1];
    });

    this.orgUnits = e.map(val => {
      return val.split(',')[0];
    });
    where.setValue(final.reverse().join(','));
  }

  onFilterChange(e) {
    console.log(e);
  }
}

@Component({
  selector: 'app-issue-dialog',
  templateUrl: 'issue-dialog.html',
})
export class IssueDialogComponent implements OnInit {
  issueForm: FormGroup;
  areas = [];
  issueStatus = [];

  constructor(private api: ApiService, public dialogRef: MatDialogRef<IssueDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder) {
  }

  public ngOnInit() {
    this.api.getOptions('jefqZMCkKCZ').subscribe((options) => {
      this.areas = options;
    });
    this.api.getOptions('qiInvioKxhh').subscribe((options) => {
      this.issueStatus = options;
    });
    this.createForm();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  createForm() {
    this.issueForm = this.fb.group({
      registrationDate: [this.data['registrationDate'] || Moment(), Validators.required],
      issue: [this.data['issue'], Validators.required],
      technicalArea: [this.data['technicalArea'], Validators.required],
      transactionCode: [this.data['transactionCode'], Validators.required],
      report: [this.data['report'], Validators.required],
      trackedEntityInstance: [this.data['trackedEntityInstance']],
      issueStatus: [this.data['issueStatus']],
    });
  }

}

@Component({
  selector: 'app-action-dialog',
  templateUrl: 'action-dialog.html',
})
export class ActionDialogComponent implements OnInit {
  actionForm: FormGroup;
  status = [];
  outcomes = [];

  constructor(private api: ApiService, public dialogRef: MatDialogRef<ActionDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder) {
  }

  public ngOnInit() {
    this.api.getOptions('GOUUD9RIdv6').subscribe((options) => {
      this.status = options;
    });
    this.api.getOptions('qiInvioKxhh').subscribe((options) => {
      this.outcomes = options;
    });
    this.createForm();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  createForm() {
    this.actionForm = this.fb.group({
      action: [this.data['action'], Validators.required],
      expectedCompletionDate: [this.data['expectedCompletionDate'] || Moment(), Validators.required],
      responsiblePerson: [this.data['responsiblePerson'], Validators.required],
      actionStatus: [this.data['actionStatus'], Validators.required],
      outcome: [this.data['outcome'], Validators.required],
      outcomeDate: [this.data['outcomeDate'] || Moment(), Validators.required],
      event: [this.data['event']],
      eventDate: [this.data['eventDate'] || Moment()],
    });
  }

}

@Component({
  selector: 'app-report-dialog',
  templateUrl: 'report-dialog.html',
})
export class ReportDialogComponent implements OnInit {
  reportForm: FormGroup;

  constructor(private api: ApiService, public dialogRef: MatDialogRef<ReportDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder) {
  }

  public ngOnInit() {
    this.createForm();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  createForm() {
    this.reportForm = this.fb.group({
      startDate: [null, Validators.required],
      endDate: [null, Validators.required],
      district: [null, Validators.required],
      date: [null, Validators.required],
      achievementsSummary: [null],
      achievements: [null],
      constraints: [null],
      lessons: [null]
    });
  }
}
