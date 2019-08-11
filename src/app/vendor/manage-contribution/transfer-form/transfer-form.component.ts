import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators} from '@angular/forms';
import { ContributionService } from '../contribution.service';
import { LocalService, currency } from '../../../storage/index';
import { MembersService } from '../../membership/members.service';
import {Observable} from 'rxjs/Observable';
import {of} from 'rxjs/observable/of';
import { environment } from '../../../../environments/environment';
import { DeviceDetectorService } from 'ngx-device-detector';
import { ModalDirective } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-transfer-form',
  templateUrl: './transfer-form.component.html',
  styleUrls: ['./transfer-form.component.scss']
})
export class TransferFormComponent implements OnInit {

  transfer_form: FormGroup;
  vendor;
  user;
  vendor_branch;
  submit_pending: boolean = false;
  debit_searching: boolean;
  debit_plan_loader: boolean = false;
  debit_search_failed: boolean;
  debit_hideSearchingWhenUnsubscribed = new Observable(() => () => this.debit_searching = false);
  public sender_result: any;
  debit_plan_list;
  member_image_url = environment.api.imageUrl+'profile/member/';

  credit_plan_list
  credit_searching: boolean;
  credit_plan_loader: boolean = false;
  credit_search_failed: boolean;
  credit_hideSearchingWhenUnsubscribed = new Observable(() => () => this.credit_searching = false);
  @ViewChild('transfer_form_modal') public transfer_form_modal : ModalDirective;
  
  constructor(
    private _fb: FormBuilder, 
    private transaction_service: ContributionService,
    private _ls: LocalService,
    private member_service: MembersService,
    private deviceService: DeviceDetectorService,
    ) { 
      this.vendor = JSON.parse(this._ls.getVendor());
      this.user = JSON.parse(this._ls.getUser());
      this.vendor_branch = JSON.parse(this._ls.getBranchData());
    }
  /**
   * search for member who is initiating the transaction
   * @param text 
   */
  debit_search = (text$: Observable<string>) =>
    	text$
	      .debounceTime(300)
	      .distinctUntilChanged()
	      .do(() => this.debit_searching = true)
	      .switchMap(debit_term =>
	        this.member_service.filterMembers(debit_term)
	          .do(() => this.debit_search_failed = false)
	          .catch(() => {
	            this.debit_search_failed = true;
	            return of([]);
	          }))
	      .do(() => this.debit_searching = false)
	      .merge(this.debit_hideSearchingWhenUnsubscribed);
	      debit_formatter = (sender: {first_name: string, middle_name: string, last_name: string}) => this._ls.check_for_empty_string(sender.first_name)+' '+ this._ls.check_for_empty_string(sender.middle_name)+' '+ this._ls.check_for_empty_string(sender.last_name);
  
  /**
   * search for member who is the beneficiary of this transaction
   * @param text 
   */
  credit_search = (text$: Observable<string>) =>
  text$
    .debounceTime(300)
    .distinctUntilChanged()
    .do(() => this.credit_searching = true)
    .switchMap(credit_term =>
      this.member_service.filterMembers(credit_term)
        .do(() => this.credit_search_failed = false)
        .catch(() => {
          this.debit_search_failed = true;
          return of([]);
        }))
    .do(() => this.credit_searching = false)
    .merge(this.credit_hideSearchingWhenUnsubscribed);
    credit_formatter = (sender: {first_name: string, middle_name: string, last_name: string}) => this._ls.check_for_empty_string(sender.first_name)+' '+ this._ls.check_for_empty_string(sender.middle_name)+' '+ this._ls.check_for_empty_string(sender.last_name);

  ngOnInit() {
    this.transfer_form = this._fb.group({
      debit_member : [null, Validators.compose([Validators.required])],
      debit_plan_id : [null, Validators.compose([Validators.required])],
      credit_member : [null, Validators.compose([Validators.required])],
      credit_plan_id : [null, Validators.compose([Validators.required])],
      amount : [null, Validators.compose([Validators.required])],
      depositor : [null],
      naration : [null],
    })
  }

  /**
   * @method inter_account_transfer
   * tranfer funds from account to account
   * @param form_values
   */
  inter_account_transfer(form_values)
  {
    this.transfer_form.updateValueAndValidity();
		if (this.transfer_form.invalid) {
		  Object.keys(this.transfer_form.controls).forEach(key => {
		    this.transfer_form.get(key).markAsDirty();
		  });
		  return;
		}
    let data = {
      debit_member_id: form_values.debit_member.id,
      debit_plan_id: form_values.debit_plan_id,
      credit_member_id: form_values.credit_member.id,
      credit_plan_id: form_values.credit_plan_id,
      amount: form_values.amount,
      depositor: form_values.depositor,
      naration: form_values.naration,
      vendor_id: this.vendor.id,
      user_id: this.user.user_id,
      staff_id: this.user.id,
      branch_id: this.vendor_branch.id,
      mode:  'ntxn',
      app_channel:  'web',
      status: 1,
      txn_status: 'approved',
      device_info:  'browser: ' + this.deviceService.getDeviceInfo().browser + ' /browser_version: ' + this.deviceService.getDeviceInfo().browser_version + ' /device: ' + this.deviceService.getDeviceInfo().device + ' /os: ' + this.deviceService.getDeviceInfo().os,

    }
    this.transaction_service.inter_account_transfer(data).subscribe((response) => {
      if (response.success) {
        this._ls.showSuccess(response.message,'Operation Successfull');
        this.transfer_form.reset();
        this.transfer_form_modal.hide();
      }else{
        this._ls.showError('Server Error!. please contact admin','Operation Unsuccessfull')
      }
     }, (error) => {
       this._ls.showError('Server Error!. please contact admin','Operation Unsuccessfull')
    })

  }

  /**
   * @method load_sender_savings_plan
   * @param sender_data
   * get sender savings plan and balance
   */
  load_sender_savings_plan(debit_member){
    this.debit_plan_loader = true;
    this.transaction_service.get_member_contribution_plan(debit_member.id).subscribe((response) => {
      this.debit_plan_list = response.data;
      this.debit_plan_loader = false;
    })
    
  }

  /**
   * @method load_recipient_savings_plan
   * @param recipient_data
   * get recipient savings plan and balance
   */
  load_beneficiary_savings_plan(beneficiary){
    console.log(beneficiary)
    this.credit_plan_loader = true;
    this.transaction_service.get_member_contribution_plan(beneficiary.id).subscribe((response) => {
      this.credit_plan_list = response.data;
      this.credit_plan_loader = false;
    });
  }

  get_sender_data(e)
  {
    console.log(e)
  }

  /**
   * @method get_member_contribution_plan
   * get member contribution plan
   * @params id
   */
  get_member_contribution_plan(id)
  {
    let plan_list;
    this.transaction_service.get_member_contribution_plan(id).subscribe((response) => {
      plan_list = response.data;
    });
    return plan_list
  }
}
