import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { FormGroup, FormBuilder, Validators, FormControl, FormArray } from '@angular/forms';
import { LocalService } from '../../../storage/local.service';
import { MembersService } from '../members.service';
import { LoanRequestService } from '../../manage-loanrequest/loan-request.service';
import { LoanSettingsService } from '../../loans/loan-settings/loan-settings.service';
import { ContributionService } from '../../manage-contribution/contribution.service';
import { DeductionsService } from '../../manage-deductions/deductions.service';
import { TargetSavingsService } from '../../target-savings/target-savings.service';
//import { MemberLoanRequestComponent } from '../member-loan-request/member-loan-request.component';
import * as moment from 'moment';
import { TableExportService } from '../../../shared/services/index';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-member-deductions',
  templateUrl: './member-deductions.component.html',
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
export class MemberDeductionsComponent implements OnInit {
    public vendor;
    public user;
    public memberId;
    public member;
    public memberData;
    public memberLoanRequestList;
    public memberLoanDeductionsList;
    public memberContributionList;
    public membersFormPoolList;
    public contribution_type_list;
    withdrawal_list;
    actual_balance
    public target_list;
    loanTypeList;
    total_contribution;
    total_deduction;
    showFileNames;
    monthList;
    public addDeductionForm : FormGroup;
    public runContributionForm : FormGroup;
    public newMemberForm: FormGroup;
    public targetSavingForm: FormGroup;
    filterForm: FormGroup;
    deductionFilterForm: FormGroup;
    contributionFilterForm: FormGroup;
    submitPending:boolean;
    btn_loader: boolean = false;
    allow_edit_acc_no : boolean = false;
    approve_btn_loader: boolean = false;
    public loanRequestForm : FormGroup;
    public loanrequestFilterForm : FormGroup;
    public withdrawalForm : FormGroup;
    files;
    current_year = moment().format('YYYY');
    member_plan_list;
    total_target_amount;
    total_contribution_amount;
    total_deduction_amount;
    deduction_type_list;
    image_url;
    passport;
    vendor_branch;
   @ViewChild('fileInput') fileInput: ElementRef;

    @ViewChild('newLoanRequestModal') public newLoanRequestModal : ModalDirective;
    @ViewChild('newContributionModal') public newContributionModal : ModalDirective;
    @ViewChild('newRepaymentModal') public newRepaymentModal : ModalDirective;
    @ViewChild('newTargetSavingModal') public newTargetSavingModal : ModalDirective;
    @ViewChild('newWithdrawalModal') public newWithdrawalModal : ModalDirective;

    constructor(
      private route : ActivatedRoute, 
    	private localService : LocalService,
      private contributionService : ContributionService,
      private deductionService : DeductionsService,
      private exportService: TableExportService,
      private router : Router,
      private sanitizer:DomSanitizer,
  	  private _fb : FormBuilder,
      private memberService : MembersService,
      private loanRequestService : LoanRequestService,
      private loanSettingsService : LoanSettingsService,
    	private targetService : TargetSavingsService,
      //private member_loan_request_component : MemberLoanRequestComponent
    	) {
        this.image_url = environment.api.imageUrl+'profile/member/';
        this.vendor = JSON.parse(this.localService.getVendor());
        this.user = JSON.parse(this.localService.getUser());
        this.vendor_branch = JSON.parse(this.localService.getBranchData());
        //this.router.events.subscribe((val) => {
        this.memberId = this.route.snapshot.params['member_id'];
         // });
        this.monthList = this.localService.yearjson();
        this.getMemberLoanRequest();
        this.getMemberLoanDeductions();
        this.get_deduction_type();
       }

    ngOnInit() {
      this.addDeductionForm = this._fb.group({
        loan_request_id : [null, Validators.compose([Validators.required])],
        period : [null, Validators.compose([Validators.required])],
        repayment_method : [null, Validators.compose([Validators.required])],
        run_date : [null, Validators.compose([Validators.required])],
        repayment_amount: '',
        depositor: '',
        description: '',
      });

        /*filter form*/
       this.filterForm = this._fb.group({
        from : '',
        to : '',
        id : ''
      });
       
       this.deductionFilterForm = this._fb.group({
        from : '',
        to : '',
        loan_request_id : '',
        repayment_method:'',
        id : ''
      });

    }

    exportTable(format, tableId)
    {
      this.exportService.exportTo(format, tableId);
    }


    /**
     * @method getMemberLoanRequest
     * get member loan request resource
     * @return data
     */
    getMemberLoanRequest()
    {
      this.memberService.getMemberActiveLoanRequest(this.memberId).subscribe((response) => {
        this.memberLoanRequestList = response.data
      })
    }


     /**
     * @method getLoanType
     * creates a new loan type  resource
     * @return data
     */
    /*getLoanType()
    {
        this.loanSettingsService.getLoanType().subscribe((response) => {
         
           this.loanTypeList = response.data
       })
    }*/

     /**
     * @method getMemberLoanDeductions
     * get member loan deductions resource
     * @return data
     */
    getMemberLoanDeductions()
    {
      this.memberService.getMemberDeductions(this.memberId).subscribe((response) => {
        this.memberLoanDeductionsList = response.data.data
      })
    }
    get_deduction_type()
    {
      this.deductionService.get_repayment_type().subscribe((response) => {
        this.deduction_type_list = response.data;
      })
    }

    totalContribution()
    {
      let total_contribution = 0
      for (var i in this.memberContributionList) {
        total_contribution += this.memberContributionList.amount
      }
      return total_contribution;
    }
    totalDeductions(array)
    {
      let total_deductions = 0
      for (var i=0; i < array.length; i++) {
        total_deductions += array[i].amount_deducted
      }
      return total_deductions;
    }

    percentage_to_amount(total_amount, percentage)
    {
      let amount = 0
      return amount = parseInt(total_amount) * (parseInt(percentage)/100);
    }
   

    filterDeduction(filterValues)
    {
      this.submitPending = true;
      filterValues['vendor_id'] = parseInt(this.vendor.id);
      filterValues['member_id'] = parseInt(this.memberId);
      this.deductionService.filterDeduction(filterValues).subscribe((response) => {
        this.memberLoanDeductionsList = response.data
        this.total_deduction_amount = response.total;
        this.submitPending = false;
      })
    }

   


    make_a_repayment(formValues)
    {
      formValues['vendor_id'] = this.vendor.id
      formValues['staff_id'] = this.user.id
      formValues['user_id'] = this.user.user_id
      formValues['branch_id'] = this.vendor_branch.id
      this.submitPending = true;
      this.deductionService.repayment(formValues).subscribe((response) => {
        if (response.success) {
          this.submitPending = false;
          //this.member_loan_request_component.getMemberLoanRequest();
          this.getMemberLoanDeductions();
          this.newRepaymentModal.hide();
          this.addDeductionForm.reset()
          this.localService.showSuccess(response.message,'Operation Successfull');
        }else{
          this.submitPending = false;
                this.localService.showError(response.message,'Operation Unsuccessfull');
        }
      }, (error) => {
        this.submitPending = false;
              this.localService.showError(error,'Operation Unsuccessfull');
      });
    }

    post_repayment(id, status)
    {
    	let data = {
    		id: id,
    		status: status,
    		approved_by : this.user.id,
        vendor_id: this.vendor.id,
    		user_id: this.user.user_id
    	};
      this.approve_btn_loader = true;
      this.deductionService.post_repayment(data).subscribe((response) => {
        if (response.success) {
          this.approve_btn_loader = false;
          //this.member_loan_request_component.getMemberLoanRequest();
          this.getMemberLoanDeductions();
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
    }
  }
}
