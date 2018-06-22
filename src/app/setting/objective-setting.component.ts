import {Component, OnInit, ViewChild} from '@angular/core';
import {MatDialog, MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {Router} from '@angular/router';
import {ApiService} from '../api.service';
import {ObjectiveDialogComponent, ProjectDialogComponent} from './dialogs/dialogs.component';

@Component({
  selector: 'app-objective-setting',
  templateUrl: './objective-setting.component.html',
  styleUrls: ['./setting.component.css']
})
export class ObjectiveSettingComponent implements OnInit {

  displayedColumns = [
    'objectiveCode',
    'objectiveName',
    'projectCode',
    // 'action'
  ];

  dataSource = null;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  objectives = [];

  constructor(private api: ApiService, public router: Router, public dialog: MatDialog) {
  }

  ngOnInit() {
    this.api
      .getFromDataStore('baylor', 'objectives')
      .subscribe(
        (objectives) => {
          this.objectives = objectives;
        }, error1 => console.log(error1), () => {
          this.dataSource = new MatTableDataSource<any>(this.objectives);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        });
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(ObjectiveDialogComponent, {
      width: '600px'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.objectives = [...this.objectives, result];

        if (this.objectives.length > 1) {
          this.api.updateDataStore('baylor', 'objectives', this.objectives).subscribe(response => {
          }, error1 => console.log(error1), () => {
            this.dataSource = new MatTableDataSource<any>(this.objectives);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
          });
        } else {
          this.api.addToDataStore('baylor', 'objectives', this.objectives).subscribe(response => {
          }, error1 => console.log(error1), () => {
            this.dataSource = new MatTableDataSource<any>(this.objectives);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
          });
        }
      }
    });
  }

}
