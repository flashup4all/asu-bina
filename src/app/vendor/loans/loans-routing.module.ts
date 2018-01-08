import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoanSettingsComponent } from './loan-settings/loan-settings.component';

const routes: Routes = [
	{
		path: 'settings',
		component:LoanSettingsComponent
	}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LoansRoutingModule { }
