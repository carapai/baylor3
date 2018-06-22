import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {ApiService} from '../../api.service';

@Component({
  selector: 'app-project-dialog',
  templateUrl: 'project-dialog.html',
})
export class ProjectDialogComponent implements OnInit {
  projectForm: FormGroup;


  constructor(private api: ApiService,
              public dialogRef: MatDialogRef<ProjectDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private fb: FormBuilder) {
  }

  public ngOnInit() {
    this.createForm();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  createForm() {
    this.projectForm = this.fb.group({
      projectCode: [null, Validators.required],
      projectName: [null, Validators.required]
    });
  }
}


@Component({
  selector: 'app-objective-dialog',
  templateUrl: 'objective-dialog.html',
})
export class ObjectiveDialogComponent implements OnInit {
  objectiveForm: FormGroup;
  projects = [];

  constructor(private api: ApiService,
              public dialogRef: MatDialogRef<ObjectiveDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private fb: FormBuilder) {
  }

  public ngOnInit() {
    this.api
      .getFromDataStore('baylor', 'projects')
      .subscribe(
        (projects) => {
          this.projects = projects;
        }, error1 => console.log(error1), () => {
        });
    this.createForm();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  createForm() {
    this.objectiveForm = this.fb.group({
      objectiveCode: [null, Validators.required],
      objectiveName: [null, Validators.required],
      project: [null, Validators.required]
    });
  }
}


@Component({
  selector: 'app-result-area-dialog',
  templateUrl: 'result-area-dialog.html',
})
export class ResultAreaDialogComponent implements OnInit {
  resultAreaForm: FormGroup;
  objectives = [];

  constructor(private api: ApiService,
              public dialogRef: MatDialogRef<ResultAreaDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private fb: FormBuilder) {
  }

  public ngOnInit() {
    this.api
      .getFromDataStore('baylor', 'objectives')
      .subscribe(
        (objectives) => {
          this.objectives = objectives;
        }, error1 => console.log(error1), () => {
        });
    this.createForm();

  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  createForm() {
    this.resultAreaForm = this.fb.group({
      resultAreaCode: [null, Validators.required],
      resultAreaName: [null, Validators.required],
      objective: [null, Validators.required]
    });
  }
}

@Component({
  selector: 'app-activity-dialog',
  templateUrl: 'activity-dialog.html',
})
export class ActivityDialogComponent implements OnInit {
  activityForm: FormGroup;
  resultAreas = [];

  constructor(private api: ApiService,
              public dialogRef: MatDialogRef<ActivityDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private fb: FormBuilder) {
  }

  public ngOnInit() {
    this.api
      .getFromDataStore('baylor', 'resultAreas')
      .subscribe(
        (resultAreas) => {
          this.resultAreas = resultAreas;
        }, error1 => console.log(error1), () => {
        });
    this.createForm();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  createForm() {
    this.activityForm = this.fb.group({
      activityCode: [null, Validators.required],
      activityName: [null, Validators.required],
      resultArea: [null, Validators.required]
    });
  }
}

