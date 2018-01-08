import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MessageCenterComponent } from './message-center.component';

const routes: Routes = [
	{
		path: '',
		component: MessageCenterComponent
	}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MessageCenterRoutingModule { }
