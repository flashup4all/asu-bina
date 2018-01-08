import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { LocalService } from '../../storage/local.service';
@Injectable()
export class AuthGuardService implements CanActivate{

  	constructor(private localStorage: LocalService, private router: Router) {}

   /**
 	*  Protects the routes to reach with authentication
 	*/
	canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
	    // Set user authentication state depending on the token's existance
	    // this.auth.setLoggedInState();
	    // Check user authentication state
	    if (this.localStorage.getToken() && this.localStorage.getUser()) {
	      // Explicit navigation to '/signin' while the user is already authenticated
	      if (state.url === '/auth') {
              this.router.navigate(['/dashboard'])
        //   let group = JSON.parse(this.localStorage.GetProfile()).group_id;
        //   switch(group){
        //     case 1:
        //       this.router.navigate(['/app/staff/dashboard'])
        //     break;
        //     case 2:
        //       this.router.navigate(['/app/student/dashboard'])
        //     break;
        //     case 3:
        //       this.router.navigate(['/app/guardian/dashboard'])
        //     break;
        //   }
	      }
	      return true;
	    } else {
	      // Allow route to './signin' to get authenticated
	      if (state.url === '/auth') {
	        return true;
	      }
	      // Explicit navigation to any URL while not being authenticated
	      this.router.navigate(['/auth']);
	      return false;
	    }
	  }

}
