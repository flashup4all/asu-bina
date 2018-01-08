import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ManageStaffComponent } from './manage-staff/manage-staff.component';

const routes: Routes = [
	{
		path: '',
		component: ManageStaffComponent
	}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StaffRoutingModule { }
