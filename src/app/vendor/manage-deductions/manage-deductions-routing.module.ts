import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ManageDeductionsComponent } from './manage-deductions.component';
import { RunDeductionsComponent } from './run-deductions/run-deductions.component';
import { DeductionRepaymentTypesComponent } from './deduction-repayment-types/deduction-repayment-types.component';

const routes: Routes = [
	{
		path: '',
		component: ManageDeductionsComponent
	},
	{
		path: 'run-deductions',
		component: RunDeductionsComponent
	},
	{
		path: 'deductions-types',
		component: DeductionRepaymentTypesComponent
	}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManageDeductionsRoutingModule { }
