import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { LocalService } from './storage/local.service';

@Component({
  // tslint:disable-next-line
  selector: 'body',
  template: '<router-outlet></router-outlet>'
})
export class AppComponent { 
	constructor(public toastr: ToastsManager, vRef: ViewContainerRef, private localService: LocalService) {
		this.toastr.setRootViewContainerRef(vRef);
		
	}
}
