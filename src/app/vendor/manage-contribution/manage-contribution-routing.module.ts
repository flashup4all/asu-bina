import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ManageContributionComponent } from './manage-contribution.component';
import { CollectionsComponent } from './collections/collections.component';
import { RunContributionComponent } from './run-contribution/run-contribution.component';

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
		path: 'run-contributions',
		component: RunContributionComponent
	}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManageContributionRoutingModule { }
