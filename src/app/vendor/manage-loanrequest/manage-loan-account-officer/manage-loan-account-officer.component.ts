import { Component, OnInit, ElementRef, Input, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { Observable } from 'rxjs/Observable';
import {of} from 'rxjs/observable/of';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LocalService } from '../../../storage/local.service';
import { LoanRequestService } from '../loan-request.service';
import { LoanSettingsService } from '../../loans/loan-settings/loan-settings.service';
import { DeductionsService } from '../../manage-deductions/deductions.service';
import { MembersService } from '../../membership/members.service';
import { environment } from '../../../../environments/environment';
import * as moment from 'moment';
import { TableExportService } from '../../../shared/services/index';
import { StaffService } from '../../staff/staff.service';
import { VendorService } from '../../vendor.service';

@Component({
  selector: 'app-manage-loan-account-officer',
  templateUrl: './manage-loan-account-officer.component.html',
  styleUrls: ['./manage-loan-account-officer.component.scss']
})
export class ManageLoanAccountOfficerComponent implements OnInit {
	
  vendor_branches;
  loanRequestList;
  submitPending: boolean;
  filterForm: FormGroup;
  vendor;
  user;
  staff_searchFailed = false;
  staff_searching = false;
  staff_hideSearchingWhenUnsubscribed  = new Observable(() => () => this.staff_searching = false);
  constructor(
  	private localService : LocalService,
	private _fb : FormBuilder,
	private exportService: TableExportService,
	private route: Router,
	private staffService : StaffService,
	private loanrequestService : LoanRequestService,
	private vendor_service : VendorService,
	private loanSettingsService : LoanSettingsService,
	// private manageVendorService : VendorService,
	private memberService : MembersService
  	) { 
  	this.vendor = JSON.parse(this.localService.getVendor());
  	this.user = JSON.parse(this.localService.getUser());
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

  ngOnInit() {
  	this.filterForm = this._fb.group({
        from : '',
        to : '',
        id : '',
        member_id:'',
        loan_request_id: '',
        loan_id:'',
        acc_officer_id:'',
        branch_id:'',
        repayment_method: '',
        status: '',
        approved_by: '',
    })
  }
  	/**
     * @method get_vendor_branches
     * get vendor branches
     * @return data
     */
    get_vendor_branches()
    {
       this.vendor_service.getVendorBranches().subscribe((response) => {
         this.vendor_branches = response.data
       })
    }

    /**
     * @method filter_loans_by_acc_officer
     * get vendor branches
     * @return data
     */
    filter_loans_by_acc_officer(filterValues)
    {
      this.submitPending = true;
      filterValues['vendor_id'] = parseInt(this.vendor.id);
      filterValues['acc_officer_id'] = filterValues.acc_officer_id ? filterValues.acc_officer_id.id : ''
      this.loanrequestService.advance_filterLoanRequest(filterValues).subscribe((response) => {
        this.loanRequestList = response.data;
        console.log(this.loanRequestList)
        this.submitPending = false;
      })
    }
    filter_loan_interest_type(id)
    {
      let interest_type = this.localService.interest_type()
      for (var i in interest_type) {
        if(interest_type[i].value == id)
        {
          return interest_type[i].name;
        }
      }
  	}

  	/**
   * @method calculate_loan_balance
   * calculates loan balance from last active deductions
   * @var loan
   */
  calculate_loan_balance(loan)
  {
    if(loan)
    {
      if(loan.status == 1)
      {
        if(loan.type.interest_type == 2)
        {
          if(loan.deductions_per_loan.length > 0)
          {
            var lastItem = loan.deductions_per_loan[loan.deductions_per_loan.length-1];
            let balance = lastItem.current_balance;
            let interest = lastItem.interest_percent;
            let last_date = lastItem.run_date;
            if(balance > 1)
            {
              let last_time = moment(last_date)
              let curr_time = 0
              let rate: number;
              let current_time = moment()
              let days = current_time.diff(last_time, 'days')
              let daily_interest
              let monthly_interest=0;
                var monthly = 10;
                let interest_rate 
                interest_rate = ((interest / 100) / 30).toFixed(4);

                while (curr_time < days) {
                  daily_interest = balance * interest_rate;
                      balance = balance + daily_interest;
                          days--;
                }
                return balance;
            }else{
              return 0;
            }
          } else{
            let balance = loan.amount;
            let interest = loan.interest_percent;
            let last_date = loan.start_date;
            let last_time = moment(last_date)
            let curr_time = 0
            let rate: number;
            let current_time = moment()
            let days = current_time.diff(last_time, 'days')
            let daily_interest
            let monthly_interest=0;
            var monthly = 10;
            let interest_rate 
            interest_rate = ((interest / 100) / 30).toFixed(4);

            while (curr_time < days) {
              daily_interest = balance * interest_rate;
                  balance = balance + daily_interest;
                      days--;
            }
            return balance;
          }
        }
        if(loan.type.interest_type == 1)
        {
          let balance = loan.interest_amount + loan.amount;
          if(loan.deductions_per_loan.length > 0)
          {
            var lastItem = loan.deductions_per_loan[loan.deductions_per_loan.length-1];
            balance = lastItem.current_balance;
            // let interest = lastItem.interest_percent;
            // let last_date = lastItem.run_date;
          }
            return;
        
      }
      // balance, interest, last_date
      
      } else {
        return 0;
      }
      if (loan.type.interest_type == 1) {
        if (loan.deductions_per_loan.length > 0) {
          lastItem = loan.deductions_per_loan[loan.deductions_per_loan.length - 1];
          return lastItem.current_balance;
        } else {
          let interest_rate = ((loan.interest_percent / 100));
          let interest_amount = loan.amount * interest_rate;
          return loan.amount + interest_amount;
        }
      }
    } else {
      return 0;
    }
    }

}
