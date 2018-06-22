import {Component, OnInit, ViewChild} from '@angular/core';
import {MatDialog, MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {Router} from '@angular/router';
import {ApiService} from '../api.service';
import {ProjectDialogComponent, ResultAreaDialogComponent} from './dialogs/dialogs.component';

@Component({
  selector: 'app-result-area-setting',
  templateUrl: './result-area-setting.component.html',
  styleUrls: ['./setting.component.css']
})
export class ResultAreaSettingComponent implements OnInit {

  displayedColumns = [
    'resultAreaCode',
    'resultAreaName',
    'objectiveCode',
    // 'action'
  ];

  dataSource = null;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  resultAreas = [];

  constructor(private api: ApiService, public router: Router, public dialog: MatDialog) {
  }

  ngOnInit() {
    this.api
      .getFromDataStore('baylor', 'resultAreas')
      .subscribe(
        (resultAreas) => {
          this.resultAreas = resultAreas;
        }, error1 => console.log(error1), () => {
          this.dataSource = new MatTableDataSource<any>(this.resultAreas);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        });
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(ResultAreaDialogComponent, {
      width: '600px'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.resultAreas = [...this.resultAreas, result];

        if (this.resultAreas.length > 1) {
          this.api.updateDataStore('baylor', 'resultAreas', this.resultAreas).subscribe(response => {
          }, error1 => console.log(error1), () => {
            this.dataSource = new MatTableDataSource<any>(this.resultAreas);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
          });
        } else {
          this.api.addToDataStore('baylor', 'resultAreas', this.resultAreas).subscribe(response => {
          }, error1 => console.log(error1), () => {
            this.dataSource = new MatTableDataSource<any>(this.resultAreas);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
          });
        }
      }
    });
  }

}
