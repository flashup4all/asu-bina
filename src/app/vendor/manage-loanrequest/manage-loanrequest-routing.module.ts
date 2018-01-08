import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ManageLoanrequestComponent } from './manage-loanrequest.component';
import { ViewRequestHistoryComponent } from './view-request-history/view-request-history.component';

const routes: Routes = [
	{
		path: '',
		component: ManageLoanrequestComponent
	},
	{
		path: ':loan-request-id/loan-request-history',
		component: ViewRequestHistoryComponent
	}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManageLoanrequestRoutingModule { }
