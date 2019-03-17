import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { FormGroup, FormBuilder, Validators, FormControl, FormArray } from '@angular/forms';
import { LocalService } from '../../../storage/local.service';
import { MembersService } from '../members.service';

import { ContributionService } from '../../manage-contribution/contribution.service';

import { WidthdrawalsService } from '../../manage-widthdrawals/widthdrawals.service';
import { ViewMemberComponent } from '../view-member/view-member.component';
import { MemberContributionsComponent } from '../member-contributions/member-contributions.component';
import { DeviceDetectorService } from 'ngx-device-detector';

import * as moment from 'moment';
import { TableExportService } from '../../../shared/services/index';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-member-withdrawals',
  templateUrl: './member-withdrawals.html',
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
export class MemberWithdrawalsComponent implements OnInit {
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
    
    monthList;
   
    filterForm: FormGroup;
    
    submitPending:boolean;
    btn_loader: boolean = false;
    approve_btn_loader: boolean = false;
    
    public withdrawalForm : FormGroup;
    files;
    current_year = moment().format('YYYY');
    member_plan_list;
    total_contribution_amount;
    deduction_type_list;
    image_url;
    signature_url;
    passport;
    member_signature;
    vendor_branch;
    member_contribution_component;
    transaction_data;
   	@ViewChild('fileInput') fileInput: ElementRef;
    @ViewChild('newWithdrawalModal') public newWithdrawalModal : ModalDirective;
    @ViewChild('view_transaction_modal') public view_transaction_modal : ModalDirective;
  
    constructor(
      private route : ActivatedRoute, 
    	private localService : LocalService,
      private contributionService : ContributionService,
      private withdrawalService : WidthdrawalsService,
      private exportService: TableExportService,
      private router : Router,
      private sanitizer:DomSanitizer,
  	  private _fb : FormBuilder,
      private memberService : MembersService,
      private view_member_component: ViewMemberComponent,
      private deviceService: DeviceDetectorService,
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
       
        
        this.getMemberWithdrawal();
        
        this.get_member_contribution_plan();
       }

    ngOnInit() {

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
        id : '',
        plan_id : ''
      });

    }

    get_member_contribution_plan()
    {
      this.submitPending = true;
      this.contributionService.get_member_contribution_plan(this.memberId).subscribe((response) => {
        this.member_plan_list = response.data;
        this.submitPending = false;
      })
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
      formValues['user_id'] = this.user.user_id;
      formValues['mode'] = 'ntxn';
      formValues['app_channel'] = 'web';
      formValues['device_info'] = 'browser: ' + this.deviceService.getDeviceInfo().browser + ' /browser_version: ' + this.deviceService.getDeviceInfo().browser_version + ' /device: ' + this.deviceService.getDeviceInfo().device + ' /os: ' + this.deviceService.getDeviceInfo().os;

      formValues.transaction_type = 'debit';
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

    exportTable(format, tableId)
    {
      this.exportService.exportTo(format, tableId);
    }
    
    filter_withdawals(filterValues)
    {
      this.submitPending = true;
      filterValues['vendor_id'] = parseInt(this.vendor.id);
      filterValues['member_id'] = parseInt(this.memberId);
      this.withdrawalService.filter_withdrawal(filterValues).subscribe((response) => {
        this.withdrawal_list = response.data
        // this.total_contribution_amount = response.total;
        this.submitPending = false;
      })
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
          this.view_member_component.get_member_contribution_plan();
         this.view_member_component.getMemberProfile();
         this.view_member_component.getActualBalance();
         //this.member_contribution_component.get_member_contribution_plan();
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
   * @method view_transaction_details
   * using a modal to view transaction data
   *
   */
  view_transaction_details(transaction_data)
  {
    this.transaction_data = transaction_data;
    this.view_transaction_modal.show();
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

}