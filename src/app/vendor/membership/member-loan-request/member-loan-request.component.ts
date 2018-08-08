import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { FormGroup, FormBuilder, Validators, FormControl, FormArray } from '@angular/forms';
import { LocalService } from '../../../storage/local.service';
import { MembersService } from '../members.service';
import { LoanRequestService } from '../../manage-loanrequest/loan-request.service';
import { LoanSettingsService } from '../../loans/loan-settings/loan-settings.service';
import * as moment from 'moment';
import { TableExportService } from '../../../shared/services/index';
import { environment } from '../../../../environments/environment';
import { ViewMemberComponent } from '../view-member/view-member.component';
import { DeductionsService } from '../../manage-deductions/deductions.service';

@Component({
  selector: 'app-member-loan-request',
  templateUrl: './member-loan-request.component.html',
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
export class MemberLoanRequestComponent implements OnInit {
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
   
    submitPending:boolean;
    btn_loader: boolean = false;
    allow_edit_acc_no : boolean = false;
    public loanRequestForm : FormGroup;
    public loanrequestFilterForm : FormGroup;
    public withdrawalForm : FormGroup;
    selected_loan_type;
    sel_loan_type
    requirements_files;
    deduction_type_list;
   @ViewChild('fileInput') fileInput: ElementRef;

    @ViewChild('newLoanRequestModal') public newLoanRequestModal : ModalDirective;
    @ViewChild('newContributionModal') public newContributionModal : ModalDirective;
    @ViewChild('newRepaymentModal') public newRepaymentModal : ModalDirective;
    @ViewChild('newTargetSavingModal') public newTargetSavingModal : ModalDirective;
    @ViewChild('newWithdrawalModal') public newWithdrawalModal : ModalDirective;

    constructor(
      private route : ActivatedRoute, 
    	private localService : LocalService,
      private exportService: TableExportService,
      private router : Router,
      private sanitizer:DomSanitizer,
  	  private _fb : FormBuilder,
      private memberService : MembersService,
      private deductionService : DeductionsService,
      private loanRequestService : LoanRequestService,
      private view_member_component: ViewMemberComponent,
      private loanSettingsService : LoanSettingsService,
    	) {
        // this.image_url = environment.api.imageUrl+'profile/member/';
        this.vendor = JSON.parse(this.localService.getVendor());
        this.user = JSON.parse(this.localService.getUser());
        //this.router.events.subscribe((val) => {
        this.memberId = this.view_member_component.memberId;
        //this.memberId = this.route.snapshot.params['member_id'];
         // });
        this.monthList = this.localService.yearjson();
        this.getMemberLoanRequest();
        this.getLoanType();
        this.get_deduction_type()

       }

    ngOnInit() {
      this.loanRequestForm =this._fb.group({
        loan_type : [null, Validators.compose([Validators.required])],
        repayment_method : [null, Validators.compose([Validators.required])],
        amount : [null, Validators.compose([Validators.required])],
        description : '',
        //requirements : '',
      });
     
       this.loanrequestFilterForm = this._fb.group({
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

     get_deduction_type()
    {
      this.deductionService.get_repayment_type().subscribe((response) => {
        this.deduction_type_list = response.data;
        console.log(response.data)
      })
    }
      /**
     * @method makeLoanRequest
     * make a loan request
     * @return true/false
     */
    makeLoanRequest(data)
    {
      /*data['member_id'] = this.memberId
      data['vendor_id'] = JSON.parse(this.localService.getVendor()).id;*/
      //data['requirements'] = this.files;
      let form_values = this.prepareSave(data)
      this.loanRequestService.addLoanRequest(form_values).subscribe((response) => {
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

    get_loan_type(event)
    {
    	for (var i in this.loanTypeList) {
    		if(this.loanTypeList[i].id == event )
    		{
    			this.selected_loan_type = this.loanTypeList[i];
    		}
    	}
    }

    private prepareSave(data): any {
      let input = new FormData();
      input.append('loan_type', data.loan_type);
      input.append('repayment_method', data.repayment_method);
      input.append('amount', data.amount);
      input.append('description', data.description);
      // input.append('requirements_files', this.requirements_files);
      input.append('vendor_id', this.vendor.id);
      input.append('staff_id', JSON.parse(this.localService.getUser()).id);
      input.append('member_id', this.memberId);
      return input;
  }

  onFileChange(event) {
      if(event.target.files.length > 0) {
        //let file = event.target.files;//[0];
        
        let files = [].slice.call(event.target.files);

    	this.requirements_files = files.map(f => f.name).join(', ');
    	// for (var i = 0; i < event.target.files.length; i++) { 
	    //   this.requirements_files.push(event.target.files[i]);
	    // }
      }
    }

    clearFile() {
      //this.newMemberForm.get('passport').setValue(null);
      this.fileInput.nativeElement.value = '';
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
    requestHistory(id)
    {
      this.router.navigate(['app/loan-request/'+id+'/loan-request-history'])
    }
}