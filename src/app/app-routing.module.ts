import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ActivityComponent} from './activity/activity.component';
import {ActivityFormComponent} from './activity/activity-form.component';
import {ActivityDetailComponent} from './activity/activity-detail.component';
import {IssueComponent} from './issue/issue.component';
import {ReportFormComponent} from './activity/report-form.component';
import {IssueDetailComponent} from './issue/issue-detail.component';
import {IssueFormComponent} from './issue/issue-form.component';
import {DashboardComponent} from './dasboard/dashboard.component';
import {ActivityTransactionComponent} from './activity/activity-transaction.component';

const routes: Routes = [
  {path: '', component: ActivityComponent},
  {path: 'activities', component: ActivityComponent},
  {path: 'issues', component: IssueComponent},
  {path: 'activities/:id', component: ActivityDetailComponent},
  {path: 'activities/:transaction/related', component: ActivityTransactionComponent},
  {path: 'activities/:id/report', component: ReportFormComponent},
  {path: 'reports/:transaction/issue', component: IssueFormComponent},
  {path: 'add/activity', component: ActivityFormComponent},
  // {path: 'add/report', component: ReportFormComponent},
  {path: 'add/issue', component: ActivityFormComponent},
  {path: 'add/action', component: ActivityFormComponent},
  {path: 'issues/:id', component: IssueDetailComponent}
];


@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule {
}
