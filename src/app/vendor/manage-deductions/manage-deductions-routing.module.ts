import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ManageDeductionsComponent } from './manage-deductions.component';
import { RunDeductionsComponent } from './run-deductions/run-deductions.component';

const routes: Routes = [
	{
		path: '',
		component: ManageDeductionsComponent
	},
	{
		path: 'run-deductions',
		component: RunDeductionsComponent
	}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManageDeductionsRoutingModule { }
