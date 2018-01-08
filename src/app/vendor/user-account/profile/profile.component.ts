import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, FormControl, Validators} from '@angular/forms';
//import { CustomValidators } from 'ng2-validation';
//import { ModalDirective } from 'ngx-bootstrap/modal';
import { LocalService } from '../../../storage/local.service';
import { VendorService } from '../../vendor.service';
const password = new FormControl('', Validators.required);

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

	public vendor;
	public user;
	public editUserInfo : FormGroup;
  	public editUserPassword : FormGroup;
  	updateUsercheck: boolean;
  	updatePassword: boolean;

  	constructor(
  		private localService : LocalService,
      	private vendorService : VendorService,
      	private fb : FormBuilder,
  		) {

  		this.vendor = JSON.parse(this.localService.getVendor());
    	this.user = JSON.parse(this.localService.getUser());
  	}

  	ngOnInit() {
  		/*admin info form*/
    /*this.editUserInfo = this.fb.group( {
      email: [null, Validators.compose([Validators.required])],
      name: [null, Validators.compose([Validators.required])],
      mobile_no: [null, Validators.compose([Validators.required])]
    } );*/
    /*admin password form*/
    this.editUserPassword = this.fb.group( {
      //email: [null, Validators.compose([Validators.required])],
      old_password: [null, Validators.compose([Validators.required])],
      new_password: [null, Validators.compose([Validators.required, Validators.minLength[5]])],
      new_password_again: [null, Validators.compose([Validators.required, Validators.minLength[5]])]
    } );
  	}

	updateUserPassword(data)
	  {
	    this.updatePassword = true;
	    data['user_id'] = this.user.user_id;
	    let updateInfoRequest = this.vendorService.updatePassword(data);
	      updateInfoRequest.subscribe((response)=>{
	        if(response.message){
	          this.updatePassword = false;
            this.editUserPassword.reset();
	         this.localService.showSuccess(response.message, 'Operation Unsuccessful');
	         
	        }else{
	           this.updatePassword = false;
	           this.localService.showError(response, 'Operation Unsuccessful');
	           this.localService.showError(response.message, 'Operation Unsuccessful');
	        } 
	      }, (error) => {
	          this.updatePassword = false;
	           this.localService.showError(error, 'Operation Unsuccessful');

	      })   
	  }
}
