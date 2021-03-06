import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ManageContributionComponent } from './manage-contribution.component';
import { CollectionsComponent } from './collections/collections.component';
import { RunContributionComponent } from './run-contribution/run-contribution.component';
import { ContributionTypeComponent } from './contribution-type/contribution-type.component';
import { ContributionPlanComponent } from './contribution-plan/contribution-plan.component';
import { MemberContributionPlanComponent } from './member-contribution-plan/member-contribution-plan.component';

const routes: Routes = [
	{
		path: '',
		component: ManageContributionComponent
	},
	{
		path: 'collections',
		component: CollectionsComponent
	},
	{
		path: 'bulk-contributions',
		component: RunContributionComponent
	},
	{
		path: 'contribution-types',
		component: ContributionTypeComponent
	},
	{
		path: 'member-contribution-plan',
		component: MemberContributionPlanComponent
	}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManageContributionRoutingModule { }
