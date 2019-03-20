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
    approve_btn_loader: boolean = false;
    btn_loader: boolean = false;
    allow_edit_acc_no : boolean = false;
    public loanRequestForm : FormGroup;
    public loanrequestFilterForm : FormGroup;
    public withdrawalForm : FormGroup;
    selected_loan_type;
    sel_loan_type
    requirements_files;
    deduction_type_list;
    calculator_array;
    show_loader : boolean = false
    public loan_calculator_form : FormGroup;
    interest_type;
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
        this.vendor_branch = JSON.parse(this.localService.getBranchData());
        //this.router.events.subscribe((val) => {
        this.memberId = this.view_member_component.memberId;
        //this.memberId = this.route.snapshot.params['member_id'];
         // });
        this.monthList = this.localService.yearjson();
        this.interest_type = this.localService.interest_type();
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

       this.loan_calculator_form =this._fb.group({
        duration : [null, Validators.compose([Validators.required])],
        amount : [null, Validators.compose([Validators.required])],
        percentage : [null, Validators.compose([Validators.required])],
        interest_type : [null, Validators.compose([Validators.required])],
        signatory: this._fb.array([])
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
      })
    }
      /**
     * @method makeLoanRequest
     * make a loan request
     * @return true/false
     */
    makeLoanRequest(data)
    {
      this.submitPending = true;
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

    /**
     * @method close_loan
     * close | complete | stop an active loan
     * @var loan
     * @return response
     */
    close_loan(loan)
    {
      this.approve_btn_loader = true;
      let data = {
        vendor_id: this.vendor.id,
        user_id: this.user.id,
        member_id: this.memberId,
        loan_request_id: loan.id,
      } 
      this.loanRequestService.close_loan_request(data).subscribe((response) => {
        if(response.success)
        {
          this.approve_btn_loader = false;
           this.getMemberLoanRequest()
          this.localService.showSuccess(response.message,'Operation Successfull');
        }else{
          this.approve_btn_loader = false;
          this.localService.showError(response.message,'Operation Unsuccessfull');
        }
      }, (error) => {
          this.approve_btn_loader = false;
          this.localService.showError('Please contact admin','Server Error!!');
      })
    }

  /**
   * @method calculate_loan_balance
   * calculates loan balance from last active deductions
   * @var loan
   */
  calculate_loan_balance(loan)
  {
    if (loan.status == 1) {
      if (loan.type.interest_type == 2) {
        if (loan.deductions_per_loan.length > 0) {
          var lastItem = loan.deductions_per_loan[loan.deductions_per_loan.length - 1];
          let balance = lastItem.current_balance;
          let interest = lastItem.interest_percent;
          let last_date = lastItem.run_date;
          if (balance > 1) {
            let last_time = moment(last_date)
            let curr_time = 0
            let rate: number;
            let current_time = moment()
            let days = current_time.diff(last_time, 'days')
            let daily_interest
            let monthly_interest = 0;
            var monthly = 10;
            let interest_rate
            interest_rate = ((interest / 100) / 30).toFixed(2);

            while (curr_time < days) {
              daily_interest = balance * interest_rate;
              balance = balance + daily_interest;
              days--;
            }
            return balance;
          } else {
            return 0;
          }
        } else {
          let balance = loan.amount;
          let interest = loan.interest_percent;
          let last_date = loan.start_date;
          let last_time = moment(last_date)
          let curr_time = 0
          let rate: number;
          let current_time = moment()
          let days = current_time.diff(last_time, 'days')
          let daily_interest
          let monthly_interest = 0;
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
    private prepareSave(data): any {
      let input = new FormData();
      input.append('loan_type', data.loan_type);
      input.append('repayment_method', data.repayment_method);
      input.append('amount', data.amount);
      input.append('description', data.description);
      // input.append('requirements_files', this.requirements_files);
      input.append('vendor_id', this.vendor.id);
      input.append('staff_id', JSON.parse(this.localService.getUser()).id);
      input.append('user_id', JSON.parse(this.localService.getUser()).user_id);
      input.append('member_id', this.memberId);
      input.append('branch_id', this.vendor_branch.id);
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

    count_no_loan_days(start_date)
    {
      if(start_date)
      {
        var a = moment(start_date);
        var b = moment();
        return b.diff(a, 'days')
      }
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

  calculate_loan_reducing_balance(amount, percentage, type, duration)
  {
    duration = duration+1;
    this.show_loader = true;
    /*var a = moment([2018, 0, 28]);
  var b = moment();
  a.from(b) */
    //var percentage = p;
    //var daily_percentage = ((10 / 100) / 30).toFixed(4);
    //let 3_decimal_daily_percentage = daily_percentage.toFixed(3)

    let calculator_array = [];
    //var amount = 100000;
      var monthly = 10;
      //var duration = 60;
      var rate = ((percentage / 100) / 30).toFixed(4);

      //rate = rate / 100 / 12;

      var m = 0;    // number of months

      while (amount > 0) {
          var interest = amount * parseFloat(rate);
          
          var principal = amount + interest;
          
          let array = {
          original_amount: amount.toFixed(2),
          principal: principal.toFixed(2),
          interest:interest.toFixed(2)
        }
        calculator_array.push(array)
        
          if (duration > 0) {
              //principal = amount;
              amount = principal;
          } else {
              amount -= principal;
          }

          // build table: m + 1, principal, interest, amount

          m++;
      }
    this.calculator_array = calculator_array;
    //console.log(calculator_array.pop().original_amount)
    this.show_loader = false;
  }
 /* buildTable() {

      var amount = 100000;
      var monthly = 10;
      var rate = parseFloat((10 / 100) / 30).toFixed(4);

      //rate = rate / 100 / 12;

      var m = 0;    // number of months

      while (amount > 0) {
          var interest = amount * rate;
          var principal = monthly + interest;

          if (principal > amount) {
              principal = amount;
              amount = 0.0;
          } else {
              amount -= principal;
          }

          // build table: m + 1, principal, interest, amount

          m++;
      }

      // display table
  }*/

  flat_rate(amount, percentage, type, duration)
  {
    /*$percentageInterest = $loanRequest->amount*($loanSetting->interest/100);
        $totalPayment = $loanRequest->amount + $loanRequest->interest_amount;
        $monthtlyDeductions = round($totalPayment / $loanSetting->duration, 2);*/

        this.show_loader = true;
      /*var a = moment([2018, 0, 28]);
    var b = moment();
    a.from(b) */
      //var percentage = p;
      var daily_percentage = ((10 / 100) / 30).toFixed(4);
      //let 3_decimal_daily_percentage = daily_percentage.toFixed(3)

      let calculator_array = [];
      //var amount = 100000;
        amount = amount / duration
        var monthly = 10;
        //var duration = 60;
        var rate = ((percentage / 100) / duration).toFixed(4);

        //rate = rate / 100 / 12;

        var m = 0;    // number of months

        while (amount > 0) {
            var interest = amount * parseFloat(rate);
            var principal = amount + interest;
            let array = {
            original_amount: amount.toFixed(2),
            principal: principal.toFixed(2),
            interest:interest.toFixed(2)
          }
          calculator_array.push(array)
            if (duration > 0) {
                //principal = amount;
                amount = amount;
            } else {
                amount -= amount;
            }

            // build table: m + 1, principal, interest, amount

            m++;
        }
      this.calculator_array = calculator_array;
        this.show_loader = false;

  }

  calculate_interest(form_values)
  {
    if(form_values.interest_type == 1)
    {
      this.flat_rate(form_values.amount, form_values.percentage, form_values.interest_type, form_values.duration)
    }
    if(form_values.interest_type == 2)
    {
      this.calculate_loan_reducing_balance(form_values.amount, form_values.percentage, form_values.interest_type, form_values.duration)
    }
  }
}