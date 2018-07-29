import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router} from '@angular/router';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { LocalService } from '../../storage/local.service';
import { Title } from '@angular/platform-browser';
import { environment } from '../../../environments/environment';
import { DomainService } from '../../shared/services/domain.service';
import { DeviceDetectorService } from 'ngx-device-detector';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent implements OnInit {

 	public signinForm : FormGroup;
  isDataAvailable: boolean = false;
	submitPending : boolean = false;
  vendor;
  device_info;
  session_data
  image_url;
  	constructor( 
  		 private route : ActivatedRoute,
        private _fb : FormBuilder, 
      private signinService : AuthService,
  		private domainService : DomainService,
  		private localService : LocalService,
        private titleService: Title,
  		private router : Router,
      private deviceService: DeviceDetectorService
  		  ) { 
            this.image_url = environment.api.imageUrl+'logo/';
       
    }

	ngOnInit() {
    var url = window.location.hostname;
    let domain = url.split(".")
    console.log(window.location.hostname)
    console.log(domain[0]);
    this.signinService.verify_domain(domain[0]).subscribe((response) => {
      console.log(response)
      this.vendor = response.data;
    })
    /*this.route.data
        .subscribe((data) => {
          console.log(data)
           if(!data.school){
            this.titleService.setTitle(`${ environment.application_name }`);
            this.isDataAvailable = false;
            //this.router.navigate(['/domain-does-not-exist']);
          }else{
            this.vendor = data.school;
            this.titleService.setTitle(`${ (this.vendor.name) ? this.vendor.name : 'ASUSU'} ( ${ environment.application_name } ) Login`);
            this.isDataAvailable = true;
          }
        });*/
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
    data['device_info'] = this.deviceService.getDeviceInfo();
	    let auth = this.signinService.authenticate(data);
	    auth.then(response => {
          if(response.success){
            this.submitPending = false;
            this.localService.showSuccess('Login Successful, you will be redirected in a moment', 'Operation Successfull')
            this.localService.setToken(response.token);
            //this.user = response.user;
            this.localService.setUser(JSON.stringify(response.user));
            this.localService.setVendor(JSON.stringify(response.vendor));
            this.localService.setSessionData(JSON.stringify(response.session_data));
            //this.jwt(response);
            this.authNavigate(response.user);
          } else{
            this.submitPending = false;
              // if user login fails, trigger toastr error here with
              // response.error
              if(response['session_data'])
              {
                this.session_data = response.session_data
                this.device_info = JSON.parse(response.session_data.device_info)
              }
              
              //console.log(this.device_info)
            // this.localService.notify(response.error, 'invalid login credentials', 'error');
            this.localService.showError(response.error, "Invalid Login Credentials");
            // this.device_info = JSON.parse(JSON.parse(this.localService.getSessionData()).device_info);
            // console.log(this.device_info)
            //this.router.navigate(['/'])
          }
        }, (error)=> {
          this.submitPending = false;
          this.localService.showError(error, "Invalid Login Credentials");
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
  logout()
  {
    this.signinService.logout(this.session_data.id).subscribe((response) => {
      if(response.success)
      {
        this.device_info = 0
        window.localStorage.clear()
        this.router.navigate(['auth'])
      }
    }, (error) => {
        window.localStorage.clear()
        this.router.navigate(['auth'])
    })
  }
}
