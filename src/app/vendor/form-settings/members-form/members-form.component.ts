import { Component, OnInit } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LocalService } from '../../../storage/local.service';
import { FormService } from '../form.service';
import { MembersService } from '../../membership/members.service';

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
	public formPool: FormGroup;
	public membersFormPoolList;
	public vendor;
	user;
	submitPending: boolean;
	login_details_loader: boolean;
	constructor(
		private localService: LocalService,
		private _fb: FormBuilder,
		private manageMemberService: MembersService,
		private memberFormService: FormService,

	) {
		this.vendor = JSON.parse(this.localService.getVendor());
		this.user = JSON.parse(this.localService.getUser());
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

	addFormField(data) {
		data['vendor_id'] = this.vendor.id;
		this.submitPending = true;
		data['vendor_id'] = JSON.parse(this.localService.getVendor()).id;
		this.memberFormService.addFormField(data).subscribe((response) => {
			if (response.success = true) {
				this.submitPending = false;
				this.getFormFields()
				this.formPool.reset();
				this.localService.showSuccess(response.message, 'Operation Successfull');
			}
			else {
				this.submitPending = false;
				this.localService.showError(response.message, 'Operation Unsuccessfull');
			}
		});
	}
	getFormFields() {
		this.memberFormService.getFormField().subscribe((response) => {
			this.membersFormPoolList = response.data
		});
	}
	deleteFormField(id) {
		if (window.confirm('are you sure you want to delete this field')) {
			this.memberFormService.deleteFormField(id).subscribe((response) => {
				this.getFormFields();
				this.localService.showSuccess(response.message, 'Operation Successfull');

			})
		}
	}

	/**
	 * @method activateAllMember
	 * activate member
	 * @return data
	 */
	activateAllMember() {
		this.submitPending = true;
		let data = {
			user_id: this.user.user_id,
			staff_id: this.user.id,
			vendor_id: this.vendor.id
		}
		this.manageMemberService.activateAllMember(data).subscribe((response) => {
			if (response.success == true) {
				this.submitPending = false;
				this.localService.showSuccess(response.message, 'Operation Successfull');
			} else {
				this.submitPending = false;
				this.localService.showError(response.message, 'Operation UnsSuccessfull');
			}
		}, (error) => {
			this.submitPending = false;
			this.localService.showError('Please contact administrator', 'Server Error !!');
		});
	}

	/**
	 * @method deactivateAllMember
	 * activate member
	 * @return data
	 */
	deactivateAllMember() {
		this.submitPending = true;
		let data = {
			user_id: this.user.user_id,
			vendor_id: this.vendor.id
		}
		this.manageMemberService.deactivateAllMember(data).subscribe((response) => {
			this.submitPending = false
			if (response.success == true) {
				this.localService.showSuccess(response.message, 'Operation Successfull');
			} else {
				this.localService.showError(response.message, 'Operation UnsSuccessfull');
			}
		}, (error)=>{ 
			this.submitPending = false;
				this.localService.showError('Server Error', 'Please contact Admin/support');			
		});
	}

	/**
	 * @method send_login_details_to_all_members
	 * send login details to all members
	 *  @return response 
	*/
	send_login_details_to_all_members()
	{
		this.login_details_loader = true;
		let data = {
			user_id: this.user.user_id,
			staff_id: this.user.id,
			vendor_id: this.vendor.id
		}
		this.manageMemberService.send_login_details_to_all_members(data).subscribe((response) => {
			this.login_details_loader = false
			if (response.success == true) {
				this.localService.showSuccess(response.message, 'Operation Successfull');
			} else {
				this.localService.showError(response.message, 'Operation UnsSuccessfull');
			}
		}, (error) => {
			this.login_details_loader = false;
			this.localService.showError('Server Error', 'Please contact Admin/support');
		});
	}
}
