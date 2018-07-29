import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Subject } from 'rxjs/Rx';
import {Observable} from 'rxjs/Observable';
import {of} from 'rxjs/observable/of'
import { ActivatedRoute, Router } from '@angular/router';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { FormGroup, FormBuilder, Validators, FormControl, FormArray } from '@angular/forms';
import { LocalService } from '../../../storage/local.service';
import { MembersService } from '../../membership/members.service';
import { LoanRequestService } from '../../manage-loanrequest/loan-request.service';
import { LoanSettingsService } from '../../loans/loan-settings/loan-settings.service';
import { ContributionService } from '../../manage-contribution/contribution.service';
import { DeductionsService } from '../../manage-deductions/deductions.service';
import { TargetSavingsService } from '../../target-savings/target-savings.service';
import { WidthdrawalsService } from '../../manage-widthdrawals/widthdrawals.service';
import { AccountOfficerService } from '../../account-officer/account-officer.service';
import * as moment from 'moment';
import { TableExportService } from '../../../shared/services/index';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-account-officer',
  templateUrl: './account-officer.component.html',
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
export class AccountOfficerComponent implements OnInit {
    public vendor;
    public user;
    public staffId;
    image_url;
    member_image_url;
    monthList
    public acc_oficer_form : FormGroup;
    member_account_loader: boolean = false;
    searching: boolean;
    searchFailed: boolean;
    hideSearchingWhenUnsubscribed = new Observable(() => () => this.searching = false);
    
  show_add_form_check: boolean = false;
  save_acct_officer_form_check: boolean = false;
  account_officers
   @ViewChild('fileInput') fileInput: ElementRef;

    constructor(
      private route : ActivatedRoute, 
    	private localService : LocalService,
      private router : Router,
      private sanitizer:DomSanitizer,
  	  private _fb : FormBuilder,
      private memberService : MembersService,
      private acc_officer_service : AccountOfficerService,
    	) {
        this.member_image_url = environment.api.imageUrl+'profile/member/';
        this.image_url = environment.api.imageUrl+'profile/staff/';
        this.vendor = JSON.parse(this.localService.getVendor());
        this.user = JSON.parse(this.localService.getUser());
        //this.router.events.subscribe((val) => {
        this.staffId = this.route.snapshot.params['staff_id'];
         // });
        this.monthList = this.localService.yearjson();
        this.get_acc_officer();
        
       }

    ngOnInit() {
      this.acc_oficer_form = this._fb.group({
        member_id: '',
        approved_by: '',
        status: '',
        //description:''
      });
      
    }

    search = (text$: Observable<string>) =>
      text$
        .debounceTime(300)
        .distinctUntilChanged()
        .do(() => this.searching = true)
        .switchMap(term =>
          this.memberService.filterMembers(term)
            .do(() => this.searchFailed = false)
            .catch(() => {
              this.searchFailed = true;
              return of([]);
            }))
        .do(() => this.searching = false)
        .merge(this.hideSearchingWhenUnsubscribed);
        formatter = (x: {first_name: string, middle_name: string, last_name: string}) => x.first_name+'  '+ x.middle_name+'  '+ x.last_name;


     save_acct_officer_form(form_values)
    {
      let data = {
        staff_id : this.staffId,
        member_id : form_values.member_id.id,
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
      this.acc_officer_service.get_staff(this.staffId).subscribe((response) => {
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
        member_id : this.staffId,
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
}