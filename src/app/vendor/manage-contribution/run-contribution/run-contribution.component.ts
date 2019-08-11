import { Component, OnInit } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { LocalService } from '../../../storage/local.service';
import { ContributionService } from '../contribution.service';
import { XlsxToJsonService } from '../../../shared/xls/index'
//import * as FileSaver from 'file-saver';
import * as moment from 'moment';
import Swal from 'sweetalert2';
import { DeviceDetectorService } from 'ngx-device-detector';
import { AlertConfig } from 'ngx-bootstrap/alert';

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
  show_sucess_alert: boolean = false;
  	monthList;
  	contribution_plan_list;
  	current_year = moment().format('YYYY');
  	show_plan_members_loader: boolean = false;
  	show_bulk_contribution: boolean = false;
  	vendor_branch;
    success_msg: string;
	constructor(
		private localService : LocalService,
  		private _fb : FormBuilder,
      private deviceService: DeviceDetectorService,
  		private contributionService : ContributionService
  		) {
		this.vendor = JSON.parse(this.localService.getVendor());
		this.user = JSON.parse(this.localService.getUser());
        this.vendor_branch = JSON.parse(this.localService.getBranchData());
		//this.getAllCoorpMembers();
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
			status : [null, Validators.compose([Validators.required])],
			depositor : '',
			description : '',
			contributions : this._fb.array([])
		});
  	}

  	initMembersForm(data) {
      return this._fb.group({
        contribution: data.member.contribution,
        status: true,
        txn_status: 0,
        member_id: data.member.id,
        phone1: data.member.phone1,
        name: data.member.first_name
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
    Swal.fire({
      title: `Close this Loan Request`,
      text: 'Are You Sure You want to Close this Loan Request?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes!'
      }).then((result) => {
      if (result.value) {
          formValues['vendor_id'] = this.vendor.id;
          formValues['branch_id'] = this.vendor_branch.id;
          formValues['approved_by'] = this.user.id;
          formValues['staff_id'] = this.user.id;
          formValues['user_id'] = this.user.user_id;
          formValues['mode'] = 'ntxn';
          formValues['app_channel'] = 'web';
          formValues['device_info'] = 'browser: '+ this.deviceService.getDeviceInfo().browser + ' /browser_version: ' + this.deviceService.getDeviceInfo().browser_version + ' /device: ' + this.deviceService.getDeviceInfo().device + ' /os: '+this.deviceService.getDeviceInfo().os;
          formValues.transaction_type = 'credit';
          
          this.show_plan_members_loader = true;
          this.contributionService.runEditedContributions(formValues).subscribe((response) => {
            if (response.success) {
              this.show_plan_members_loader = false;
              this.show_sucess_alert = true;
              this.success_msg = response.message;
              this.runContributionForm.reset();
              this.localService.showSuccess(response.message,'Operation Successfull');
            }else{
              this.show_plan_members_loader = false;
                    this.localService.showError(response.message,'Operation Unsuccessfull');
            }
          }, (error) => {
            this.submitPending = false;
                  this.localService.showError(error,'Operation Unsuccessfull');
          });
        }
      })      
	}

  hide_success_alert()
  {
    this.show_sucess_alert = false;
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

	/**
     * @method show_bulk_contribution_form
     * show bulk contribution form by selecting 
     * the plan that bulk contribution should be made
     * @return boolean
     */
    show_bulk_contribution_form()
    {
      this.show_bulk_contribution =!this.show_bulk_contribution
    }
    /**
     * @method get_plan_members
     * get the plan id fron the form and use it
     * to form a route and return the route
     * the plan id will be use to pull members that belongs to that plan
     * @return route
     */
    get_plan_members(plan_id)
    {
      this.show_plan_members_loader = true;
      const control = <FormArray>this.runContributionForm.controls['contributions'];
          for(let i = control.length-1; i >= 0; i--) {
          control.removeAt(i)
        }
      this.contributionService.get_all_plan_members(plan_id).subscribe((response) => {
      	this.coorpMembers = response;
      	this.coorpMembers.forEach((list)=> 
	        (<FormArray>this.runContributionForm.controls['contributions']).push(this.initMembersForm(list))
	    );
      	this.show_plan_members_loader = false;
      }, (error) => {
      	this.show_plan_members_loader = false;
      })
    }
}
