import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LocalService } from '../../storage/local.service';
import { AuthService } from '../../auth/auth.service';
import * as moment from 'moment';

@Component({
  selector: 'app-header',
  templateUrl: './app-header.component.html'
})
export class AppHeaderComponent {

	user;
  vendor;
  session_data;
  branch;
	constructor(
    private localService: LocalService, 
    private router: Router,
    private authService : AuthService,
    ) {
    console.log(JSON.parse(this.localService.getSessionData()))
    this.user = JSON.parse(this.localService.getUser());
    this.vendor = JSON.parse(this.localService.getVendor());
    this.session_data = JSON.parse(this.localService.getSessionData());
		this.branch = JSON.parse(this.localService.getBranchData());
	  //console.log(this.session_data)
  }
	logout()
	{
		// this.localService.clearStorage();
    this.authService.logout(this.session_data.id).subscribe((response) => {
      if(response.success)
      {
        window.localStorage.clear()
        this.router.navigate(['auth'])
      }
    }, (error) => {
        window.localStorage.clear()
        this.router.navigate(['auth'])
    })
	}
  format_date(date)
  {
    return moment(date)
  }
}
