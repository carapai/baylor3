import {Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import * as _ from 'lodash';
import * as Moment from 'moment';
import {ApiService} from '../api.service';
import {FormBuilder, FormGroup, NgForm, Validators} from '@angular/forms';
import {TreeviewItem} from 'ngx-treeview';

@Component({
  selector: 'app-activity-form',
  templateUrl: './report-form.component.html',
  styleUrls: ['./activity.component.scss']
})
export class ReportFormComponent implements OnInit {
  reportForm: FormGroup;
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

  districts = [];

  constructor(private api: ApiService, private fb: FormBuilder) {
  }

  public ngOnInit() {
    // this.createForm();

    this.api.getOptions('NgCRbyGZhIM').subscribe((options) => {
      this.districts = options;
    });
  }

  onFormSubmit(form: NgForm) {
    /*let attributes = [];
    form.plannedStartDate = Moment(form.plannedStartDate).format('YYYY-MM-DD');
    form.plannedEndDate = Moment(form.plannedEndDate).format('YYYY-MM-DD');
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
      .subscribe(hero => console.log(hero));*/
  }
}
