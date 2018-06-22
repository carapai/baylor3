import {Component, OnInit, ViewChild} from '@angular/core';
import {MatDialog, MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {Router} from '@angular/router';
import {ApiService} from '../api.service';
import {ProjectDialogComponent} from './dialogs/dialogs.component';

@Component({
  selector: 'app-project-setting',
  templateUrl: './project-setting.component.html',
  styleUrls: ['./setting.component.css']
})
export class ProjectSettingComponent implements OnInit {

  displayedColumns = [
    'projectCode',
    'projectName',
    // 'action'
  ];

  dataSource = null;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  projects = [];

  constructor(private api: ApiService, public router: Router, public dialog: MatDialog) {
  }

  ngOnInit() {
    this.api
      .getFromDataStore('baylor', 'projects')
      .subscribe(
        (projects) => {
          this.projects = projects;
        }, error1 => console.log(error1), () => {
          this.dataSource = new MatTableDataSource<any>(this.projects);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        });
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(ProjectDialogComponent, {
      width: '600px'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.projects = [...this.projects, result];

        if (this.projects.length > 1) {
          this.api.updateDataStore('baylor', 'projects', this.projects).subscribe(response => {
          }, error1 => console.log(error1), () => {
            this.dataSource = new MatTableDataSource<any>(this.projects);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
          });
        } else {
          this.api.addToDataStore('baylor', 'projects', this.projects).subscribe(response => {
          }, error1 => console.log(error1), () => {
            this.dataSource = new MatTableDataSource<any>(this.projects);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
          });
        }
      }
    });
  }

}
