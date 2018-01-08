import { Component, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalDirective } from 'ngx-bootstrap/modal/modal.component';
import { FormGroup, FormBuilder, Validators, FormControl, FormArray } from '@angular/forms';
import { LocalService } from '../../../storage/local.service';
import { MembersService } from '../members.service';
import { LoanRequestService } from '../../manage-loanrequest/loan-request.service';
import { LoanSettingsService } from '../../loans/loan-settings/loan-settings.service';

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
    private vendor;
    private memberId;
    private member;
    private memberData;
    private memberLoanRequestList;
    private memberLoanDeductionsList;
    private memberContributionList;
    private membersFormPoolList;
    loanTypeList;
    total_contribution;
    total_deduction;

    private newMemberForm: FormGroup;
    submitPending:boolean;
    public loanRequestForm : FormGroup;
    files;
    @ViewChild('newLoanRequestModal') public newLoanRequestModal : ModalDirective;

    constructor(
      private route : ActivatedRoute, 
    	private localService : LocalService,
      private router : Router,
      private sanitizer:DomSanitizer,
  	  private _fb : FormBuilder,
      private memberService : MembersService,
      private loanRequestService : LoanRequestService,
    	private loanSettingsService : LoanSettingsService
    	) {
        this.vendor = JSON.parse(this.localService.getVendor());
        //this.router.events.subscribe((val) => {
        this.memberId = this.route.snapshot.params['member_id'];
         // });
        this.getMemberProfile();
        this.getMemberLoanRequest();
        this.getMemberLoanDeductions();
        this.getMemberContributions();
        this. getFormFields();
        this.getLoanType();
       }

    ngOnInit() {
      this.loanRequestForm =this._fb.group({
        loan_type : [null, Validators.compose([Validators.required])],
        repayment_method : [null, Validators.compose([Validators.required])],
        amount : [null, Validators.compose([Validators.required])],
        description : '',
        //requirements : '',
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
    totalDeductions()
    {
      let total_deductions = 0
      for (var i in this.memberLoanDeductionsList) {
        total_deductions += this.memberLoanDeductionsList.amount
      }
      return total_deductions;
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

}
