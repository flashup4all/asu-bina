import { Component, OnInit } from '@angular/core';
import { Router} from '@angular/router';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { LocalService } from '../../storage/local.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent implements OnInit {

 	public signinForm : FormGroup;
	submitPending : boolean;
  	constructor( 
  		private _fb : FormBuilder, 
  		private signinService : AuthService,
  		private localService : LocalService,
  		private router : Router
  		  ) { }

	ngOnInit() {
	  	this.signinForm = this._fb.group({
	  		email : [null, Validators.compose([Validators.required, Validators.email])],
	  		password : [null, Validators.compose([Validators.required])]
	  	})
	}
	/**
	 * @auth
	 * authenticates a staff
	 * @returns token or error
	 */
	auth(data)
	{
		this.submitPending = true;
	    let auth = this.signinService.authenticate(data);
	    auth.then(response => {
          if(response.success === 1){
            this.submitPending = false;
            this.localService.showSuccess('Login Successful, you will be redirected in a moment', 'Operation Successfull')
            this.localService.setToken(response.token);
            //this.user = response.user;
            this.localService.setUser(JSON.stringify(response.user));
            this.localService.setVendor(JSON.stringify(response.vendor));
            //this.jwt(response);
            this.authNavigate(response.user);
          }
          else{
              // if user login fails, trigger toastr error here with
              // response.error
            // this.localService.notify(response.error, 'invalid login credentials', 'error');
            this.localService.showError(response.error, "Invalid Login Credentials");
            this.submitPending = false;
            //this.router.navigate(['/'])
          }
        })
            this.submitPending = false;
  }
  authNavigate(user){
    switch (user.role_id) {
      case 2:
        // code...
        this.router.navigate(['/dashboard']);

        break;
      case 3:
        // code...
        // if(user.flag !=1)
        // {
        //   this.router.navigate(['/coorp/setup']);
        // }else{
          this.router.navigate(['/dashboard']);
        //}

        break;
        case 4:
        // code...
        this.router.navigate(['/app/members']);

        break;
      default:
        // code...
        break;
    }
    //this.router.navigate(['/coorp/dashboard']);
  }

}
