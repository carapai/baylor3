import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {NgModule} from '@angular/core';
import {AppComponent} from './app.component';
import {MaterialAppModule} from './ngmaterial.module';
import {ApiService} from './api.service';
import {HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';
import {TokenInterceptor} from './token.interceptor';
import {ActivityComponent} from './activity/activity.component';
import {IssueComponent} from './issue/issue.component';
import {AppRoutingModule} from './app-routing.module';
import {ActivityFormComponent} from './activity/activity-form.component';
import {HashLocationStrategy, LocationStrategy} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {TreeviewModule} from 'ngx-treeview';
import {FlexLayoutModule} from '@angular/flex-layout';
import {ReportFormComponent} from './activity/report-form.component';
import {IssueDetailComponent} from './issue/issue-detail.component';
import {IssueFormComponent} from './issue/issue-form.component';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material';
import {MomentDateAdapter} from '@angular/material-moment-adapter';
import {DashboardComponent} from './dasboard/dashboard.component';
import {SplitModule} from './split/split.module';
import {ActivityTransactionComponent} from './activity/activity-transaction.component';
import {ActionDialogComponent, ActivityDialogComponent, IssueDialogComponent, ReportDialogComponent} from './activity/dialogs.component';
import {ActivityDetailComponent} from './activity/activity-detail.component';
import {UploadModule} from './upload/upload.module';
import {ReportComponent} from './report/report.component';

export const MY_FORMATS = {
  parse: {
    dateInput: 'YYYY-MM-DD',
  },
  display: {
    dateInput: 'LL',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};


@NgModule({
  declarations: [
    AppComponent,
    ActivityComponent,
    ActivityFormComponent,
    ActivityDetailComponent,
    IssueComponent,
    IssueDetailComponent,
    IssueFormComponent,
    ReportFormComponent,
    IssueDialogComponent,
    ReportDialogComponent,
    ActionDialogComponent,
    DashboardComponent,
    ActivityTransactionComponent,
    ActivityDialogComponent,
    ReportComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FlexLayoutModule,
    SplitModule,
    MaterialAppModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    UploadModule,
    TreeviewModule.forRoot()
  ],
  providers: [ApiService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    },
    {provide: LocationStrategy, useClass: HashLocationStrategy},

    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},

    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},

  ],
  entryComponents: [IssueDialogComponent, ReportDialogComponent, ActionDialogComponent, ActivityDialogComponent],
  bootstrap: [AppComponent]
})
export class AppModule {
}
