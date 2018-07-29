import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ManageStaffComponent } from './manage-staff/manage-staff.component';
import { ViewStaffComponent } from './view-staff/view-staff.component';

const routes: Routes = [
	{
		path: '',
		component: ManageStaffComponent
	},
	{
		path: ':staff_id/view',
		component: ViewStaffComponent
	}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StaffRoutingModule { }
