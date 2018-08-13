import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import {of} from 'rxjs/observable/of';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { LocalService, currency } from '../../../storage/index';
import { StaffService } from '../../staff/staff.service';
import { AccountOfficerService } from '../../account-officer/account-officer.service';
import { TableExportService } from '../../../shared/services/index';
import { ViewMemberComponent } from '../view-member/view-member.component';
import * as moment from 'moment';
@Component({
  selector: 'app-member-account-officer',
  templateUrl: './member-account-officer.component.html'
})
export class MemberAccountOfficerComponent implements OnInit {

	vendor;
	user;
  member_id;
  show_add_form_check: boolean = false;
  save_acct_officer_form_check: boolean = false;
  public acc_oficer_form : FormGroup;
  account_officers
  staffList

  staff_searchFailed = false;
  staff_searching = false;
  staff_hideSearchingWhenUnsubscribed  = new Observable(() => () => this.staff_searching = false);
  
  constructor(
		private localService : LocalService,
    private exportService: TableExportService,
		private _fb: FormBuilder,
    private staffService : StaffService,
    private acc_officer_service : AccountOfficerService,
    private view_member_component: ViewMemberComponent
		) { 
		  this.vendor = JSON.parse(this.localService.getVendor());
	    this.user = JSON.parse(this.localService.getUser());
      this.member_id = this.view_member_component.memberId;
      this.get_acc_officer();
      this.getStaff();

    }

  	ngOnInit() {
      this.acc_oficer_form = this._fb.group({
        staff_id : [null, Validators.compose([Validators.required])],
        member_id: '',
        approved_by: '',
        status: '',
        //description:''
      });

  	}

    search_staff = (text$: Observable<string>) =>
    text$
      .debounceTime(300)
      .distinctUntilChanged()
      .do(() => this.staff_searching = true)
      .switchMap(sterm =>
        this.staffService.filterStaff(sterm)
          .do(() => this.staff_searchFailed = false)
          .catch(() => {
            this.staff_searchFailed = true;
            return of([]);
          }))
      .do(() => this.staff_searching = false)
      .merge(this.staff_hideSearchingWhenUnsubscribed);
      staff_formatter = (y: {first_name: string, middle_name: string, last_name: string, passport: string, staff_id: string}) => y.first_name+'  '+ y.middle_name+'  '+ y.last_name;


    save_acct_officer_form(form_values)
    {
      let data = {
        staff_id : form_values.staff_id,
        member_id : this.member_id,
        status : parseInt(form_values.status),
        approved_by : this.user.id,
        vendor_id: parseInt(this.vendor.id)
      }
      this.save_acct_officer_form_check = true;
        this.acc_officer_service.assign_account(data).subscribe((response) => {
          if (response.success) {
            this.save_acct_officer_form_check = false;
          this.get_acc_officer();
          this.acc_oficer_form.reset()
            this.localService.showSuccess(response.message,'Operation Successfull');
          }else{
            this.save_acct_officer_form_check = false;
            this.localService.showError(response.message,'Operation Unsuccessfull');
          }
        }, (error) => {
          this.save_acct_officer_form_check = false;
                this.localService.showError(error,'Operation Unsuccessfull');
        })
    }

    get_acc_officer()
    {
      this.save_acct_officer_form_check = true;
      this.acc_officer_service.get_member(this.member_id).subscribe((response) => {
        this.account_officers = response.data;
        this.save_acct_officer_form_check = false;
      }, (error) => {
          this.save_acct_officer_form_check = false;
                this.localService.showError(error,'Operation Unsuccessfull');
        })
    }

    set_default_acc_officer(id, status)
    {
      let data = {
        member_id : this.member_id,
        status : parseInt(status),
        id : id,
      }
      this.save_acct_officer_form_check = true;
        this.acc_officer_service.set_default(data).subscribe((response) => {
          if (response.success) {
            this.save_acct_officer_form_check = false;
          this.get_acc_officer();
          this.acc_oficer_form.reset()
            this.localService.showSuccess(response.message,'Operation Successfull');
          }else{
            this.save_acct_officer_form_check = false;
            this.localService.showError(response.message,'Operation Unsuccessfull');
          }
        }, (error) => {
          this.save_acct_officer_form_check = false;
                this.localService.showError(error,'Operation Unsuccessfull');
        })
    }

  clear_acct_form()
  {
    this.acc_oficer_form.reset();
  }

  /**
     * @method getStaff
     * creates a new staff  resource
     * @return data
     */
    getStaff()
    {
      // this.submitPending = true;
        this.staffService.getStaff().subscribe((response) => {
         //this.toPage = response.data.next_page_url;
         this.staffList = response.data.data;
         //this.total_staff = response.total;
         // this.submitPending = false;
         /*for(var i=0; i < response.data.length; i++)
         {
           this.staffList.push(response.data[i])
         }*/
       })
    }
}