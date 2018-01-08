import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MembersFormComponent } from './members-form/members-form.component';

const routes: Routes = [
	{
		path: 'members',
		component: MembersFormComponent
	}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FormSettingsRoutingModule { }
