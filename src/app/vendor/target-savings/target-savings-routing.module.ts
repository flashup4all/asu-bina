import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TargetSavingsComponent } from './target-savings.component';

const routes: Routes = [
	{
		path: '',
		component: TargetSavingsComponent
	}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TargetSavingsRoutingModule { }
