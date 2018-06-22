import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import * as _ from 'lodash';
import * as Moment from 'moment';
import { ApiService } from '../api.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { distinctUntilChanged, map, startWith, switchMap } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-activity-form',
  templateUrl: './activity-form.component.html',
  styleUrls: ['./activity.component.css']
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
  positions: Observable<any[]>;
  users: Observable<any[]>;
  orgUnits = [];
  levels = [];
  currentUser = {};
  selectedLevel = {};
  activities = [];
  projects = [];
  resultAreas = [];
  objectives = [];

  maxDate = new Date();

  constructor(private api: ApiService, private fb: FormBuilder, public router: Router, public snackBar: MatSnackBar) {
  }

  public ngOnInit() {

    this.api
      .getFromDataStore('baylor', 'activities')
      .subscribe(
        (activities) => {
          this.activities = activities;
        }, error1 => console.log(error1), () => {
        });

    this.api
      .getFromDataStore('baylor', 'projects')
      .subscribe(
        (projects) => {
          this.projects = projects;
        }, error1 => console.log(error1), () => {
        });

    this.api
      .getFromDataStore('baylor', 'resultAreas')
      .subscribe(
        (resultAreas) => {
          this.resultAreas = resultAreas;
        }, error1 => console.log(error1), () => {
        });

    this.api
      .getFromDataStore('baylor', 'objectives')
      .subscribe(
        (objectives) => {
          this.objectives = objectives;
        }, error1 => console.log(error1), () => {
        });

    this.api.getUserDetails().subscribe(u => {
      const submittedBy = this.activityForm.get('submittedBy');
      submittedBy.setValue(u['displayName']);
    });

    this.api.getLevels().subscribe((levels) => {
      this.levels = levels;
    }, error1 => console.log(error1), () => {
      this.selectedLevel = _.find(this.levels, { level: 5 });
      this.getOrgUnits(this.selectedLevel);
    });


    this.createForm();


    // this.resultAreas = this.activityForm.get('resultArea').valueChanges
    //   .pipe(
    //     startWith(null),
    //     distinctUntilChanged(),
    //     switchMap(val => {
    //       return this.filter(val || '');
    //     })
    //   );

    this.positions = this.activityForm.get('officerPosition').valueChanges
      .pipe(
        startWith(null),
        distinctUntilChanged(),
        switchMap(val => {
          return this.filterPositions(val || '');
        })
      );

    this.users = this.activityForm.get('implementor').valueChanges
      .pipe(
        startWith(null),
        distinctUntilChanged(),
        switchMap(val => {
          return this.filterUsers(val || '');
        })
      );

    // this.objectives = this.activityForm.get('objective').valueChanges
    //   .pipe(
    //     startWith(null),
    //     distinctUntilChanged(),
    //     switchMap(val => {
    //       return this.filterObjectives(val || '');
    //     })
    //   );

    this.activityForm.controls['activityCode'].valueChanges.subscribe((value) => {
      const { resultArea, activityName, activityCode } = _.find(this.activities, { activityCode: value });
      const { objective } = _.find(this.resultAreas, { resultAreaCode: resultArea.resultAreaCode });
      const { project } = _.find(this.objectives, { objectiveCode: objective.objectiveCode });
      this.activityForm.controls['resultArea'].patchValue(resultArea.resultAreaCode + ' - ' + resultArea.resultAreaName);
      this.activityForm.controls['objective'].patchValue(objective.objectiveCode + ' - ' + objective.objectiveName);
      this.activityForm.controls['activity'].patchValue(activityCode + ' - ' + activityName);
      this.activityForm.controls['projectName'].patchValue(project.projectCode + ' - ' + project.projectName);
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
      where: [null, Validators.required],
      output: [null],
      projectName: [null, Validators.required],
      resultArea: [null, Validators.required],
      objective: [null, Validators.required],
      submittedBy: [this.currentUser['displayName' || '']],
      implementor: [null, Validators.required],
      officerPosition: [null],
    });
  }


  processErrors(response) {
    let errors = [];
    let conflicts = [];
    let successes = [];
    if (response['status'] === 500) {
      errors = [...errors, { ...response['error'] }];
    } else if (response['status'] === 409) {
      _.forEach(response['error']['response']['importSummaries'], (s) => {
        _.forEach(s['conflicts'], (conflict) => {
          conflicts = [...conflicts, { ...conflict }];
        });
        if (s['href']) {
          successes = [...successes, { href: s['href'] }];
        }
      });
    } else if (response['httpStatusCode'] === 200) {
      _.forEach(response['response']['importSummaries'], (s) => {
        successes = [...successes, { href: s['href'] }];
      });
    }
    return { errors, conflicts, successes };
  }

  onFormSubmit() {

    if (this.activityForm.valid) {
      const form = this.activityForm.value;
      let attributes = [];
      form['plannedStartDate'] = Moment(form['plannedStartDate']).format('YYYY-MM-DD');
      form['plannedEndDate'] = Moment(form['plannedEndDate']).format('YYYY-MM-DD');
      const date = Moment().format('YYYY-MM-DD');
      _.forOwn(this.attributeIds, function (attribute, key) {
        if (form[key]) {
          attributes = [...attributes, { attribute, value: form[key] }];
        }
      });

      const trackedEntityInstances = form['where'].map(val => {
        const enrollments = [{
          orgUnit: val,
          program: 'MLb410Oz6cU',
          enrollmentDate: date,
          incidentDate: date
        }];
        return { orgUnit: val, trackedEntityType: 'MCPQUTHX1Ze', attributes, enrollments };
      });

      const instances = { trackedEntityInstances: trackedEntityInstances };
      this.api.postTrackedEntity(instances)
        .subscribe(hero => {
          this.snackBar.open('Activities created', 'OK', {
            duration: 2000,
          });
          this.router.navigate(['/activities']);

        }, error1 => {

        });
    } else {
      this.validateAllFormFields(this.activityForm);
    }
  }

  onSelectedChange(e) {
    const where = this.activityForm.get('where');
    const final = e.map(val => {
      const v = val.split(',');
      return { displayName: v[1], value: v[0] };
    });

    this.orgUnits = final;

    where.setValue([...final.map(v => {
      return v.value;
    })]
    );
  }


  filter(val: string): Observable<any[]> {
    return this.api.getOptions('cSq9uATtwqT')
      .pipe(
        map(response => response.filter(option => {
          return option.code.toLowerCase().indexOf(val.toLowerCase()) === 0;
        }))
      );
  }

  filterPositions(val: string): Observable<any[]> {
    return this.api.getOptions('ohw99gJ7W8F')
      .pipe(
        map(response => response.filter(option => {
          return option.code.toLowerCase().indexOf(val.toLowerCase()) === 0;
        }))
      );
  }

  filterUsers(val: string): Observable<any[]> {
    return this.api.getAllUserDetails()
      .pipe(
        map(response => response.filter(option => {
          return option.displayName.toLowerCase().indexOf(val.toLowerCase()) === 0;
        }))
      );
  }

  filterObjectives(val: string): Observable<any[]> {
    return this.api.getOptions('VTihgLmiPAv')
      .pipe(
        map(response => response.filter(option => {
          return option.code.toLowerCase().indexOf(val.toLowerCase()) === 0;
        }))
      );
  }


  onFilterChange(e) {
  }

  getOrgUnits(e) {
    const level1 = 'id,displayName';
    const level2 = 'id,displayName,children[id,displayName]';
    const level3 = 'id,displayName,children[id,displayName,children[id,displayName]]';
    const level4 = 'id,displayName,children[id,displayName,children[id,displayName,children[id,displayName]]]';
    const level5 = 'id,displayName,children[id,displayName,children[id,displayName,children[id,displayName,children[id,displayName]]]]';
    const level6 = 'id,displayName,children[id,displayName,children[id,displayName,children[id,displayName,children[id,displayName,' +
      'children[id,displayName]]]]]';
    const level7 = 'id,displayName,children[id,displayName,children[id,displayName,children[id,displayName,children[id,displayName,' +
      'children[id,displayName,children[id,displayName]]]]]]';
    const level8 = 'id,displayName,children[id,displayName,children[id,displayName,children[id,displayName,children[id,displayName,' +
      'children[id,displayName,children[id,displayName,children[id,displayName]]]]]]]';
    switch (e.level) {
      case 1:
        this.api
          .getOrgUnitChildren('HrlmR2Iolvn', level1)
          .subscribe(
            (units) => {
              this.items = [units];
            }
          );
        break;
      case 2:
        this.api
          .getOrgUnitChildren('HrlmR2Iolvn', level2)
          .subscribe(
            (units) => {
              this.items = [units];
            }
          );
        break;
      case 3:
        this.api
          .getOrgUnitChildren('HrlmR2Iolvn', level3)
          .subscribe(
            (units) => {
              this.items = [units];
            }
          );
        break;
      case 4:
        this.api
          .getOrgUnitChildren('HrlmR2Iolvn', level4)
          .subscribe(
            (units) => {
              this.items = [units];
            }
          );
        break;
      case 5:
        this.api
          .getOrgUnitChildren('HrlmR2Iolvn', level5)
          .subscribe(
            (units) => {
              this.items = [units];
            }
          );
        break;
      case 6:
        this.api
          .getOrgUnitChildren('HrlmR2Iolvn', level6)
          .subscribe(
            (units) => {
              this.items = [units];
            }
          );
        break;
      case 7:
        this.api
          .getOrgUnitChildren('HrlmR2Iolvn', level7)
          .subscribe(
            (units) => {
              this.items = [units];
            }
          );
        break;
      case 8:
        this.api
          .getOrgUnitChildren('HrlmR2Iolvn', level8)
          .subscribe(
            (units) => {
              this.items = [units];
            }
          );
        break;
      default:
        break;
    }
  }

  validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup) {
        this.validateAllFormFields(control);
      }
    });
  }

  myFilter = (d): boolean => {
    const startDate = this.activityForm.get('plannedStartDate');
    if (startDate.value) {
      return d >= startDate.value
    }
    return false;
  }
}
