import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {NgModule} from '@angular/core';
import {AppComponent} from './app.component';
import {MaterialAppModule} from './ngmaterial.module';
import {ApiService} from './api.service';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {TokenInterceptor} from './token.interceptor';
import {ActivityComponent} from './activity/activity.component';
import {IssueComponent} from './issue/issue.component';
import {AppRoutingModule} from './app-routing.module';
import {ActivityFormComponent} from './activity/activity-form.component';
import {HashLocationStrategy, LocationStrategy} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {DefaultTreeviewEventParser, TreeviewEventParser, TreeviewModule} from 'ngx-treeview';
import {FlexLayoutModule} from '@angular/flex-layout';
import {ReportFormComponent} from './activity/report-form.component';
import {IssueDetailComponent} from './issue/issue-detail.component';
import {IssueFormComponent} from './issue/issue-form.component';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material';
import {MomentDateAdapter} from '@angular/material-moment-adapter';
import {DashboardComponent} from './dasboard/dashboard.component';
import {SplitModule} from './split/split.module';
import {ActivityTransactionComponent} from './activity/activity-transaction.component';
import {ActionDialogComponent, IssueDialogComponent, ReportDialogComponent} from './activity/dialogs.component';
import {ActivityDetailComponent} from './activity/activity-detail.component';
import {UploadModule} from './upload/upload.module';
import {ReportComponent} from './report/report.component';
import {TreeModule} from 'ng2-tree';
import {SettingComponent} from './setting/setting.component';
import {ProjectSettingComponent} from './setting/project-setting.component';
import {ObjectiveSettingComponent} from './setting/objective-setting.component';
import {ResultAreaSettingComponent} from './setting/result-area-setting.component';
import {ActivitySettingComponent} from './setting/activity-setting.component';
import {
  ActivityDialogComponent,
  ObjectiveDialogComponent,
  ProjectDialogComponent,
  ResultAreaDialogComponent
} from './setting/dialogs/dialogs.component';


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
    SettingComponent,
    ProjectSettingComponent,
    ActivitySettingComponent,
    ObjectiveSettingComponent,
    ResultAreaSettingComponent,
    ProjectDialogComponent,
    ResultAreaDialogComponent,
    ObjectiveDialogComponent
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
    TreeviewModule.forRoot(),
    TreeModule
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
    {provide: TreeviewEventParser, useClass: DefaultTreeviewEventParser}

  ],
  entryComponents: [
    IssueDialogComponent,
    ReportDialogComponent,
    ActionDialogComponent,
    ActivityDialogComponent,
    ProjectDialogComponent,
    ResultAreaDialogComponent,
    ObjectiveDialogComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
