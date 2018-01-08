import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ManageMembersComponent } from './manage-members/manage-members.component';
import { ViewMemberComponent } from './view-member/view-member.component';
const routes: Routes = [
	{
		path: 'manage-members',
		component: ManageMembersComponent
	},
	{
		path: ':member_id/view',
		component: ViewMemberComponent
	}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MembershipRoutingModule { }
