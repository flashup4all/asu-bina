import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ManageWidthdrawalsComponent } from './manage-widthdrawals.component';
const routes: Routes = [
	{
		path: '',
		component: ManageWidthdrawalsComponent
	}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManageWidthdrawalsRoutingModule { }
