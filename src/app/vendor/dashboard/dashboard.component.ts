import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { LocalService } from '../../storage/local.service';
import { DashboardService } from './dashboard.service';
import { ModalDirective } from 'ngx-bootstrap/modal/modal.component';
import { MessageService } from '../message-center/message.service';
import { LoanRequestService } from '../manage-loanrequest/loan-request.service';
import { ContributionService } from '../manage-contribution/contribution.service';
import { WidthdrawalsService } from '../manage-widthdrawals/widthdrawals.service';
declare let d3: any;
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
	public totalContribution;
	public totalDedutions
	public totalMembers;
	public runDeductionsForm : FormGroup;
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
    public viewMessages: boolean;
    public messageDetails;
    public messageForm: FormGroup;
    public changeContibutionsRequestList;
    public widthdrawalsList;
    totalActiveMembers;
    toRequestPage;
    totalWidthdrawal;
    
  	constructor(
  		private localService : LocalService,
      	private sanitizer:DomSanitizer,
  		private _fb : FormBuilder,
  		private dashboardService : DashboardService,
  		private messageService : MessageService,
  		private route: Router,
      private loanrequestService : LoanRequestService,
      private contributionService : ContributionService,
  		private widthdrawalService : WidthdrawalsService,
  		) { 
  		this.getMembers();
      this.vendor = JSON.parse(this.localService.getVendor());
  		this.user = JSON.parse(this.localService.getUser());
      	this.getVendorMessages('inbox');
  		this.getLoanRequest();
      this.getChangeContributionRequest();
      this.getWidthdrawals();
  		this.getVendorstatistics();
  	}

  	ngOnInit() {
  		this.messageForm = this._fb.group({
          subject : [null, Validators.compose([Validators.required])],
          details : [null, Validators.compose([Validators.required])],
          type: [null, Validators.compose([Validators.required])],
          //emails: this._fb.array([this.initEmails()])
      })
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
	/**
	 * @method getVendorstatistics
	 * get vendor stats
	 * @return data
	 */
	getVendorstatistics()
	{
		this.dashboardService.getVendorStatistics().subscribe((response) => {
			this.totalContribution = response.data.totalContribution
			this.totalDedutions = response.data.totalDeduction
      this.totalMembers = response.data.totalNoMembers
      this.totalActiveMembers = response.data.totalNoActiveMembers
			this.totalWidthdrawal = response.data.totalWidthdrawal

      for (var i = 0; i < this.totalMembers.length; i++) {
        console.log(this.totalMembers[i].first_name)
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
      this.route.navigate(['coorp/'+id+'/loan-request-history'])
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
}
