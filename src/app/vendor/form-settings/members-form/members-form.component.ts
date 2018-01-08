import { Component, OnInit } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal/modal.component';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LocalService } from '../../../storage/local.service';
import { FormService } from '../form.service';
@Component({
  selector: 'app-members-form',
  templateUrl: './members-form.component.html',
  styles: [
    `.fa-spinner {
      -animation: spin .7s infinite linear;
      -webkit-animation: spin2 .7s infinite linear;
    }`,
    `@-webkit-keyframes spin2 {
      from { -webkit-transform: rotate(0deg);}
      to { -webkit-transform: rotate(360deg);}
    }`
  ]
})
export class MembersFormComponent implements OnInit {
	public formPool : FormGroup;
	public membersFormPoolList;
	public vendor;
	submitPending:boolean;
	constructor(
		private localService : LocalService,
  		private _fb : FormBuilder,
  		private memberFormService : FormService,

  		) { 
		this.vendor = JSON.parse(this.localService.getVendor());
		this.getFormFields();
		
	}

	ngOnInit() {
		/*form pool setup*/
		this.formPool = this._fb.group({
			kind: '',
			label: '',
			placeholder: '',
			type: ''
		});
	}

	addFormField(data)
	{
		data['vendor_id'] = this.vendor.id;
		this.submitPending = true;
  		data['vendor_id'] = JSON.parse(this.localService.getVendor()).id;
  		this.memberFormService.addFormField(data).subscribe((response) => {
  	 		if(response.success = true)
			{
				this.submitPending = false;
	 			this.getFormFields()
	 			this.formPool.reset();
				this.localService.showSuccess(response.message,'Operation Successfull');
			}
			else{
				this.submitPending = false;
				this.localService.showError(response.message,'Operation Unsuccessfull');
			}
  	 	});
	}
	getFormFields()
	{
		this.memberFormService.getFormField().subscribe((response) => {
			this.membersFormPoolList = response.data
		});
	}
	deleteFormField(id)
	{
		if(window.confirm('are you sure you want to delete this field'))
		{
			this.memberFormService.deleteFormField(id).subscribe((response) => {
			this.getFormFields();
			this.localService.showSuccess(response.message,'Operation Successfull');

		})
		}
	}
}
