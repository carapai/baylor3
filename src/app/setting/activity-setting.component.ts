import {Component, OnInit, ViewChild} from '@angular/core';
import {MatDialog, MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {Router} from '@angular/router';
import {ApiService} from '../api.service';
import {ActivityDialogComponent, ProjectDialogComponent} from './dialogs/dialogs.component';

@Component({
  selector: 'app-activity-setting',
  templateUrl: './activity-setting.component.html',
  styleUrls: ['./setting.component.css']
})
export class ActivitySettingComponent implements OnInit {

  displayedColumns = [
    'activityCode',
    'activityName',
    'resultAreaCode',
    // 'action'
  ];

  dataSource = null;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  activities = [];

  constructor(private api: ApiService, public router: Router, public dialog: MatDialog) {
  }

  ngOnInit() {
    this.api
      .getFromDataStore('baylor', 'activities')
      .subscribe(
        (activities) => {
          this.activities = activities;
        }, error1 => console.log(error1), () => {
          this.dataSource = new MatTableDataSource<any>(this.activities);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        });
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(ActivityDialogComponent, {
      width: '600px'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.activities = [...this.activities, result];

        if (this.activities.length > 1) {
          this.api.updateDataStore('baylor', 'activities', this.activities).subscribe(response => {
          }, error1 => console.log(error1), () => {
            this.dataSource = new MatTableDataSource<any>(this.activities);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
          });
        } else {
          this.api.addToDataStore('baylor', 'activities', this.activities).subscribe(response => {
          }, error1 => console.log(error1), () => {
            this.dataSource = new MatTableDataSource<any>(this.activities);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
          });
        }
      }
    });
  }

}
