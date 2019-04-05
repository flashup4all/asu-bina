import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray} from '@angular/forms';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { ContributionService } from '../contribution.service';
import { LocalService, currency } from '../../../storage/index';
import { MemberUploadToPlan } from '../../../shared/models/index';

@Component({
  selector: 'app-upload-members-to-plan',
  templateUrl: './upload-members-to-plan.component.html',
  styleUrls: ['./upload-members-to-plan.component.scss']
})
export class UploadMembersToPlanComponent implements OnInit {

	member_plan_upload_form: FormGroup;
	submitPending: boolean = false;
	vendor:any;
	user:any;
	contribution_plan_list: any;
	members;
	members_list:any;
	show_plan_members_loader:any;
	contribution_type_list:any;
  	vendor_branch:any; 
  	current_page:number;
  	last_page:number;
  	total_unassigned:number;
  	no_per_page: number;
  	pagination: any;
  	totalItems: number = 64;
  	currentPage: number   = 4;
  	smallnumPages: number = 0;

  	total = 0;
  page = 1;
  limit = 20;
  	constructor(
	  	private localService : LocalService,
	  	private contributionService : ContributionService,
	    //private exportService: TableExportService,
	  	private _fb: FormBuilder,
  		) 
  	{
  		this.vendor = JSON.parse(this.localService.getVendor());
		this.user = JSON.parse(this.localService.getUser());
        this.vendor_branch = JSON.parse(this.localService.getBranchData());
  		this.get_contribution_plan();
  		this.get_unassigned_members(0);
  		this.get_contribution_type();
  	}

  	ngOnInit() {
  		this.member_plan_upload_form = this._fb.group({
			// plan_id : [null, Validators.compose([Validators.required])],
			status : [null, Validators.compose([Validators.required])],
			//depositor : '',
			//description : '',
			plans : this._fb.array([])
		});
  	}
  	/**
  	 * @method get_contribution_type
  	 * get contribution types
  	 *
  	 */
  	get_contribution_type()
  	{
  		this.contributionService.get_contribution_type().subscribe((response) => {
  			this.contribution_type_list = response.data;
  		})
  	}
  	/**
  	 * @method init_members_form
  	 * initiates members into the form array
  	 */
  	init_members_form(data) {
        return this._fb.group({
        //contribution: data.member.contribution,
        status: true,
        member_id: data.id,
		plan_id : [null, Validators.compose([Validators.required])],

      });
    }
    	/**
	 * @method get_unassigned_members
	 * get unassigned members
	 * @return data
	 */
	get_unassigned_members(page)
	{
		this.submitPending=true;
		this.contributionService.get_unassigned_plan_members(page).subscribe((response) => {
			this.submitPending=false;
			this.members_list = response.data;
			this.current_page = response.current_page;
			this.last_page = response.last_page;
			this.no_per_page = response.per_page;
			this.total_unassigned = response.total;
         	this.members_list.forEach((member)=> 
	            (<FormArray>this.member_plan_upload_form.controls['plans']).push(this.init_members_form(member))
	        );
	        //this.last_page +=1;
         	this.pagination = Array.from(Array(this.last_page).keys());
		}, (error) => {
			console.log(error)
		});
	}
  	/**
  	 * @method get_contribution_plan
  	 * get vendor contribution plans
  	 */
  	get_contribution_plan()
  	{
      this.submitPending = true;
  		this.contributionService.get_contribution_plan().subscribe((response) => {
  			this.contribution_plan_list = response;
        this.submitPending = false;
  		})
  	}
  	/**
	 * @method assign_members_to_plans
	 * get vendor contrinbution
	 * @return data
	 */
	assign_members_to_plans(form_values)
	{
		this.show_plan_members_loader = true;
		form_values['vendor_id'] = this.vendor.id
		form_values['branch_id'] = this.vendor_branch.id
		form_values['approved_by'] = this.user.id
		form_values['staff_id'] = this.user.id
		form_values['user_id'] = this.user.user_id
		this.contributionService.assign_plan_to_members(form_values).subscribe((response) => {
			if(response.success)
			{
				const control = <FormArray>this.member_plan_upload_form.controls['plans'];
				for(let i = control.length-1; i >= 0; i--) {
					control.removeAt(i)
				}
				this.get_unassigned_members(0);
				this.show_plan_members_loader = false;
	    		this.localService.showSuccess(response.message,'Operation Successfull');
			}else{
				this.show_plan_members_loader = false;
	    		this.localService.showError(response.message,'Operation Successfull');
			}
		}, (error) => {
			this.show_plan_members_loader = false;
	    	this.localService.showError('Server Error','Please contact admin');

		});
	}

	/**
	 *
	 *
	 */
	 checkAll(event)
	 {

	 }

	/**
	 * @method get_next_page
	 * get next pagination
	 */
	get_next_page(page)
	{
		const control = <FormArray>this.member_plan_upload_form.controls['plans'];
			for(let i = control.length-1; i >= 0; i--) {
			control.removeAt(i)
		}
		this.get_unassigned_members(page);
	}
}
