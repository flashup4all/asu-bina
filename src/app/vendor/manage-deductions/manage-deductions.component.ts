import { Component, OnInit } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal/modal.component';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LocalService } from '../../storage/local.service';
import { DeductionsService } from './deductions.service';
import * as moment from 'moment';

@Component({
  selector: 'app-manage-deductions',
  templateUrl: './manage-deductions.component.html',
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
export class ManageDeductionsComponent implements OnInit {

	public vendor;
	private deductionsList = [];
	public runDeductionsForm : FormGroup;
	submitPending: boolean;
	successAlert;
	toPage;
  	loader;
  	current_year = moment().format('YYYY');
  	monthList;
	constructor(
		private localService : LocalService,
  		private _fb : FormBuilder,
  		private deductionService : DeductionsService
  		) {
		this.vendor = JSON.parse(this.localService.getVendor());
		this.getLoanDeductions();
		this.monthList = this.localService.yearjson();

  		}

	  ngOnInit() {
	  	this.runDeductionsForm = this._fb.group({
  			repayment_method : [null, Validators.compose([Validators.required])],
  			period : [null, Validators.compose([Validators.required])]
  		})
	  }

	/**
	 * @method getDeductions
	 * get vendor contrinbution
	 * @return data
	 */
	getLoanDeductions()
	{
		this.deductionService.getDeductions().subscribe((response) => {
			this.toPage = response.next_page_url;
			this.deductionsList = response.data;
			/* for(var i=0; i < response.data.length; i++)
	        {
	           	this.deductionsList.push(response.data[i])
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
           this.deductionsList.push(response.data[i])
        }

       })
     }else{
         this.loader = false;
          this.localService.showError('All data have been loaded','Operation Unsuccessfull');
     }
    }

	/**
	 * @method runDeductions
	 * run loan deductions
	 * @return data
	 */
	runDeductions(data)
	{
		this.submitPending = true;
		data['vendor_id'] = JSON.parse(this.localService.getVendor()).id
		data['approved_by'] = JSON.parse(this.localService.getUser()).id
		this.deductionService.runDeductions(data).subscribe((response) => {
		if(response.success = true)
	    {
	        this.submitPending = false;
	         this.getLoanDeductions();
	         this.runDeductionsForm.reset();
	         this.successAlert = response.message;
	        this.localService.showSuccess(response.message,'Operation Successfull');
	    } else{
	        this.submitPending = false;
	        this.localService.showError(response.message,'Operation Unsuccessfull');
	    }
			}, (error) => {
				this.submitPending = false;
	        	this.localService.showError(error,'Operation Unsuccessfull');
			});
	}
}
