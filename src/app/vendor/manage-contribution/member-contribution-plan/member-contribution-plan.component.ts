import { Component, OnInit, ViewChild } from '@angular/core';
import { trigger, style, animate, transition } from '@angular/animations';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LocalService } from '../../../storage/local.service';
import { ContributionService } from '../contribution.service';
// import { XlsxToJsonService } from '../../shared/xls/index'
import { MembersService } from '../../membership/members.service';
import { StaffService } from '../../staff/staff.service';
import { VendorService } from '../../vendor.service';
import { TableExportService } from '../../../shared/services/index';
//import * as FileSaver from 'file-saver';
import * as moment from 'moment';

@Component({
  selector: 'app-member-contribution-plan',
  templateUrl: './member-contribution-plan.component.html'

})
export class MemberContributionPlanComponent implements OnInit {

  public vendor;

  submitPending: boolean;
  btn_loader: boolean = false;
  show_load_more_button: boolean = true;
  show_hide_adv_options: boolean = false;
  user;
  filterForm: FormGroup;
  adv_filter: boolean = false;
  contribution_plans;
  member_contribution_plans;
  vendor_branches;
  loader;
  toPage;
  searching = false;
  searchFailed = false;
  hideSearchingWhenUnsubscribed = new Observable(() => () => this.searching = false);
  @ViewChild('view_plan_contribution_history_modal') public view_plan_contribution_history_modal: ModalDirective;
  constructor(
    private localService: LocalService,
    private exportService: TableExportService,
    private _fb: FormBuilder,
    private memberService: MembersService,
    private vendor_service: VendorService,
    private staffService: StaffService,
    private contributionService: ContributionService
  ) {
    this.user = JSON.parse(this.localService.getUser());
    this.vendor = JSON.parse(this.localService.getVendor());

    this.get_contribution_plan();
    this.get_vendor_branches();
    this.get_member_contribution_plan();

  }

  // filter members
  search = (text$: Observable<string>) =>
    text$
      .debounceTime(300)
      .distinctUntilChanged()
      .do(() => this.searching = true)
      .switchMap(term =>
        this.memberService.filterMembers(term)
          .do(() => this.searchFailed = false)
          .catch(() => {
            this.searchFailed = true;
            return of([]);
          }))
      .do(() => this.searching = false)
      .merge(this.hideSearchingWhenUnsubscribed);
  formatter = (x: { first_name: string, middle_name: string, last_name: string, passport: string }) => x.first_name + '  ' + x.middle_name + '  ' + x.last_name;


  ngOnInit() {
    /*this.runContributionForm = this._fb.group({
      plan_id : [null, Validators.compose([Validators.required])],
      type : [null, Validators.compose([Validators.required])],
      period : [null, Validators.compose([Validators.required])]
    });*/

    /*filter form*/
    this.filterForm = this._fb.group({
      //transaction_id : '',
      //from : '',
      //to : '',
      //id : '',
      member_id: '',
      //branch_id: '',
      plan_id: '',
      // type:'',
      status: ''
    })

  }

  /**
   * @method get_contribution_plan
   * get mem
   */
  get_contribution_plan() {
    this.submitPending = true;
    this.contributionService.get_contribution_plan().subscribe((response) => {
      this.contribution_plans = response;
      this.submitPending = false;
    })
  }

  /**
   * @method get_member_contribution_plan
   * get mem
   */
  get_member_contribution_plan() {
    this.submitPending = true;
    this.contributionService.get_vendor_member_contribution_plan().subscribe((response) => {
      this.member_contribution_plans = response.data;
      this.toPage = response.next_page_url;
      this.submitPending = false;
    })
  }

  load_more() {
    this.loader = true;
    if (this.toPage) {
      this.localService.getPaginateData(this.toPage).subscribe((response) => {
        this.toPage = response.next_page_url;
        this.loader = false;
        for (var i = 0; i < response.data.length; i++) {
          this.member_contribution_plans.push(response.data[i])
        }

      })
    } else {
      this.loader = false;
      this.localService.showError('All data have been loaded', 'Operation Unsuccessfull');
    }
  }


  /**
   * @method get_vendor_branches
   * get vendor branches
   * @return data
   */
  get_vendor_branches() {
    this.vendor_service.getVendorBranches().subscribe((response) => {
      this.vendor_branches = response.data
    })
  }

  /**
   * @method filter_member_contribution_plan
   * filter members contribution plan
   */
  filter_member_contribution_plan(filterValues) {
    this.submitPending = true;

    let data = {
      //from : filterValues.from,
      plan_id: filterValues.plan_id,
      //branch_id : filterValues.branch_id,
      //to : filterValues.to,
      //id : filterValues.id,
      //staff_id : filterValues.staff_id.id,
      member_id: filterValues.member_id.id,
      //type : filterValues.type,
      status: filterValues.status,
      vendor_id: parseInt(this.vendor.id)
    }
    this.contributionService.filter_member_contribution_plan(data).subscribe((response) => {
      this.member_contribution_plans = response.data
      this.submitPending = false;
      this.show_load_more_button = false;
    }, (error) => {
      this.submitPending = false;
      this.localService.showError('Oops! Server Error!', 'Server Error Please contact Administrator');
    })
  }

  exportTable(format, tableId) {
    this.exportService.exportTo(format, tableId);
  }

  /**
   * @method view_plan_history
   * view plan history
   *
   */
  view_plan_history(contributionplan_id) {

  }

  /**
   * @method printReciept
   * print reciept
   */
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
   * @method load_plan_transactions_history
   * loads contribution plan transaction history in a modal
   */
  load_plan_transactions_history(plan_id) {
    this.view_plan_contribution_history_modal.show();
  }
  adv_options() {
    this.show_hide_adv_options != this.show_hide_adv_options
  }
}