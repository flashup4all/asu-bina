import { Component, OnInit, ViewContainerRef, HostListener } from '@angular/core';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { LocalService } from './storage/local.service';

@Component({
  // tslint:disable-next-line
  selector: 'body',
  template: '<router-outlet></router-outlet>',
  styleUrls: ['./app.component.scss']
})
export class AppComponent { 

	// @HostListener('window:unload', ['$event'])
	//   handleUnload(event) {
	//     this.logout();
	//   }
	constructor(public toastr: ToastsManager, vRef: ViewContainerRef, private localService: LocalService) {
		this.toastr.setRootViewContainerRef(vRef);
		
	}

	  logout()
	  {
	  	this.localService.ClearStorage()
	  }
}
