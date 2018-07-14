import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { ContributionService } from '../contribution.service';
import { LocalService } from '../../../storage/local.service';

@Component({
  selector: 'app-contribution-type',
  templateUrl: './contribution-type.component.html',
  styleUrls: ['./contribution-type.component.scss']
})
export class ContributionTypeComponent implements OnInit {
	
	public contribution_type_form : FormGroup
	submitPending: boolean;
	vendor;
	user;
	editData;
	contribution_type_list:any;
	new_button : boolean;
	update_button : boolean;
  	@ViewChild('newContributionTypeModal') public newContributionTypeModal : ModalDirective;
  	@ViewChild('editContributionTypeModal') public editContributionTypeModal : ModalDirective;
  	constructor(
		private localService : LocalService,
  		private contributionService : ContributionService,
  		private _fb: FormBuilder,
  		) { 
  		this.new_button = true;
  		this.get_contribution_type();
  		this.vendor = JSON.parse(this.localService.getVendor());
		this.user = JSON.parse(this.localService.getUser());
  	}

  	ngOnInit() {
  		this.contribution_type_form = this._fb.group({
        name: [null, Validators.compose([Validators.required])],
  			code: [null, Validators.compose([Validators.required])],
  			description: ''
  		})
  	}

  	new_type()
  	{
  		this.editData = null;
  		this.update_button = false;
  		this.new_button = true;
  		this.newContributionTypeModal.show()
  	}

  	edit(data)
  	{
  		this.editData = data; 
  		this.update_button = true;
  		this.new_button = false;
  		this.newContributionTypeModal.show()
  	}
  	save_contribution_type(formValues, id=0)
  	{
  		this.submitPending = true;
  		if(id != 0)
  		{
  			formValues['id'] = id;
  		}
  		formValues['vendor_id'] = this.vendor.id;
  		formValues['staff_id'] = this.user.id;
  		this.contributionService.addContributionType(formValues).subscribe((response) => {
  			if(response.success)
  			{
  				this.submitPending = false;
  				this.get_contribution_type()
  				this.contribution_type_form.reset()
  				this.newContributionTypeModal.hide();
          		this.localService.showSuccess(response.message,'Operation Successfull');
  			}else{
  				this.submitPending = false;
          		this.localService.showError(response.message,'Operation Successfull');
          		this.localService.showError(response,'Operation Successfull');
  			}
  		}, (error) => {
          this.submitPending = false;
          this.localService.showError('Error!','Server Error, try again later or contact admin');

      })
  	}
  	get_contribution_type()
  	{
  		this.contributionService.get_contribution_type().subscribe((response) => {
  			this.contribution_type_list = response.data;
  		})
  	}

  	delete(id)
  	{
  		this.contributionService.delete_contribution_type(id).subscribe((response) => {
  			this.get_contribution_type()
          	this.localService.showSuccess('Operation Successful','Operation Successfull');
  		})
  	}
}
