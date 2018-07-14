import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { DeductionsService } from '../deductions.service';
import { LocalService } from '../../../storage/local.service';

@Component({
  selector: 'app-deduction-repayment-types',
  templateUrl: './deduction-repayment-types.component.html',
  styleUrls: ['./deduction-repayment-types.component.scss']
})
export class DeductionRepaymentTypesComponent implements OnInit {

	public contribution_type_form : FormGroup
	submitPending: boolean;
	vendor;
	user;
	editData;
	deduction_type_list:any;
	new_button : boolean;
	update_button : boolean;
  	@ViewChild('newContributionTypeModal') public newContributionTypeModal : ModalDirective;
  	@ViewChild('editContributionTypeModal') public editContributionTypeModal : ModalDirective;
  	constructor(
		private localService : LocalService,
  		private deductionService : DeductionsService,
  		private _fb: FormBuilder,
  		) { 
  		this.new_button = true;
  		this.get_deduction_type();
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
  	save_deduction_type(formValues, id=0)
  	{
  		this.submitPending = true;
  		if(id != 0)
  		{
  			formValues['id'] = id;
  		}
  		formValues['vendor_id'] = this.vendor.id;
  		formValues['staff_id'] = this.user.id;
  		this.deductionService.addRepaymentType(formValues).subscribe((response) => {
  			if(response.success)
  			{
  				this.submitPending = false;
  				this.get_deduction_type()
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
        this.localService.showError('Error','Server Error, please tryagein or contact administrator');
      })
  	}
  	get_deduction_type()
  	{
  		this.deductionService.get_repayment_type().subscribe((response) => {
  			this.deduction_type_list = response.data;
  		})
  	}

  	delete(id)
  	{
  		this.deductionService.delete_repayment_type(id).subscribe((response) => {
  			this.get_deduction_type()
          	this.localService.showSuccess('Operation Successful','Operation Successfull');
  		})
  	}

}
