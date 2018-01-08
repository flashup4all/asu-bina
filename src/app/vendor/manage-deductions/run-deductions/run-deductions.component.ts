import { Component, OnInit } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal/modal.component';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { LocalService } from '../../../storage/local.service';
import { DeductionsService } from '../deductions.service';
import { LoanRequestService } from '../../manage-loanrequest/loan-request.service';

import * as moment from 'moment';

@Component({
  selector: 'app-run-deductions',
  templateUrl: './run-deductions.component.html',
  styleUrls: ['./run-deductions.component.scss']
})
export class RunDeductionsComponent implements OnInit {

  	public vendor;
  	public user;
	public loanRequest = [];
	public runDeductionForm : FormGroup;
	file;
	public result: any;
	submitPending: boolean;
  	monthList;
  	current_year = moment().format('YYYY');
	constructor(
		private localService : LocalService,
  		private _fb : FormBuilder,
  		private deductionService : DeductionsService,
  		private loanRequestService : LoanRequestService
  		) {
		this.vendor = JSON.parse(this.localService.getVendor());
		this.user = JSON.parse(this.localService.getUser());
		this.getAllCoorpMembersLoans();
		this.monthList = this.localService.yearjson();
		console.log(this.monthList)
		//this.getChangeContributionRequest();
  	}
  	ngOnInit() {
  		this.runDeductionForm = this._fb.group({
			period : [null, Validators.compose([Validators.required])],
			deductions : this._fb.array([])
		});
  	}

  	initMembersForm(data) {
        return this._fb.group({
        amount: data.monthly_deductions,
        status: true,
       	member_id: data.member.id,
       	loan_id: data.type.id,
       	id: data.id,
        
      });
    }

  	/**
	 * @method getAllCoorpMembers
	 * get vendor contrinbution
	 * @return data
	 */
	getAllCoorpMembersLoans()
	{
		this.loanRequestService.getAllLoanRequest().subscribe((response) => {
			this.loanRequest = response.data
			//create form controls for the members contribution items
	      this.loanRequest.forEach((list)=> 
	            (<FormArray>this.runDeductionForm.controls['deductions']).push(this.initMembersForm(list))
	        );
		});
	}

	runDeductions(formValues)
	{
		formValues['vendor_id'] = this.vendor.id
		formValues['approved_by'] = this.user.id
		this.submitPending = true;
		this.deductionService.runEditedDeductions(formValues).subscribe((response) => {
			if (response.success) {
				this.submitPending = false;
          		this.localService.showSuccess(response.message,'Operation Successfull');
			}else{
				this.submitPending = false;
          		this.localService.showError(response.message,'Operation Unsuccessfull');
			}
		}, (error) => {
			this.submitPending = false;
          	this.localService.showError(error,'Operation Unsuccessfull');
		});
	}

}
