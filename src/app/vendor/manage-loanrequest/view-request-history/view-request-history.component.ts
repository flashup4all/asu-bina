import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LocalService } from '../../../storage/local.service';
import { LoanRequestService } from '../loan-request.service';

@Component({
  selector: 'app-view-request-history',
  templateUrl: './view-request-history.component.html',
  styleUrls: ['./view-request-history.component.css']
})
export class ViewRequestHistoryComponent implements OnInit {

	public loan_request_id;
	public vendor;
	public loanRequest;
  	constructor(
  		private localService : LocalService,
		private _fb : FormBuilder,
  		private router: ActivatedRoute,
		private loanrequestService : LoanRequestService
	) { 
		this.vendor = JSON.parse(this.localService.getVendor());
  		this.loan_request_id = this.router.snapshot.params['loan-request-id']
  		this.getLoanRequest();
	}

  	ngOnInit() {
  	}
  	/**
	 * @method getLoanRequest
	 * get vendor loan request
	 * @return data
	 */
	getLoanRequest()
	{
		this.loanrequestService.getSingleLoanRequest(this.loan_request_id).subscribe((response) => {
			this.loanRequest = response
		});
	}
}
