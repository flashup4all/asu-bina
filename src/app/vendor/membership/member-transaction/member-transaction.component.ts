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
import { DeviceDetectorService } from 'ngx-device-detector';

import * as moment from 'moment';
import { TableExportService } from '../../../shared/services/index';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-member-transaction',
  templateUrl: './member-transaction.component.html',
  styleUrls: ['./member-transaction.component.scss']
})
export class MemberTransactionComponent implements OnInit {

  transaction_filter_form: FormGroup;
  image_url;
  signature_url;
  vendor;
  user;
  vendor_branch;
  memberId;
  monthList;
  transaction_list;
  plan_loader;
  member_plan_list;
  transaction_loader: boolean = false;
  show_table:boolean = false;
  total_credit;
  total_debit;
  from_date;
  to_date;
  constructor(private route: ActivatedRoute,
    private localService: LocalService,
    private contributionService: ContributionService,
    private withdrawalService: WidthdrawalsService,
    private exportService: TableExportService,
    private router: Router,
    private sanitizer: DomSanitizer,
    private _fb: FormBuilder,
    private memberService: MembersService,
    private view_member_component: ViewMemberComponent,
    private deviceService: DeviceDetectorService,
  ) {

    this.image_url = environment.api.imageUrl + 'profile/member/';
    this.signature_url = environment.api.imageUrl + 'profile/signature/';
    this.vendor = JSON.parse(this.localService.getVendor());
    this.user = JSON.parse(this.localService.getUser());
    this.vendor_branch = JSON.parse(this.localService.getBranchData());
    this.memberId = this.route.snapshot.params['member_id'];
    this.monthList = this.localService.yearjson();
  }

  ngOnInit() {
    this.get_member_contribution_plan();
    // this.get_member_transactions();
    // transaction filter form initiation
    this.transaction_filter_form = this._fb.group({
        from : '',
        to : '',
        id : '',
        type:'',
        status:'',
        plan_id:[null, Validators.compose([Validators.required])]
      });
  }

  /**
   * @method getMemberWithdrawal
   * get member profile resource
   * @return data
   */
  get_member_transactions() {
    this.transaction_loader = true;
    this.memberService.get_member_transactions(this.memberId).subscribe((response) => {
      this.transaction_list = response.data;
      this.transaction_loader = false;
    })
  }

  /**
   * @method get_member_contribution_plan
   * get contribution plansa that belongs to a particular member 
   * @author Bardeson Lucky <flashup4all@gmail.com>
   * @return data
   */
  get_member_contribution_plan()
  {
    this.plan_loader = true;
    this.contributionService.get_member_contribution_plan(this.memberId).subscribe((response) => {
      this.member_plan_list = response.data;
      this.plan_loader = false;
    })
  }

  /**
   * @method filter_transactions
   * filter transactions based on field values
   * @author Bardeson Lucky <flashup4all@gmail.com>
   * @return data
   */
  filter_transactions(filterValues)
  {
    this.transaction_filter_form.updateValueAndValidity();
    if (this.transaction_filter_form.invalid) {
      Object.keys(this.transaction_filter_form.controls).forEach(key => {
        this.transaction_filter_form.get(key).markAsDirty();
      });
      return;
    }
    this.show_table = false;
    this.to_date = filterValues.to;
    this.from_date = filterValues.from;
    this.transaction_loader = true;
    filterValues['vendor_id'] = parseInt(this.vendor.id);
    filterValues['member_id'] = parseInt(this.memberId);
    this.contributionService.filter_transactions(filterValues).subscribe((response) => {
      this.transaction_list = response.data
      this.total_credit = response.total_credit;
      this.total_debit = response.total_debit;
      this.show_table = true;
      this.transaction_loader = false;
    }, (error)=>{
      this.transaction_loader = false
    })
  }
  /**
   * @method calculate_total_balance
   * subtract two numbers
   */
  calculate_total_balance()
  {
    return parseFloat(this.total_credit) - parseFloat(this.total_debit);
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
            body{font-size:11px; text-align: center;}
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

            .border, th {
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
}
