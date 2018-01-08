import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalDirective } from 'ngx-bootstrap/modal/modal.component';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LocalService } from '../../storage/local.service';
import { LoanRequestService } from './loan-request.service';

@Component({
  selector: 'app-manage-loanrequest',
  templateUrl: './manage-loanrequest.component.html',
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
export class ManageLoanrequestComponent implements OnInit {

	  public vendor;
	private loanRequestList= [] ;
  toPage;
  loader;
	constructor(
	private localService : LocalService,
	private _fb : FormBuilder,
  private route: Router,
	private loanrequestService : LoanRequestService
	) {
	this.vendor = JSON.parse(this.localService.getVendor());
	this.getLoanRequest();
		}
	ngOnInit() {
	}
	/*loan request method*/

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
      /* for(var i=0; i < response.data.length; i++)
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
        this.getLoanRequest();
      	this.localService.showSuccess(response.message,'Operation Successfull');
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
      	this.localService.showSuccess(response.message,'Operation UnsSuccessfull');
        this.getLoanRequest();
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

    requestHistory(id)
    {
      this.route.navigate(['coorp/'+id+'/loan-request-history'])
    }

}
