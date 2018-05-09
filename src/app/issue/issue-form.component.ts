import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ApiService} from '../api.service';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';

@Component({
  selector: 'app-issue',
  templateUrl: './issue-form.component.html',
  styleUrls: ['./issue.component.css']
})
export class IssueFormComponent implements OnInit {

  constructor(private api: ApiService, public router: Router, private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const transaction = params.get('transaction');
      console.log(transaction);
    });
  }

}
