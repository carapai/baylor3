import {Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, MatSnackBar, MatSort, MatTableDataSource} from '@angular/material';
import * as _ from 'lodash';
import * as Moment from 'moment';
import {ApiService} from '../api.service';
import {FormBuilder, FormGroup, NgForm, Validators} from '@angular/forms';
import {TreeviewItem} from 'ngx-treeview';
import {Router} from '@angular/router';

@Component({
  selector: 'app-activity-form',
  templateUrl: './activity-form.component.html',
  styleUrls: ['./activity.component.scss']
})
export class ActivityFormComponent implements OnInit {
  activityForm: FormGroup;
  attributeIds = {
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
  config = {
    hasAllCheckBox: true,
    hasFilter: true,
    hasCollapseExpand: true,
    decoupleChildFromParent: false,
    maxHeight: 700
  };

  items = [];
  objectives = [];
  resultAreas = [];
  positions = [];
  orgUnits = [];

  constructor(private api: ApiService, private fb: FormBuilder, public router: Router, public snackBar: MatSnackBar) {
  }

  public ngOnInit() {
    this.createForm();

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
  }

  createForm() {
    const n = 'A' + Moment().format('YYYYMMDD') + (Math.floor(Math.random() * 1000) + 1).toString().padStart(3, '0');
    this.activityForm = this.fb.group({
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

  onFormSubmit(form: NgForm) {
    let attributes = [];
    form['plannedStartDate'] = Moment(form['plannedStartDate']).format('YYYY-MM-DD');
    form['plannedEndDate'] = Moment(form['plannedEndDate']).format('YYYY-MM-DD');
    console.log(form);
    const date = Moment().format('YYYY-MM-DD');
    _.forOwn(this.attributeIds, function (attribute, key) {
      if (form[key]) {
        attributes = [...attributes, {attribute, value: form[key]}];
      }
    });

    const trackedEntityInstances = this.orgUnits.map(val => {
      const enrollments = [{
        orgUnit: val,
        program: 'MLb410Oz6cU',
        enrollmentDate: date,
        incidentDate: date
      }];
      return {orgUnit: val, trackedEntityType: 'MCPQUTHX1Ze', attributes, enrollments};
    });

    const instances = {trackedEntityInstances: trackedEntityInstances};
    this.api.postTrackedEntity(instances)
      .subscribe(hero => {
        this.snackBar.open('Activities created', 'OK', {
          duration: 2000,
        });
        this.router.navigate(['/activities']);

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
