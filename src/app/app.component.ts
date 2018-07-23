import { Component, OnInit, ViewContainerRef, HostListener } from '@angular/core';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { LocalService } from './storage/local.service';
import {Idle, DEFAULT_INTERRUPTSOURCES} from '@ng-idle/core';
import {Keepalive} from '@ng-idle/keepalive';
import { AuthService } from './auth/auth.service';
import { Router } from '@angular/router';

@Component({
  // tslint:disable-next-line
  selector: 'body',
  template: '<router-outlet></router-outlet>',
  styleUrls: ['./app.component.scss']
})
export class AppComponent { 

	idleState = '';
	timedOut = false;
	idleState_check: boolean = false;
	lastPing?: Date = null;
	session_data
	// @HostListener('window:unload', ['$event'])
	//   handleUnload(event) {
	//     this.logout();
	//   }
	constructor(
		public toastr: ToastsManager, 
		vRef: ViewContainerRef, 
    	private router: Router,
		private localService: LocalService,
		private idle: Idle, 
    	private authService : AuthService,
    	private keepalive: Keepalive 
    ) {
   		this.session_data = JSON.parse(this.localService.getSessionData());
		this.toastr.setRootViewContainerRef(vRef);
		idle.watch()
      idle.setIdle(500);
    // sets a timeout period of 5 seconds. after 10 seconds of inactivity, the user will be considered timed out.
      idle.setTimeout(100);

      idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);

    idle.onIdleEnd.subscribe(() => {
      this.idleState_check = false; 
      this.idleState = 'No longer idle.'
    });
    idle.onTimeout.subscribe(() => {
      this.idleState_check = true;
      this.idleState = 'Timed out!';
      this.if_idle()
      this.timedOut = true;
    });
    idle.onIdleStart.subscribe(() => {
      this.idleState_check = true;
      this.idleState = 'You\'ve gone idle!'
    });
    idle.onTimeoutWarning.subscribe((countdown) => this.idleState = 'You will time out in ' + countdown + ' seconds!');

    // sets the ping interval to 15 seconds
    keepalive.interval(15);

    keepalive.onPing.subscribe(() => this.lastPing = new Date());
		
	}

	if_idle()
  {
    this.idle.stop()
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
          this.router.navigate(['auth']);
  }
	  logout()
	  {
	  	this.localService.ClearStorage()
	  }
}
