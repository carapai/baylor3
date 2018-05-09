import {Component, OnInit} from '@angular/core';
import {ApiService} from '../api.service';

@Component({
  selector: 'app-dasboard',
  templateUrl: './dasboard.component.html',
  styleUrls: ['./dasboard.component.scss']
})
export class DashboardComponent implements OnInit {
  items = [];
  value = null;

  config = {
    hasAllCheckBox: true,
    hasFilter: true,
    hasCollapseExpand: true,
    decoupleChildFromParent: false,
    maxHeight: 700
  };

  constructor(private api: ApiService) {
  }

  ngOnInit() {

    this.api
      .getOrgUnitChildren('HrlmR2Iolvn')
      .subscribe(
        (units) => {
          this.items = [units];
        }
      );
  }

  onSelectedChange(e) {
    console.log(e);
  }

  onFilterChange(e) {
    console.log(e);
  }

  onValueChange(e) {
    console.log(e);
  }

}
