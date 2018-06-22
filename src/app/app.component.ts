import {Component, OnInit} from '@angular/core';
import { environment } from '../environments/environment';

const url = environment.dhis2;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  home = url;
  public ngOnInit() {
  }
}


