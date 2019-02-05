import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { VendorService } from '../vendor.service';
import { TableExportService } from '../../shared/services/index';

import { LocalService } from '../../storage/local.service';
import { DashboardService } from './dashboard.service';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { MessageService } from '../message-center/message.service';
import { LoanRequestService } from '../manage-loanrequest/loan-request.service';
import { ContributionService } from '../manage-contribution/contribution.service';
import { WidthdrawalsService } from '../manage-widthdrawals/widthdrawals.service';
import { environment } from '../../../environments/environment';
declare let d3: any;
import * as moment from 'moment';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
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
export class DashboardComponent implements OnInit {
	public membersList;
	public loanRequestList;
	public contibutionsList;
	public deductionsList;
  public total_paid_contribution;
	public total_pending_contribution;
	public totalDedutions
	public totalMembers;
	public runDeductionsForm : FormGroup;
  filterForm: FormGroup;
	public runContributionForm : FormGroup;
	submitPending : boolean;
	successAlert;
	options;
    data;

    //pagination
    toPage;
  	loader;
    //messaging
    public vendor;
    public user;
	  public messagesList;
    public messages: boolean;
    approve_btn_loader: boolean = false;
    public viewMessages: boolean;
    public messageDetails;
    public messageForm: FormGroup;
    public changeContibutionsRequestList;
    public widthdrawalsList;
    totalActiveMembers;
    toRequestPage;
    total_widthdrawals_paid;
    total_widthdrawals_pending;
    vendor_branches;
    member_image_url
  	constructor(
  		private localService : LocalService,
      	private sanitizer:DomSanitizer,
  		private _fb : FormBuilder,
      private exportService: TableExportService,
  		private dashboardService : DashboardService,
  		private messageService : MessageService,
  		private route: Router,
      private vendor_service : VendorService,
      private loanrequestService : LoanRequestService,
      private contributionService : ContributionService,
  		private widthdrawalService : WidthdrawalsService,
  		) { 
  		this.getMembers();
      this.vendor = JSON.parse(this.localService.getVendor());
  		this.user = JSON.parse(this.localService.getUser());
      this.member_image_url = environment.api.imageUrl+'profile/member/';
      	//this.getVendorMessages('inbox');
  		this.getLoanRequest();
      this.getChangeContributionRequest();
      this.getWidthdrawals();
      this.get_vendor_branches();
  		this.getVendorstatistics();
  	}

  	ngOnInit() {
  		this.messageForm = this._fb.group({
          subject : [null, Validators.compose([Validators.required])],
          details : [null, Validators.compose([Validators.required])],
          type: [null, Validators.compose([Validators.required])],
          //emails: this._fb.array([this.initEmails()])
      });
       /*filter form*/
       this.filterForm = this._fb.group({
        from : '',
        to : '',
        id : '',
        member_id:'',
        loan_request_id: '',
        loan_id:'',
        branch_id:'',
        repayment_method: '',
        status: '',
        approved_by: '',
      });
  	}
  	/**
	 * @method getMembers
	 * get members form field
	 * @return data
	 */
	getMembers()
	{
		this.dashboardService.getMember().subscribe((response) => {
			this.membersList = response.data.data
		});
	}

  filterLoanRequest(filterValues)
    {
      this.submitPending = true;
      filterValues['vendor_id'] = parseInt(this.vendor.id);
      this.loanrequestService.filterLoanRequest(filterValues).subscribe((response) => {
        this.loanRequestList = response.data;
        this.submitPending = false;
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

  /**
   * @method calculate_loan_balance
   * calculates loan balance from last active deductions
   * @var loan
   */
  calculate_loan_balance(loan)
  {
      if(loan.status == 1)
      {
        if(loan.type.interest_type == 2)
        {
          if(loan.deductions_per_loan.length > 0)
          {
            var lastItem = loan.deductions_per_loan[loan.deductions_per_loan.length-1];
            let balance = lastItem.current_balance;
            let interest = lastItem.interest_percent;
            let last_date = lastItem.run_date;
            if(balance > 1)
            {
              let last_time = moment(last_date)
              let curr_time = 0
              let rate: number;
              let current_time = moment()
              let days = current_time.diff(last_time, 'days')
              let daily_interest
              let monthly_interest=0;
                var monthly = 10;
                let interest_rate 
                interest_rate = ((interest / 100) / 30).toFixed(2);

                while (curr_time < days) {
                  daily_interest = balance * interest_rate;
                      balance = balance + daily_interest;
                          days--;
                }
                return balance;
            }else{
              return 0;
            }
          } else{
            let balance = loan.amount;
            let interest = loan.interest_percent;
            let last_date = loan.start_date;
            let last_time = moment(last_date)
            let curr_time = 0
            let rate: number;
            let current_time = moment()
            let days = current_time.diff(last_time, 'days')
            let daily_interest
            let monthly_interest=0;
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
      } else {
        return 0;
      }
    }

  percentage_to_amount(total_amount, percentage)
  {
    let amount = 0
    return amount = parseInt(total_amount) * (parseInt(percentage)/100);
  }

	/**
	 * @method getVendorstatistics
	 * get vendor stats
	 * @return data
	 */
	getVendorstatistics()
	{
		this.dashboardService.getVendorStatistics().subscribe((response) => {
      this.total_paid_contribution = response.data.total_paid_contribution
			this.total_pending_contribution = response.data.total_pending_contribution
			this.totalDedutions = response.data.totalDeduction
      this.totalMembers = response.data.totalNoMembers
      this.totalActiveMembers = response.data.totalNoActiveMembers
      this.total_widthdrawals_paid = response.data.total_widthdrawals_paid
			this.total_widthdrawals_pending = response.data.total_widthdrawals_pending

      for (var i = 0; i < this.totalMembers.length; i++) {
        // console.log(this.totalMembers[i].first_name)
      }
		});
	}

  percentageCalculator(value, total)
  {
    let percentage = 0;
    percentage = (value/total) * 100;
    return Math.round(percentage)
  }
	/**
	 * @method activateMember
	 * activate member
	 * @return data
	 */
	activateMember(id)
	{
		this.dashboardService.activateMember(id).subscribe((response) => {
			if(response.success == true)
			{
				this.getMembers()
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
		this.dashboardService.deactivateMember(id).subscribe((response) => {
			if(response.success == true)
			{
				this.getMembers()
				this.localService.showSuccess(response.message,'Operation Successfull');
			}else{
				this.localService.showError(response.message,'Operation UnsSuccessfull');
			}
		});
	}
	/*loan request method*/

	requestHistory(id)
  {
    this.route.navigate(['app/loan-request/'+id+'/loan-request-history'])
  }

  /**
     * @method close_loan
     * close | complete | stop an active loan
     * @var loan
     * @return response
     */
    close_loan(loan)
    {
      console.log(loan)
      this.approve_btn_loader = true;
      let data = {
        vendor_id: this.vendor.id,
        user_id: this.user.id,
        member_id: loan.member_id,
        loan_request_id: loan.id,
      } 
      this.loanrequestService.close_loan_request(data).subscribe((response) => {
        if(response.success)
        {
          this.approve_btn_loader = false;
           this.getLoanRequest()
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
	 * @method getLoanRequest
	 * get vendor loan request
	 * @return data
	 */
	getLoanRequest()
	{
		this.loanrequestService.getLoanRequest().subscribe((response) => {
      this.toPage = response.next_page_url;
      this.loanRequestList = response.data;
       /*for(var i=0; i < response.data.length; i++)
       {
           this.loanRequestList.push(response.data[i])
       }*/
		});
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
           this.loanRequestList.push(response.data[i])
         }

       })
     }else{
         this.loader = false;
          this.localService.showError('All data have been loaded','Operation Unsuccessfull');
     }
    }

	/**
     * @method approveLoanRequest
     * cancel loan request
     * @return data
     */
    approveLoanRequest(id)
    {
      this.loanrequestService.approveLoanRequest(id).subscribe((response) => {
      	this.localService.showSuccess(response.message,'Operation UnsSuccessfull');
        this.getLoanRequest();
      });
    }

	/**
     * @method cancelLoanRequest
     * cancel loan request
     * @return data
     */
    cancelLoanRequest(id)
    {
      this.loanrequestService.cancelLoanRequest(id).subscribe((response) => {

      	if(response.success)
      	{
      		this.localService.showSuccess(response.message,'Operation Successfull');
        	this.getLoanRequest();
      	}
      	else{
      		this.localService.showError(response.message,'Operation UnsSuccessfull');
      	}
      });
    }

    /**
     * @method deleteLoanRequest
     * cancel loan request
     * @return data
     */
    deleteLoanRequest(id)
    {
      	this.loanrequestService.deleteLoanRequest(id).subscribe((response) => {
        	this.getLoanRequest();
	    	this.localService.showSuccess('loan request deleted','Operation Successfull');
      	});
    }

    /*contributions method*/
	/**
	 * @method getContributions
	 * get vendor contrinbution
	 * @return data
	 */
	/*getContributions()
	{
		this.dashboardService.getContributions().subscribe((response) => {
			this.contibutionsList = response.data
		});
	}*/

	/**
	 * @method getDeductions
	 * get vendor contrinbution
	 * @return data
	 */
	/*getLoanDeductions()
	{
		this.dashboardService.getDeductions().subscribe((response) => {
			this.deductionsList = response.data
		});
	}*/
	/**
	 * @method runDeductions
	 * run loan deductions
	 * @return data
	 */
	/*runDeductions(data)
	{
		this.submitPending = true;
		data['vendor_id'] = JSON.parse(this.localService.getVendor()).id
		data['approved_by'] = JSON.parse(this.localService.getUser()).id
		this.dashboardService.runDeductions(data).subscribe((response) => {
		if(response.success = true)
	    {
	        this.submitPending = false;
	         this.getLoanDeductions();
	         this.getVendorstatistics();
	         this.runDeductionsForm.reset();
	         this.successAlert = response.message;
	        this.localService.showSuccess(response.message,'Operation Successfull');
	    } else{
	        this.submitPending = false;
	        this.localService.showError(response.message,'Operation Unsuccessfull');
	    }
			});
	}*/
	/**
	 * @method runContribution
	 * get vendor contrinbution
	 * @return data
	 */
	/*runContribution(data)
	{
		 this.submitPending = true;
		data['vendor_id'] = JSON.parse(this.localService.getVendor()).id
		data['approved_by'] = JSON.parse(this.localService.getUser()).id
		this.dashboardService.runContributions(data).subscribe((response) => {
		if(response.success = true)
	    {
	        this.submitPending = false;
	         this.getContributions();
	         this.getVendorstatistics();
	         this.runContributionForm.reset();
	         this.successAlert = response.message;
	        this.localService.showSuccess(response.message,'Operation Successfull');
	    } else{
	        this.submitPending = false;
	        this.localService.showError(response.message,'Operation Unsuccessfull');
	    }
			});
	}*/
	//Notification methods
	/**
   * @method sendMessage
   * send mail
   * @return true
   */
  sendMessage(data)
  {
    this.submitPending = true;
    data['vendor_id'] = this.vendor.id;
    data['sender_email'] = this.user.email;
    data['vendor_name'] = this.vendor.name;
    data['sender_id'] = JSON.parse(this.localService.getUser()).email;
    this.messageService.postMessage(data).subscribe((response) => {
      if(response.success = true)
      {
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

  /**
   * @method getVendorMessages
   * get vendor mails
   * @return data
   */
   getVendorMessages(status)
   {
     this.messages = true;
     this.viewMessages = false;
     this.messageService.getVendorMessage(status).subscribe((response) => {
       this.messagesList = response;
     })
   }

   mailSelector(data)
   {
     this.viewMessages = false;
     this.getVendorMessages(data)
   }
   viewMessage(data)
   {
     this.messages = false;
     this.viewMessages = true;
     this.messageDetails = data;
   }

   /*contributions*/
   /**
   * @method getChangeContributionRequest
   * get vendor contrinbution
   * @return data
   */
  getChangeContributionRequest()
  {
    this.contributionService.getChangeContributionRequest().subscribe((response) => {
      this.changeContibutionsRequestList = response.data;
      this.toPage = response.next_page_url;
       /*for(var i=0; i < response.data.length; i++)
           {
               this.changeContibutionsRequestList.push(response.data[i])
           }*/
    });
  }
  loadMoreChangeContributionRequest()
    {
     this.loader = true;
      if(this.toRequestPage){
       this.localService.getPaginateData(this.toRequestPage).subscribe((response) => {
         this.toRequestPage = response.next_page_url;
         this.loader = false;
        for(var i=0; i < response.data.length; i++)
         {
           this.changeContibutionsRequestList.push(response.data[i])
         }

       })
     }else{
         this.loader = false;
          this.localService.showError('All data have been loaded','Operation Unsuccessfull');
     }
    }
  approveChangeContribution(data)
  {
    data['approved_by'] = JSON.parse(this.localService.getUser()).id;
    this.contributionService.approveChangeContribution(data).subscribe((response) => {
      if (response.success) {
          this.getChangeContributionRequest()
          this.localService.showSuccess('New Contribution Amount Approved for this Member','Operation Unsuccessfull');
      }else{
          this.localService.showError('operation unsuccessfull, ply try again later','Operation Unsuccessfull');
      }
    })
  }

  /*widthdrawals*/
  /**
   * @method getWidthdrawals
   * get member widthdrawal
   *  @return true/false
   */
    getWidthdrawals()
  {
    this.widthdrawalService.getWidthdrawals().subscribe((response) => {
      //this.toPage = response.next_page_url;
        this.widthdrawalsList = response.data;
         /*for(var i=0; i < response.data.length; i++)
         {
           this.widthdrawalsList.push(response.data[i])
         }*/
    })
  }
  /**
   * @method approveWidthdrawalRequest
   * approve widthdrawal requests
   *  @return true/false
   */
  approveWidthdrawalRequest(id)
  {
    let data = {
      id : id,
      vendor_id: this.vendor.id,
      status: 'Approved',
      approved_by: JSON.parse(this.localService.getUser()).id
    }
    this.widthdrawalService.approveWidthdrawalRequest(data).subscribe((response) => {
         if(response.success = true)
      {
         this.getWidthdrawals()
        this.localService.showSuccess(response.message,'Operation Successfull');
      }
      else{
        this.localService.showError(response.message,'Operation Unsuccessfull');
      }
       });
  }

  /**
   * @method cancelWidthdrawalRequest
   * cancel widthdrawal requests
   *  @return true/false
   */
  cancelWidthdrawalRequest(id)
  {
    let data = {
      id : id,
      vendor_id: this.vendor.id,
      status: 'Cancelled',
      approved_by: JSON.parse(this.localService.getUser()).id
    }
    this.widthdrawalService.cancelWidthdrawalRequest(data).subscribe((response) => {
         if(response.success = true)
      {
         this.getWidthdrawals()
        this.localService.showSuccess(response.message,'Operation Successfull');
      }
      else{
        this.localService.showError(response.message,'Operation Unsuccessfull');
      }
       });
  }
  exportTable(format, tableId) {
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
}
