import { Component, OnInit, ViewChild } from '@angular/core';
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
import { WidthdrawalsService } from '../../manage-widthdrawals/widthdrawals.service';
import * as moment from 'moment';
import { TableExportService } from '../../../shared/services/index';

@Component({
  selector: 'app-view-member',
  templateUrl: './view-member.component.html',
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
export class ViewMemberComponent implements OnInit {
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
    public loanRequestForm : FormGroup;
    files;
    current_year = moment().format('YYYY');

    total_target_amount;
    total_contribution_amount;
    total_deduction_amount;
    @ViewChild('newLoanRequestModal') public newLoanRequestModal : ModalDirective;
    @ViewChild('newContributionModal') public newContributionModal : ModalDirective;
    @ViewChild('newRepaymentModal') public newRepaymentModal : ModalDirective;
    @ViewChild('newTargetSavingModal') public newTargetSavingModal : ModalDirective;

    constructor(
      private route : ActivatedRoute, 
    	private localService : LocalService,
      private contributionService : ContributionService,
      private deductionService : DeductionsService,
      private withdrawalService : WidthdrawalsService,
      private exportService: TableExportService,
      private router : Router,
      private sanitizer:DomSanitizer,
  	  private _fb : FormBuilder,
      private memberService : MembersService,
      private loanRequestService : LoanRequestService,
      private loanSettingsService : LoanSettingsService,
    	private targetService : TargetSavingsService
    	) {
        this.vendor = JSON.parse(this.localService.getVendor());
        this.user = JSON.parse(this.localService.getUser());
        //this.router.events.subscribe((val) => {
        this.memberId = this.route.snapshot.params['member_id'];
         // });
        this.monthList = this.localService.yearjson();
        this.getMemberProfile();
        this.getMemberLoanRequest();
        this.getMemberLoanDeductions();
        this.getMemberContributions();
        this. getFormFields();
        this.getLoanType();
        this.get_contribution_type()
        this.getMemberTargetSavings()
        this.getMemberWithdrawal();
        this.getActualBalance();
       }

    ngOnInit() {
      this.loanRequestForm =this._fb.group({
        loan_type : [null, Validators.compose([Validators.required])],
        repayment_method : [null, Validators.compose([Validators.required])],
        amount : [null, Validators.compose([Validators.required])],
        description : '',
        //requirements : '',
      });
      this.runContributionForm = this._fb.group({
        period : [null, Validators.compose([Validators.required])],
        type : [null, Validators.compose([Validators.required])],
        date : [null, Validators.compose([Validators.required])],
        contribution: '',
      });
      this.addDeductionForm = this._fb.group({
        loan_request_id : [null, Validators.compose([Validators.required])],
        period : [null, Validators.compose([Validators.required])],
        repayment_method : [null, Validators.compose([Validators.required])],
        run_date : [null, Validators.compose([Validators.required])],
        repayment_amount: '',
      });

        /*filter form*/
       this.filterForm = this._fb.group({
        from : '',
        to : '',
        id : ''
      });
       this.contributionFilterForm = this._fb.group({
        from : '',
        to : '',
        id : '',
        type:''
      });
       this.deductionFilterForm = this._fb.group({
        from : '',
        to : '',
        loan_request_id : '',
        repayment_method:'',
        id : ''
      });

       this.targetSavingForm = this._fb.group({
        payment_method : [null, Validators.compose([Validators.required])],
        amount : [null, Validators.compose([Validators.required])],
        date: '',
      });

    }

    exportTable(format, tableId)
    {
      this.exportService.exportTo(format, tableId);
    }

    /**
     * @method getMemberProfile
     * get member profile resource
     * @return data
     */
    getMemberProfile()
    {
      this.memberService.getMemberProfile(this.memberId).subscribe((response) => {
        this.member = response.data;
        this.total_contribution = response.total_contribution
        this.total_deduction = response.total_deduction
      })
    }


    /**
     * @method getMemberLoanRequest
     * get member loan request resource
     * @return data
     */
    getMemberLoanRequest()
    {
      this.memberService.getMemberLoanRequest(this.memberId).subscribe((response) => {
        this.memberLoanRequestList = response.data
      })
    }

    get_contribution_type()
    {
      this.contributionService.get_contribution_type().subscribe((response) => {
        this.contribution_type_list = response.data;
      })
    }

    /**
     * @method makeLoanRequest
     * make a loan request
     * @return true/false
     */
    makeLoanRequest(data)
    {
      data['member_id'] = this.memberId
      data['vendor_id'] = JSON.parse(this.localService.getVendor()).id;
      data['requirements'] = this.files;
      this.loanRequestService.addLoanRequest(data).subscribe((response) => {
        if(response.success)
        {
          this.submitPending = false;
           this.getMemberLoanRequest()
           this.newLoanRequestModal.hide();
           this.loanRequestForm.reset();
          this.localService.showSuccess(response.message,'Operation Successfull');
        }
        else{
          this.submitPending = false;
          this.localService.showError(response.message,'Operation Unsuccessfull');
        }
      }, (error) => {
        this.submitPending = false;
        this.localService.showError(error,'Operation Unsuccessfull');
      });
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
     /**
     * @method getMemberContributions
     * get member loan deductions resource
     * @return data
     */
    getMemberContributions()
    {
      this.memberService.getMemberContributions(this.memberId).subscribe((response) => {
        this.memberContributionList = response.data
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
    /**
     * @method getFormFields
     * get members form field
     * @return data
     */
    getFormFields()
    {
      this.memberService.getFormField().subscribe((response) => {
        this.membersFormPoolList = response.data
      });
    }

    /**
     * @method updateMember
     * update member datails
     * @return data
     */
    updateMember(data, id)
    {
      this.submitPending = true;
      this.memberService.updateMember(data, id).subscribe((response) => {
        if(response.success)
        {
          this.getMemberProfile();
          this.submitPending = false;
          this.localService.showSuccess(response.message,'Operation Successfull');
        }
        else{
          this.submitPending = false;
          this.localService.showError(response.message,'Operation Unsuccessfull');
        }
      }, (error) => {
        this.submitPending = false;
        this.localService.showError(error,'Operation Unsuccessfull');
      });
    }

    runContribution(formValues)
    {
       if(parseInt(this.member.status))
       {
         let data = {
           status: parseInt(this.member.status),
           id:this.memberId,
           contribution: parseInt(formValues.contribution)
         }
        formValues['contributions'] = [data];
        formValues['vendor_id'] = this.vendor.id;
        formValues['approved_by'] = this.user.id
        this.submitPending = true;
        this.contributionService.runEditedContributions(formValues).subscribe((response) => {
          if (response.success) {
            this.submitPending = false;
          this.getMemberContributions();
          this.runContributionForm.reset()
            this.newContributionModal.hide();
            this.localService.showSuccess(response.message,'Operation Successfull');
          }else{
            this.localService.showError(response.message,'Operation Unsuccessfull');
          }
        }, (error) => {
          this.submitPending = false;
                this.localService.showError(error,'Operation Unsuccessfull');
        });
       }else{
         console.log('not active')
            this.localService.showError('Cannot make contribution on an inactive account','Account Inactive');
       }
    }

    filterContribution(filterValues)
    {
      this.submitPending = true;
      filterValues['vendor_id'] = parseInt(this.vendor.id);
      filterValues['member_id'] = parseInt(this.memberId);
      this.contributionService.filterContribution(filterValues).subscribe((response) => {
        this.memberContributionList = response.data
        this.total_contribution_amount = response.total;
        this.submitPending = false;
      })
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

    filterLoanRequest(filterValues)
    {
      this.submitPending = true;
      filterValues['vendor_id'] = parseInt(this.vendor.id);
      filterValues['member_id'] = parseInt(this.memberId);
      this.loanRequestService.filterLoanRequest(filterValues).subscribe((response) => {
        this.memberLoanRequestList = response.data;
        this.submitPending = false;
      })
    }


    make_a_repayment(formValues)
    {
      formValues['vendor_id'] = this.vendor.id
      formValues['approved_by'] = this.user.id
      this.submitPending = true;
      this.deductionService.repayment(formValues).subscribe((response) => {
        if (response.success) {
          this.submitPending = false;
          this.getMemberLoanRequest();
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

    //target
    /**
     * @method getMemberTargetSavings
     * get member target savings resource
     * @return data
     */
    getMemberTargetSavings()
    {
      this.targetService.getMemberTargetSavings(this.memberId).subscribe((response) => {
        this.target_list = response.data
        //this.total_target_amount = response.total;
      })
    }

    filterTargetSavings(filterValues)
    {
      this.submitPending = true;
      filterValues['vendor_id'] = parseInt(this.vendor.id);
      filterValues['member_id'] = parseInt(this.memberId);
      this.targetService.filterTargetSavings(filterValues).subscribe((response) => {
        this.target_list = response.data;
        this.total_target_amount = response.total
        this.submitPending = false;
      })
    }

    make_a_target_saving(formValues)
    {
      formValues['vendor_id'] = this.vendor.id
      formValues['member_id'] = parseInt(this.memberId);
      formValues['amount'] = parseInt(formValues.amount);
      formValues['target_type_id'] = 1;
      formValues['staff_id'] = this.user.id
      this.submitPending = true;
      this.targetService.createTargerSavings(formValues).subscribe((response) => {
        if (response.success) {
          this.submitPending = false;
          this.getMemberTargetSavings();
          this.newTargetSavingModal.hide();
          this.targetSavingForm.reset()
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


  //withdrawals
  /**
     * @method getMemberWithdrawal
     * get member profile resource
     * @return data
     */
    getMemberWithdrawal()
    {
      this.withdrawalService.getMemberWidthdrawals(this.memberId).subscribe((response) => {
        this.withdrawal_list = response.data;
      })
    }
    getActualBalance()
    {
      this.withdrawalService.getActualBalance(this.memberId).subscribe((response) => {
        this.actual_balance = response;
      })
    }
}
