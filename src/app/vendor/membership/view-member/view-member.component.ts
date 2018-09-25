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
import { WidthdrawalsService } from '../../manage-widthdrawals/widthdrawals.service';
//import { MemberLoanRequestComponent } from '../member-loan-request/member-loan-request.component';
import * as moment from 'moment';
import { TableExportService } from '../../../shared/services/index';
import { environment } from '../../../../environments/environment';

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
    btn_loader: boolean = false;
    allow_edit_acc_no : boolean = false;
    approve_btn_loader: boolean = false;
    generate_login_check: boolean = false;
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
    signature_url;
    passport;
    member_signature;
    vendor_branch;
   @ViewChild('fileInput') fileInput: ElementRef;

    @ViewChild('newLoanRequestModal') public newLoanRequestModal : ModalDirective;
    @ViewChild('newContributionModal') public newContributionModal : ModalDirective;
    @ViewChild('newRepaymentModal') public newRepaymentModal : ModalDirective;
    @ViewChild('newTargetSavingModal') public newTargetSavingModal : ModalDirective;
    @ViewChild('newWithdrawalModal') public newWithdrawalModal : ModalDirective;
  @ViewChild('passwordModal') public passwordModal : ModalDirective;
    
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
    	private targetService : TargetSavingsService,
      //private member_loan_request_component : MemberLoanRequestComponent
    	) {
        this.image_url = environment.api.imageUrl+'profile/member/';
        this.signature_url = environment.api.imageUrl+'profile/signature/';
        this.vendor = JSON.parse(this.localService.getVendor());
        this.user = JSON.parse(this.localService.getUser());
        this.vendor_branch = JSON.parse(this.localService.getBranchData());

        //this.router.events.subscribe((val) => {
        this.memberId = this.route.snapshot.params['member_id'];
         // });
        this.monthList = this.localService.yearjson();
        this.getMemberProfile();
        this.getMemberLoanRequest();
        //this.getMemberLoanDeductions();
        this.getMemberContributions();
        this. getFormFields();
        // this.getLoanType();
        this.get_contribution_type()
        this.get_deduction_type()
        this.getMemberTargetSavings()
        this.getMemberWithdrawal();
        this.getActualBalance();
        this.get_member_contribution_plan();
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
        depositor: '',
        description: '',
      });

      this.withdrawalForm = this._fb.group({
        payment_method : '',
        plan_id : [null, Validators.compose([Validators.required])],
        amount : [null, Validators.compose([Validators.required])],
        description: '',
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
       this.loanrequestFilterForm = this._fb.group({
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

    get_member_contribution_plan()
    {
      this.submitPending = true;
      this.contributionService.get_member_contribution_plan(this.memberId).subscribe((response) => {
        this.member_plan_list = response.data;
        this.submitPending = false;
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
      this.memberService.getMemberActiveLoanRequest(this.memberId).subscribe((response) => {
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
      let form_data = this.prepareSave(data);
      this.memberService.updateMember(form_data, id).subscribe((response) => {
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

    onFileChange(event) {
      if(event.target.files.length > 0) {
        let file = event.target.files[0];
        this.passport = file;
      }
    }
    onSignatureFileChange(event) {
      if(event.target.files.length > 0) {
        let file = event.target.files[0];
        this.member_signature = file;
      }
    }

    clearFile() {
      //this.newMemberForm.get('passport').setValue(null);
      this.fileInput.nativeElement.value = '';
    }
    

    private prepareSave(data): any {
      let input = new FormData();
      input.append('account_number', data.account_number);
      input.append('first_name', data.first_name);
      input.append('last_name', data.last_name);
      input.append('middle_name', data.middle_name);
      input.append('contribution', data.contribution);
      input.append('gender', data.gender);
      input.append('date_of_birth', data.date_of_birth);
      input.append('account_number', data.account_number);
      input.append('membership_date', data.membership_date);
      input.append('email', data.email);
      input.append('phone1', data.phone1);
      input.append('passport', this.passport);
      input.append('signature', this.member_signature);
      input.append('vendor_id', this.vendor.id);
      input.append('approved_by', JSON.parse(this.localService.getUser()).id);
      return input;
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
          this.getActualBalance();
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

   


    make_a_repayment(formValues)
    {
      formValues['vendor_id'] = this.vendor.id
      formValues['staff_id'] = this.user.id
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

    make_a_withdrawal(formValues)
    {
      formValues['member_id'] = this.memberId
      formValues['vendor_id'] = this.vendor.id
      formValues['staff_id'] = this.user.id
      formValues['branch_id'] = this.vendor_branch.id;
      formValues['user_id'] = this.user.user_id
      this.submitPending = true;
      this.withdrawalService.make_a_withdrawal(formValues).subscribe((response) => {
        if (response.success) {
          this.submitPending = false;
          this.getMemberWithdrawal();
          this.newWithdrawalModal.hide();
          this.withdrawalForm.reset()
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

    /**
   * @method approveWidthdrawalRequest
   * approve widthdrawal requests
   *  @return true/false
   */
  approveWidthdrawalRequest(id)
  {
    this.btn_loader = true;
    let data = {
      id : id,
      vendor_id: this.vendor.id,
      status: 'Approved',
      approved_by: JSON.parse(this.localService.getUser()).id,
      user_id :this.user.user_id

    }
    this.withdrawalService.approveWidthdrawalRequest(data).subscribe((response) => {
         if(response.success = true)
      {
        this.btn_loader = false;
         this.getMemberWithdrawal()
         this.getActualBalance();
        this.localService.showSuccess(response.message,'Operation Successfull');
      }
      else{
        this.localService.showError(response.message,'Operation Unsuccessfull');
      }
       }, (error) => {
         this.btn_loader = false;
         this.localService.showError('Error while performing this action, please try again later', 'Server Error')
       });
  }

  /**
   * @method cancelWidthdrawalRequest
   * cancel widthdrawal requests
   *  @return true/false
   */
  cancelWidthdrawalRequest(id)
  {
    this.btn_loader = true;
    let data = {
      id : id,
      vendor_id: this.vendor.id,
      status: 'Cancelled',
      user_id :this.user.user_id,
      approved_by: JSON.parse(this.localService.getUser()).id
    }
    this.withdrawalService.cancelWidthdrawalRequest(data).subscribe((response) => {
         if(response.success = true)
      {
        this.btn_loader = false;
         this.getMemberWithdrawal()
        this.localService.showSuccess(response.message,'Operation Successfull');
      }
      else{
        this.localService.showError(response.message,'Operation Unsuccessfull');
      }
       }, (error) => {
         this.btn_loader = false;
         this.localService.showError('Error while performing this action, please try again later', 'Server Error')
       });
  }
    getActualBalance()
    {
      this.withdrawalService.getActualBalance(this.memberId).subscribe((response) => {
        this.actual_balance = response;
      })
    }

  /**
   * @method activateMember
   * activate member
   * @return data
   */
  activateMember(id)
  {
    let data ={
      id: id,
      user_id: this.user.user_id,
      vendor_id: this.vendor.id
    }
    this.memberService.activateMember(data).subscribe((response) => {
      if(response.success == true)
      {
        this.getMemberProfile()
        this.localService.showSuccess(response.message,'Operation Successfull');
      }else{
        this.localService.showError(response.message,'Operation UnsSuccessfull');
      }
    });
  }

  /**
   * @method deactivateMember
   * deactivate member
   * @return data
   */
  deactivateMember(id)
  {
    let data ={
      id: id,
      user_id: this.user.user_id,
      vendor_id: this.vendor.id
    }
    this.memberService.deactivateMember(data).subscribe((response) => {
      if(response.success == true)
      {
        this.getMemberProfile()
        this.localService.showSuccess(response.message,'Operation Successfull');
      }else{
        this.localService.showError(response.message,'Operation UnsSuccessfull');
      }
    });
  }

  /**
   * @method editPassword
   * launches edit password modal
   * @return data
   */
  editPassword(data)
  {
    //this.editMemberData = data;
    this.passwordModal.show();
    // this.manageMemberService.getMember().subscribe((response) => {
    //   this.membersList = response.data
    // });
  }
  /**
   * @method generate_login_details
   * send password reset link
   * @return data
   */
  generate_login_details(data)
  {
    this.generate_login_check = true;
    data = {
      vendor_id: JSON.parse(this.localService.getVendor()).id,
      user_id: JSON.parse(this.localService.getUser()).id,
      asusu_id: data.asusu_id,
      member_user_id: data.user_id,
      member_id: data.id,
      email: data.email
    }
    this.memberService.generate_login_details(data).subscribe((response) => {
      if(response.success)
      {
        this.generate_login_check = false;
        this.localService.showSuccess(response.message,'Operation Successfull');
      }else{
        this.generate_login_check = false;
        this.localService.showError(response.message,'Operation Unsuccessfull');
      }
    }, (error) => {
        this.generate_login_check = false;
        this.localService.showError('Server Error!! Please contact admin','Operation Unsuccessfull');

    });
  }
}
