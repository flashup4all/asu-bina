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
import * as moment from 'moment';

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
    loanTypeList;
    total_contribution;
    total_deduction;
    showFileNames;
    monthList;
    public addDeductionForm : FormGroup;
    public runContributionForm : FormGroup;
    public newMemberForm: FormGroup;
    filterForm: FormGroup;
    submitPending:boolean;
    public loanRequestForm : FormGroup;
    files;
    current_year = moment().format('YYYY');

    @ViewChild('newLoanRequestModal') public newLoanRequestModal : ModalDirective;
    @ViewChild('newContributionModal') public newContributionModal : ModalDirective;
    @ViewChild('newRepaymentModal') public newRepaymentModal : ModalDirective;

    constructor(
      private route : ActivatedRoute, 
    	private localService : LocalService,
      private contributionService : ContributionService,
      private deductionService : DeductionsService,
      private router : Router,
      private sanitizer:DomSanitizer,
  	  private _fb : FormBuilder,
      private memberService : MembersService,
      private loanRequestService : LoanRequestService,
    	private loanSettingsService : LoanSettingsService
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
      })

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
      console.log(filterValues)
      this.contributionService.filterContribution(filterValues).subscribe((response) => {
        this.memberContributionList = response.data
        this.submitPending = false;
      })
    }

    filterDeduction(filterValues)
    {
      this.submitPending = true;
      filterValues['vendor_id'] = parseInt(this.vendor.id);
      filterValues['member_id'] = parseInt(this.memberId);
      this.deductionService.filterDeduction(filterValues).subscribe((response) => {
        this.memberLoanDeductionsList = response
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
}
