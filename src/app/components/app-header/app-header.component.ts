import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LocalService } from '../../storage/local.service';

@Component({
  selector: 'app-header',
  templateUrl: './app-header.component.html'
})
export class AppHeaderComponent {

	user;
  vendor;
	constructor(private localService: LocalService, private router: Router) {

    this.user = JSON.parse(this.localService.getUser());
		this.vendor = JSON.parse(this.localService.getVendor());
	}
	logout()
  	{
      window.localStorage.clear()
  		// this.localService.clearStorage();
  		this.router.navigate(['auth'])
  	}
}
