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
  loader: boolean;
  filterForm: FormGroup;
  vendor;
  user;
  staff_searchFailed = false;
  staff_searching = false;
  loanTypeList;
  selected_staff;
  staff_hideSearchingWhenUnsubscribed  = new Observable(() => () => this.staff_searching = false);
  toPage;
  result_msg: string;
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
    this.result_msg = 'Pending Loans - awaiting approvals'
    this.advance_loan_filter({status: 0 });
    this.getLoanType();
    this.get_vendor_branches()
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
      staff_formatter = (y: {first_name: string, middle_name: string, last_name: string, passport: string, staff_id: string}) => this.localService.check_for_empty_string(y.first_name)+'  '+ this.localService.check_for_empty_string(y.middle_name)+'  '+ this.localService.check_for_empty_string(y.last_name);

  ngOnInit() {
  	this.filterForm = this._fb.group({
        from : '',
        to : '',
        id : '',
        member_id:'',
        loan_request_id: '',
        loan_type_id:'',
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
     * @method advance_loan_filter
     * get vendor branches
     * @return data
     */
    advance_loan_filter(filterValues)
    {
      this.submitPending = true;
      this.result_msg = 'Searching ... '

      console.log(filterValues)
      // filterValues['vendor_id'] = parseInt(this.vendor.id);
      // this.selected_staff = 
      // console.log(this.selected_staff)
      // filterValues['acc_officer_id'] = this.selected_staff.id;
      let data = {
        acc_officer_id: filterValues.acc_officer_id ? filterValues.acc_officer_id.id : '',
        vendor_id : parseInt(this.vendor.id),
        from : filterValues.from,
        to : filterValues.to,
        id : filterValues.id,
        member_id:filterValues.member_id,
        branch_id:filterValues.branch_id,
        loan_type_id:filterValues.loan_type_id,
        status: filterValues.status,
        approved_by: filterValues.approved_by,
      };
      this.loanrequestService.advance_filterLoanRequest(data).subscribe((response) => {
        this.loanRequestList = response.data;
        this.result_msg = 'Search Results'
        this.submitPending = false;
      })
    }

    /**
     * @method filter_loan_interest_type
     * filter loan request type
     */
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

  requestHistory(id){
    this.route.navigate(['app/loan-request/'+id+'/loan-request-history']);
  }

  /**
     * @method getLoanType
     * creates a new loan type  resource
     * @return data
     */
    getLoanType()
    {
        this.loanSettingsService.getLoanType().subscribe((response) => {
         
           this.loanTypeList = response.data
       })
    }

    exportTable(format, tableId)
    {
      this.exportService.exportTo(format, tableId);
    }

    printReciept(id): void {
      let printContents, popupWin;

      printContents = document.getElementById(id).outerHTML;
      popupWin = window.open('', '_blank', 'width=auto');
      popupWin.document.open();
      popupWin.document.write(`
        <html>
          <head>
            <title>Print tab</title>
            <style>
              body{font-size:14px; text-align: center;}
                table {
                    margin: 5px;
                  
              }

              .center{
                text-align:center;
              }
              .full{
                width:100%;
              }
              .row{
                display: block;
              }

              .border, tr, th, td {
                  border: 1px solid black;
                  padding:2px;
                  border-collapse: collapse;
                   }
                   
              .no-border{ 
                  border: none !important;
                  }
                  
               .print-full{ 
                 width: 100%      
               }

               .print-half{ 
                 width: 48%;   
               }
               
               .left{ float: left;}
               
               .right{float: right;}
               
               
               .margin{ 5px;}
               .row{width:100%;}
            </style>
          </head>
      <body onload="window.print();window.close()">${printContents}</body>
        </html>`
      );
      popupWin.document.close();
    }
}
