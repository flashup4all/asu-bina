import { Component, OnInit } from '@angular/core';
import { trigger, style, animate, transition } from '@angular/animations';
import {NgbTypeahead} from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs/Rx';
import { Observable } from 'rxjs/Observable';
import {of} from 'rxjs/observable/of';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LocalService } from '../../storage/local.service';
import { DeductionsService } from './deductions.service';
import { MembersService } from '../membership/members.service';
import { LoanSettingsService } from '../loans/loan-settings/loan-settings.service';
import { TableExportService } from '../../shared/services/index';
import * as moment from 'moment';
import { VendorService } from '../vendor.service';

@Component({
  selector: 'app-manage-deductions',
   animations: [
    trigger('slideInOut', [
      transition(':enter', [
        style({transform: 'translateY(-100%)'}),
        animate('200ms ease-in', style({transform: 'translateY(0%)'}))
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({transform: 'translateY(-100%)'}))
      ])
    ])
    /*trigger(
      'enterAnimation', [
        transition(':enter', [
          style({transform: 'translateX(100%)', opacity: 0}),
          animate('500ms', style({transform: 'translateX(0)', opacity: 1}))
        ]),
        transition(':leave', [
          style({transform: 'translateX(0)', opacity: 1}),
          animate('500ms', style({transform: 'translateX(100%)', opacity: 0}))
        ])
      ]
    )*/
  ],
  templateUrl: './manage-deductions.component.html',
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
export class ManageDeductionsComponent implements OnInit {

	public vendor;
  user;
	public deductionsList = [];
	public runDeductionsForm : FormGroup;
    filterForm: FormGroup;
	submitPending: boolean;
  	adv_filter:boolean;
	successAlert;
	toPage;
  	loader;
  	current_year = moment().format('YYYY');
  	monthList;
    loanTypeList
  	searching = false;
  	searchFailed = false;
    approve_btn_loader: boolean = false;
  	hideSearchingWhenUnsubscribed = new Observable(() => () => this.searching = false);
    vendor_branches;
	constructor(
		  private localService : LocalService,
      private exportService: TableExportService,
  		private _fb : FormBuilder,
      private loanSettingsService : LoanSettingsService,
      private vendor_service : VendorService,
      private memberService : MembersService,
  		private deductionService : DeductionsService
  		) {
		this.adv_filter = false;
		this.vendor = JSON.parse(this.localService.getVendor());
    this.user = JSON.parse(this.localService.getUser());
		this.getLoanDeductions();
    this.getLoanType()
    this.get_vendor_branches();
		this.monthList = this.localService.yearjson();

  		}

	  ngOnInit() {
	  	this.runDeductionsForm = this._fb.group({
  			repayment_method : [null, Validators.compose([Validators.required])],
  			period : [null, Validators.compose([Validators.required])]
  		});
  		this.filterForm = this._fb.group({
        from : '',
        to : '',
        id : '',
        member_id : '',
        loan_type_id : '',
        loan_request_id : '',
        branch_id: ''
      })
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
      formatter = (x: {first_name: string, middle_name: string, last_name: string, passport: string}) => x.first_name;

      /*searchStaff = (text$: Observable<string>) =>
    text$
      .debounceTime(300)
      .distinctUntilChanged()
      .do(() => this.searching = true)
      .switchMap(sterm =>
        this.memberService.filterMembers(sterm)
          .do(() => this.searchFailed = false)
          .catch(() => {
            this.searchFailed = true;
            return of([]);
          }))
      .do(() => this.searching = false)
      .merge(this.hideSearchingWhenUnsubscribed);
      st_formatter = (x: {first_name: string}) => x.first_name;
*/
  
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
	 * @method getDeductions
	 * get vendor contrinbution
	 * @return data
	 */
	getLoanDeductions()
	{
		this.deductionService.getDeductions().subscribe((response) => {
			this.toPage = response.next_page_url;
			this.deductionsList = response.data;
			/* for(var i=0; i < response.data.length; i++)
	        {
	           	this.deductionsList.push(response.data[i])
	        }*/
		});
	}

	loadMore()
    {
     this.loader = true;
      if(this.toPage){
       this.localService.getPaginateData(this.toPage).subscribe((response) => {
         this.toPage = response.next_page_url;
         this.loader = false;
        for(var i=0; i < response.data.length; i++)
        {
           this.deductionsList.push(response.data[i])
        }

       })
     }else{
         this.loader = false;
          this.localService.showError('All data have been loaded','Operation Unsuccessfull');
     }
    }

	/**
	 * @method runDeductions
	 * run loan deductions
	 * @return data
	 */
	runDeductions(data)
	{
		this.submitPending = true;
		data['vendor_id'] = JSON.parse(this.localService.getVendor()).id
		data['approved_by'] = JSON.parse(this.localService.getUser()).id
		this.deductionService.runDeductions(data).subscribe((response) => {
		if(response.success = true)
	    {
	        this.submitPending = false;
	         this.getLoanDeductions();
	         this.runDeductionsForm.reset();
	         this.successAlert = response.message;
	        this.localService.showSuccess(response.message,'Operation Successfull');
	    } else{
	        this.submitPending = false;
	        this.localService.showError(response.message,'Operation Unsuccessfull');
	    }
			}, (error) => {
				this.submitPending = false;
	        	this.localService.showError(error,'Operation Unsuccessfull');
			});
	}
	show_adv_form()
    {
      this.adv_filter =!this.adv_filter
    }

    filterDeduction(filterValues)
    {
      this.submitPending = true;
      let data = {
        from : filterValues.from,
        to : filterValues.to,
        id : filterValues.id,
        member_id : filterValues.member_id.id,
        loan_type_id : filterValues.loan_type_id,
        branch_id: filterValues.branch_id,
        loan_request_id : filterValues.loan_request_id,
        vendor_id: parseInt(this.vendor.id)
      }
      this.deductionService.filterDeduction(data).subscribe((response) => {
        this.deductionsList = response.data
        this.submitPending = false;
      })
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
           //this.total_loan_type = response.data.length;
       })
    }

    exportTable(format, tableId)
    {
      this.exportService.exportTo(format, tableId);
    }

    post_repayment(id, status)
    {
      let data = {
        id: id,
        status: status,
        approved_by : this.user.id,
        vendor_id: this.vendor.id
      };
      this.approve_btn_loader = true;
      this.deductionService.post_repayment(data).subscribe((response) => {
        if (response.success) {
          this.approve_btn_loader = false;
          //this.member_loan_request_component.getMemberLoanRequest();
          this.getLoanDeductions();
          this.localService.showSuccess(response.message,'Operation Successfull');
        }else{
          this.approve_btn_loader = false;
                this.localService.showError(response.message,'Operation Unsuccessfull');
        }
      }, (error) => {
        this.approve_btn_loader = false;
              this.localService.showError(error,'Operation Unsuccessfull');
      });
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

    calculate_loan_balance(balance, interest, last_date)
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
    }
}
