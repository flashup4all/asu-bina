import { Component, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { FormGroup, FormBuilder, Validators, FormControl, FormArray } from '@angular/forms';
import { LocalService, currency } from '../../../storage/index';
import { MembersService } from '../members.service';
import { LoanRequestService } from '../../manage-loanrequest/loan-request.service';
import { LoanSettingsService } from '../../loans/loan-settings/loan-settings.service';
import { ContributionService } from '../../manage-contribution/contribution.service';
import { DeductionsService } from '../../manage-deductions/deductions.service';
import { TargetSavingsService } from '../../target-savings/target-savings.service';
import { WidthdrawalsService } from '../../manage-widthdrawals/widthdrawals.service';
import * as moment from 'moment';
import { TableExportService } from '../../../shared/services/index';
import { ViewMemberComponent } from '../view-member/view-member.component';
import { DeviceDetectorService } from 'ngx-device-detector';

@Component({
  selector: 'app-member-contributions',
  templateUrl: './member-contributions.component.html',
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
export class MemberContributionsComponent implements OnInit {
    public contribution_application_form : FormGroup;
    public vendor;
    public user;
    public member_id;
    public member;
    public memberContributionList;
    public contribution_type_list;
    contribution_plan_list
    member_plan_list
    withdrawal_list;
    actual_balance
    total_contribution;
    total_deduction;
    showFileNames;
    monthList;
    currencies = currency;
    vendor_curency;
    errorMessage
    public runContributionForm : FormGroup;
    contributionFilterForm: FormGroup;
    submitPending:boolean;
    form_loader: boolean = false;
    btn_loader : boolean = false;
    approve_btn_loader : boolean = false;
    files;
    current_year = moment().format('YYYY');
    vendor_branch;
    total_contribution_amount;
    transaction_data;
    @ViewChild('newContributionModal') public newContributionModal : ModalDirective;
    @ViewChild('newContributionPlanModal') public newContributionPlanModal : ModalDirective;
    @ViewChild('view_contribution_transaction_modal') public view_contribution_transaction_modal : ModalDirective;
    constructor(
      private route : ActivatedRoute, 
    	private localService : LocalService,
      private contributionService : ContributionService,
      private withdrawalService : WidthdrawalsService,
      private exportService: TableExportService,
      private memberService : MembersService,
  	  private _fb : FormBuilder,
      private view_member_component: ViewMemberComponent, 
      private deviceService: DeviceDetectorService
    	) {
        this.vendor = JSON.parse(this.localService.getVendor());
        this.user = JSON.parse(this.localService.getUser());
        this.vendor_branch = JSON.parse(this.localService.getBranchData());
        //this.router.events.subscribe((val) => {
        this.member_id = this.route.snapshot.params['member_id'];
         // });
        this.filter_curency(this.vendor.currency_code)

        this.monthList = this.localService.yearjson();
        this.member_id = this.view_member_component.memberId;

        this.getMemberContributions();
        this.get_contribution_type();
        this.get_contribution_plan();
        this.get_member_contribution_plan();
       }

        ngOnInit() {
     
      this.runContributionForm = this._fb.group({
        period : '',
        type : [null, Validators.compose([Validators.required])],
        date : '',
        plan_id : [null, Validators.compose([Validators.required])],
        amount: [null, Validators.compose([Validators.required])],
        depositor:'',
        description: ''
      });
      
       this.contributionFilterForm = this._fb.group({
        from : '',
        to : '',
        id : '',
        type:''
      });

      this.contribution_application_form = this._fb.group({
        accept_terms : [null, Validators.compose([Validators.required])],
        //roi_value: [null, Validators.compose([Validators.required])],
      });

    }

     refresh()
    {
      this.submitPending = true;
      // this.get_member_investment_plan()
      // this.get_investment_plan();
      // this.get_member_investment_history();
      this.get_contribution_type()
      this.submitPending = false;
    }
    

    get_member_contribution_plan()
    {
      this.submitPending = true;
      this.contributionService.get_member_contribution_plan(this.member_id).subscribe((response) => {
        this.member_plan_list = response.data;
        this.submitPending = false;
      })
    }

    filter_curency(code)
    {
      for (var i in this.currencies) {
        if(this.currencies[i].code == code)
        {
          return this.vendor_curency = this.currencies[i].symbol;
        }
      }
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

    /**
     * @method print_transaction
     * prints single transaction slip
     */
    print_transaction(id): void {
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
                  border: 0px;
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
    
    get_contribution_plan()
    {
      this.submitPending = true;
      this.contributionService.get_contribution_plan().subscribe((response) => {
        this.contribution_plan_list = response;
        this.submitPending = false;
      })
    }
    get_contribution_type()
    {
      this.contributionService.get_contribution_type().subscribe((response) => {
        this.contribution_type_list = response.data;
      })
    }

    /**
     * @method view_contribution_transaction_details
     * using a modal to view transaction data
     *
     */
    view_contribution_transaction_details(transaction_data)
    {
      this.transaction_data = transaction_data;
      this.view_contribution_transaction_modal.show();
    }
   /**
   * @method mask_number
   * mask account number and ids
   */
    mask_number(number) {
      // let number = '4567 6365 7987 3783';
      if(number)
      {
        let first4 = number.substring(0, 2);
        let last5 = number.substring(number.length - 2);

        let mask = number.substring(4, number.length - 2).replace(/\d/g,"*");
        return first4 + mask + last5;
      }
      return '******';
    }
    /**
     * @method getMemberContributions
     * get member loan deductions resource
     * @return data
     */
    getMemberContributions()
    {
      this.memberService.getMemberContributions(this.member_id).subscribe((response) => {
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

    percentage_to_amount(total_amount, percentage)
    {
      let amount = 0
      return amount = parseInt(total_amount) * (parseInt(percentage)/100);
    }

    makeContribution(formValues)
    {
      console.log(this.deviceService.getDeviceInfo())
       /*if(parseInt(this.member.status))
       {*/
         let data = {
           //status: parseInt(this.member.status),
           id:this.member_id,
           contribution: parseInt(formValues.contribution)
         }
        formValues['amount'] = parseFloat(formValues.amount);
        formValues['contributions'] = [data];
        formValues['vendor_id'] = this.vendor.id;
        formValues['staff_id'] = this.user.id;
        formValues['user_id'] = this.user.user_id;
        formValues['member_id'] = this.member_id;
        formValues['branch_id'] = this.vendor_branch.id;
        formValues['mode'] = 'ntxn';
        formValues['app_channel'] = 'web';
        formValues['device_info'] = 'browser: '+ this.deviceService.getDeviceInfo().browser + ' /browser_version: ' + this.deviceService.getDeviceInfo().browser_version + ' /device: ' + this.deviceService.getDeviceInfo().device + ' /os: '+this.deviceService.getDeviceInfo().os;
        
        formValues.transaction_type = 'credit';

        this.submitPending = true;
        this.contributionService.create_contribution(formValues).subscribe((response) => {
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
                this.localService.showError('Server Error','Operation Unsuccessfull');
        })
        /*this.contributionService.runEditedContributions(formValues).subscribe((response) => {
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
        });*/
       /*}else{
         console.log('not active')
            this.localService.showError('Cannot make contribution on an inactive account','Account Inactive');
       }*/
    }

    filterContribution(filterValues)
    {
      this.submitPending = true;
      filterValues['vendor_id'] = parseInt(this.vendor.id);
      filterValues['member_id'] = parseInt(this.member_id);
      this.contributionService.filterContribution(filterValues).subscribe((response) => {
        this.memberContributionList = response.data
        this.total_contribution_amount = response.total;
        this.submitPending = false;
      })
    }
    getActualBalance()
    {
      this.withdrawalService.getActualBalance(this.member_id).subscribe((response) => {
        this.actual_balance = response;
      })
    }

    apply_contribution_plan(form_values,contribution)
    {
      this.contribution_application_form.updateValueAndValidity();
    if (this.contribution_application_form.invalid) {
      Object.keys(this.contribution_application_form.controls).forEach(key => {
        this.contribution_application_form.get(key).markAsDirty();
      });
      return;
    }
      for (var i in this.member_plan_list) {
        if(this.member_plan_list[i].contributionplan_id == contribution.id)
        {
          this.errorMessage = 'This member already have this plan active as part of his contribution';
          return this.localService.showError('This member already have this plan active as part of his contribution','Operation Successfull');
        }
      }
      let data = {
        member_id: this.member_id,
        contributionplan_id: contribution.id,
        vendor_id: this.vendor.id,
        staff_id: this.user.id,
        user_id: this.user.user_id,
        //roi_value:form_values.roi_value
      }
      this.form_loader = true;
      this.contributionService.create_member_contribution_plan(data).subscribe((response) => {
        if(response.success)
        {
          this.form_loader = false;
          this.get_member_contribution_plan()
          this.view_member_component.get_member_contribution_plan();
          this.newContributionPlanModal.hide();
          this.localService.showSuccess(response.message,'Operation Successfull');
        }else{
          this.form_loader = false;
              this.localService.showError(response.message,'Operation Successfull');
              this.localService.showError(response,'Operation Successfull');
        }
      }, (error)=> {
          this.form_loader = false;
        this.localService.showError(error,'!Oops Operation UnSuccessfull');
      })
    }

    approve_contribution(id, status)
    {
      this.approve_btn_loader = true;
      let data = {
        id: id,
        approved_by: this.user.id,
        user_id: this.user.user_id,
        vendor_id: this.vendor.id,
        status: status,
      }
      
      this.contributionService.approve_contribution(data).subscribe((response) => {
        if (response.success) {
      this.approve_btn_loader = false;
            this.get_member_contribution_plan();
            this.localService.showSuccess(response.message,'Operation Successfull');
          }else{
      this.approve_btn_loader = false;
            this.localService.showError(response.message,'Operation Unsuccessfull');
          }
        }, (error) => {
      this.approve_btn_loader = false;
          this.form_loader = false;
                this.localService.showError(error,'Operation Unsuccessfull');
        });
    }

    delete_contribution_plan(id)
    {
      let data = {
        user_id : this.user.user_id,
        vendor_id : this.vendor.id
      }
      this.contributionService.delete_member_contribution_plan(id, data).subscribe((response) => {
        if (response.success) {
      this.approve_btn_loader = false;
            this.get_member_contribution_plan();
            this.localService.showSuccess(response.message,'Operation Successfull');
          }else{
      this.approve_btn_loader = false;
            this.localService.showError(response.message,'Operation Unsuccessfull');
          }
        }, (error) => {
      this.approve_btn_loader = false;
          this.form_loader = false;
                this.localService.showError(error,'Operation Unsuccessfull');
        });
    }

    delete_contribution_history(id)
    {
      let data = {
        id: id,
        user_id : this.user.user_id,
        vendor_id : this.vendor.id
      }
      this.contributionService.delete_contribution_history(data).subscribe((response) => {
        if (response.success) {
          this.approve_btn_loader = false;
          this.getMemberContributions();
            this.view_member_component.getMemberProfile();
            this.view_member_component.getActualBalance();
          this.localService.showSuccess(response.message,'Operation Successfull');
        }else{
          this.approve_btn_loader = false;
          this.localService.showError(response.message,'Operation Unsuccessfull');
        }
      }, (error) => {
      this.approve_btn_loader = false;
          this.form_loader = false;
                this.localService.showError(error,'Operation Unsuccessfull');
        });
    }

    post_transaction(transaction_id, status)
    {
      this.btn_loader = true;
      let data = {
        id: transaction_id,
        approved_by: this.user.id,
        user_id: this.user.user_id,
        member_id: this.member_id,
        vendor_id: this.vendor.id,
        status: status
      }
      
      this.contributionService.post_contribution_history(data).subscribe((response) => {
        if (response.success) {
            this.btn_loader = false;
            this.getMemberContributions();
            this.get_member_contribution_plan();
            this.view_member_component.getMemberProfile();
            this.view_member_component.getActualBalance();
            this.localService.showSuccess(response.message,'Operation Successfull');
          }else{
            this.btn_loader = false;
            this.localService.showError(response.message,'Operation Unsuccessfull');
          }
        }, (error) => {
            this.btn_loader = false;
          this.form_loader = false;
                this.localService.showError(error,'Operation Unsuccessfull');
        });
    }
}