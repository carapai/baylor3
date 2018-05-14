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
    this.api.getOptions('NgCRbyGZhIM').subscribe((options) => {
      this.districts = options;
    });
  }
}
