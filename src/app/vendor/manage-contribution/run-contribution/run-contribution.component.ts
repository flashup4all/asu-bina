import { Component, OnInit } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { LocalService } from '../../../storage/local.service';
import { ContributionService } from '../contribution.service';
import { XlsxToJsonService } from '../../../shared/xls/index'
//import * as FileSaver from 'file-saver';
import * as moment from 'moment';

@Component({
  selector: 'app-run-contribution',
  templateUrl: './run-contribution.component.html',
  styleUrls: ['./run-contribution.component.scss']
})
export class RunContributionComponent implements OnInit {

  	public vendor;
  	public user;
	public coorpMembers = [];
	public contribution_type_list;
	public runContributionForm : FormGroup;
	file;
	public result: any;
	submitPending: boolean;
  	monthList;
  	contribution_plan_list;
  	current_year = moment().format('YYYY');
	constructor(
		private localService : LocalService,
  		private _fb : FormBuilder,
  		private contributionService : ContributionService
  		) {
		this.vendor = JSON.parse(this.localService.getVendor());
		this.user = JSON.parse(this.localService.getUser());
		this.getAllCoorpMembers();
		this.get_contribution_type()
		this.monthList = this.localService.yearjson();
		//this.getChangeContributionRequest();
		this.get_contribution_plan()
  	}
  	ngOnInit() {
  		this.runContributionForm = this._fb.group({
			period : [null, Validators.compose([Validators.required])],
			type : [null, Validators.compose([Validators.required])],
			date : [null, Validators.compose([Validators.required])],
			plan_id : [null, Validators.compose([Validators.required])],
			contributions : this._fb.array([])
		});
  	}

  	initMembersForm(data) {
        return this._fb.group({
        contribution: data.contribution,
        status: true,
        id: data.id,
        name: data.first_name
      });
    }
    get_contribution_type()
  	{
  		this.contributionService.get_contribution_type().subscribe((response) => {
  			this.contribution_type_list = response.data;
  		})
  	}
  	/**
	 * @method getAllCoorpMembers
	 * get vendor contrinbution
	 * @return data
	 */
	getAllCoorpMembers()
	{
		this.contributionService.getAllCoorpMembers().subscribe((response) => {
			this.coorpMembers = response.data
			//create form controls for the members contribution items
	      this.coorpMembers.forEach((list)=> 
	            (<FormArray>this.runContributionForm.controls['contributions']).push(this.initMembersForm(list))
	        );
		});
	}

	runContribution(formValues)
	{
		formValues['vendor_id'] = this.vendor.id
		formValues['approved_by'] = this.user.id
        formValues.transaction_type = 'credit';
		
		this.submitPending = true;
		this.contributionService.runEditedContributions(formValues).subscribe((response) => {
			if (response.success) {
				this.submitPending = false;
          		this.localService.showSuccess(response.message,'Operation Successfull');
			}else{
          		this.localService.showError(response.message,'Operation Unsuccessfull');
			}
		}, (error) => {
			this.submitPending = false;
          	this.localService.showError(error,'Operation Unsuccessfull');
		});
	}

	get_contribution_plan()
    {
      this.submitPending = true;
      this.contributionService.get_contribution_plan().subscribe((response) => {
        this.contribution_plan_list = response;
        this.submitPending = false;
      })
    }
	checkAll(event)
	{
		console.log(event)
	}
}
