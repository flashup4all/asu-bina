import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import {of} from 'rxjs/observable/of';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LocalService } from '../../storage/local.service';
import { WidthdrawalsService } from './widthdrawals.service';
import { TableExportService } from '../../shared/services/index';
import { MembersService } from '../membership/members.service';
import { StaffService } from '../staff/staff.service';
import { ContributionService } from '../manage-contribution/contribution.service';
import { environment } from '../../../environments/environment';
import { VendorService } from '../vendor.service';

@Component({
  selector: 'app-manage-widthdrawals',
  templateUrl: './manage-widthdrawals.component.html',
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
export class ManageWidthdrawalsComponent implements OnInit {

	public vendor;
	user;
	public widthdrawalsList = [];
	contribution_plan_list;
	toPage;
  	loader;
  	staff_image_url
	member_image_url
  	show_adv_form: boolean = false;
  	submitPending: boolean = false;
  	approve_btn_loader: boolean = false;
    filterForm: FormGroup;
    searching = false;
    searchFailed = false;
    hideSearchingWhenUnsubscribed = new Observable(() => () => this.searching = false);
  	
  	staff_searchFailed = false;
	staff_searching = false;
	staff_hideSearchingWhenUnsubscribed  = new Observable(() => () => this.searching = false);
    vendor_branches;
	constructor(
		private localService : LocalService,
      	private exportService: TableExportService,
  		private _fb : FormBuilder,
      	private memberService : MembersService,
      	private staffService : StaffService,
		private contributionService : ContributionService,
    	private vendor_service : VendorService,
  		private widthdrawalService : WidthdrawalsService
  		) {
        this.staff_image_url = environment.api.imageUrl+'profile/staff/';
		this.member_image_url = environment.api.imageUrl+'profile/member/';
		this.vendor = JSON.parse(this.localService.getVendor());
        this.user = JSON.parse(this.localService.getUser());
		this.getWidthdrawals();
		this.get_contribution_plan();
    	this.get_vendor_branches();
  		}

	ngOnInit() {
		/*filter form*/
       this.filterForm = this._fb.group({
	        transaction_id : '',
	        contributionplan_id : '',
	        from : '',
	        to : '',
	        id : '',
          	member_id:'',
          	staff_id:'',
          	branch_id:'',
          	type:'',
          	status: ''
	      })
	}
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
      formatter = (x: {first_name: string, middle_name: string, last_name: string, passport: string}) => x.first_name+'  '+ x.middle_name+'  '+ x.last_name;

    search_staff = (text$: Observable<string>) =>
    text$
      .debounceTime(300)
      .distinctUntilChanged()
      .do(() => this.staff_searching = true)
      .switchMap(sterm =>
        this.staffService.filterStaff(sterm)
          .do(() => this.staff_searchFailed = false)
          .catch(() => {
            this.staff_searchFailed = true;
            return of([]);
          }))
      .do(() => this.staff_searching = false)
      .merge(this.staff_hideSearchingWhenUnsubscribed);
      staff_formatter = (y: {first_name: string, middle_name: string, last_name: string, passport: string, staff_id: string}) => y.first_name+'  '+ y.middle_name+'  '+ y.last_name;

      

	/**
	 * @method getWidthdrawals
	 * get member widthdrawal
	 *	@return true/false
	 */
  	getWidthdrawals()
	{
		this.widthdrawalService.getWidthdrawals().subscribe((response) => {
			this.toPage = response.next_page_url;
			this.widthdrawalsList = response.data;
         /*for(var i=0; i < response.data.length; i++)
         {
           this.widthdrawalsList.push(response.data[i])
         }*/
		})
	}

	/**
     * @method get_vendor_branches
     * get vendor branches
     * @return data
     */
     get_vendor_branches()
     {
       this.vendor_service.getVendorBranches().subscribe((response) => {
         this.vendor_branches = response.data
       })
     }

	get_contribution_plan()
    {
      this.submitPending = true;
      this.contributionService.get_contribution_plan().subscribe((response) => {
        this.contribution_plan_list = response;
        this.submitPending = false;
      })
    }
    show_adv_filter_form()
    {
    	this.show_adv_form = !this.show_adv_form;
    }
	loadMore()
    {
     this.loader = true;
      if(this.toPage){
       this.localService.getPaginateData(this.toPage).subscribe((response) => {
         this.toPage = response.next_page_url;
         this.loader = false;
        for(var i=0; i < response.data.length; i++)
         {
           this.widthdrawalsList.push(response.data[i])
         }

       })
     }else{
         this.loader = false;
          this.localService.showError('All data have been loaded','Operation Unsuccessfull');
     }
    }

	/**
	 * @method approveWidthdrawalRequest
	 * approve widthdrawal requests
	 *	@return true/false
	 */
	approveWidthdrawalRequest(id)
	{
		let data = {
			id : id,
			vendor_id: this.vendor.id,
			status: 'Approved',
			approved_by: JSON.parse(this.localService.getUser()).id
		}
		this.approve_btn_loader = true;
		this.widthdrawalService.approveWidthdrawalRequest(data).subscribe((response) => {
  	 		if(response.success = true)
			{
	 			this.getWidthdrawals()
	 			this.approve_btn_loader = false;
				this.localService.showSuccess(response.message,'Operation Successfull');
			}
			else{
				this.approve_btn_loader = false;
				this.localService.showError(response.message,'Operation Unsuccessfull');
			}
  	 	}, (error) => {
  	 		this.approve_btn_loader = false;
  	 		this.localService.showError('Error while performing this action, please try again later', 'Server Error')
  	 	});
	}

	/**
	 * @method cancelWidthdrawalRequest
	 * cancel widthdrawal requests
	 *	@return true/false
	 */
	cancelWidthdrawalRequest(id)
	{
		let data = {
			id : id,
			vendor_id: this.vendor.id,
			status: 'Cancelled',
			approved_by: JSON.parse(this.localService.getUser()).id
		}
		this.approve_btn_loader = true;
		this.widthdrawalService.cancelWidthdrawalRequest(data).subscribe((response) => {
  	 		if(response.success = true)
			{
	 			this.getWidthdrawals()
	 			this.approve_btn_loader = false;
				this.localService.showSuccess(response.message,'Operation Successfull');
			}
			else{
				this.approve_btn_loader = false;
				this.localService.showError(response.message,'Operation Unsuccessfull');
			}
  	 	}, (error) => {
  	 		this.approve_btn_loader = false;
  	 		this.localService.showError('Error while performing this action, please try again later', 'Server Error')
  	 	});
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
	filter_withdrawal(filterValues)
	{
		let data = {
	        from : filterValues.from,
	        to : filterValues.to,
	        id : filterValues.id,
	        member_id : filterValues.member_id.id,
	        staff_id : filterValues.staff_id.id,
	        transaction_id : filterValues.transaction_id,
	        contributionplan_id : filterValues.contributionplan_id,
	        branch_id : filterValues.branch_id,
	        status : filterValues.status,
	        vendor_id: parseInt(this.vendor.id)
	      }
	      this.submitPending = true;
		this.widthdrawalService.filter_withdrawal(data).subscribe((response) => {
			this.widthdrawalsList = response.data;
			this.submitPending = false;
  	 	}, (error) => {
  	 		this.submitPending = false;
  	 		this.localService.showError('Error while performing this action, please try again later', 'Server Error')
  	 	});
	}
}
