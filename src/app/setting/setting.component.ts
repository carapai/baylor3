import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-setting',
  template: `
  <mat-drawer-container class="example-container">
  <mat-drawer mode="side" opened="true">
  <mat-nav-list>
   <a mat-list-item [routerLink]="['projects']">Projects</a>
  <a mat-list-item [routerLink]="['objectives']">Objectives</a>
  <a mat-list-item [routerLink]="['result_areas']">Result Areas</a>
  <a mat-list-item [routerLink]="['activities']">Activities</a>
  </mat-nav-list>
  </mat-drawer>
  <mat-drawer-content>
  <router-outlet></router-outlet>
  </mat-drawer-content>
</mat-drawer-container>
    `,
  styleUrls: ['./setting.component.css']
})
export class SettingComponent implements OnInit {

  constructor() {
  }

  ngOnInit() {
  }

}
