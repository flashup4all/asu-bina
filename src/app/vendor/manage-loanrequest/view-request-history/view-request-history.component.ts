import { Component, OnInit, ElementRef, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LocalService } from '../../../storage/local.service';
import { LoanRequestService } from '../loan-request.service';
import { LoanSettingsService } from '../../loans/loan-settings/loan-settings.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-view-request-history',
  templateUrl: './view-request-history.component.html',
  styleUrls: ['./view-request-history.component.css']
})
export class ViewRequestHistoryComponent implements OnInit {

	public loan_request_id;
	public vendor;
	public user;
	public loanRequest;
	loan_files_url;
	member_image_url;
	loanSignatoryList;
	@Input() multiple: boolean = false;
	uploader_check: boolean = false;
	filesToUpload: Array<File> = [];
  	constructor(
  		private localService : LocalService,
		private _fb : FormBuilder,
  		private el: ElementRef,
      private router: ActivatedRoute,
  		private route: Router,
      	private loanSettingsService : LoanSettingsService,
		private loanrequestService : LoanRequestService
	) { 
		this.vendor = JSON.parse(this.localService.getVendor());
		this.user = JSON.parse(this.localService.getUser());
  		this.loan_request_id = this.router.snapshot.params['loan-request-id']
  		this.getLoanSignatories();
  		this.getLoanRequest();
        this.member_image_url = environment.api.imageUrl+'profile/member/';
        this.loan_files_url = environment.api.imageUrl+'requirements/';

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

	/**
  	 * @method getLoanSignatories
  	 * creates a new staff  resource
  	 * @return data
  	 */
  	getLoanSignatories()
  	{
        this.loanSettingsService.getLoanSignatory().subscribe((response) => {
         this.loanSignatoryList = response.data
         //console.log(this.loanSignatoryList)
         //this.total_signatories = response.data.length
        
       })
  	}
	/**
     * @method approveLoanRequest
     * cancel loan request
     * @return data
     */
    approveLoanRequest(item)
    {
    	let data = {
    		id: item.id,
    		loan_request_id: item.loan_request_id,
    		signatory_type: item.signatory_type,
    		approved_by: this.user.id,
    		vendor_id: this.vendor.id
    	}
      this.loanrequestService.approveLoanRequest(data).subscribe((response) => {
        this.getLoanRequest();
      	this.localService.showSuccess(response.message,'Operation Successfull');
      });
    }

    /**
     * @method cancelLoanRequest
     * cancel loan request
     * @return data
     */
    cancelLoanRequest(item)
    {
    	let data = {
    		id: item.id,
    		loan_request_id: item.loan_request_id,
    		signatory_type: item.signatory_type,
    		approved_by: this.user.id,
    		vendor_id: this.vendor.id
    	}
      this.loanrequestService.cancelLoanRequest(data).subscribe((response) => {
        if(response.success)
        {
        	this.getLoanRequest();
      		this.localService.showSuccess(response.message,'Operation Successfull');
        }else{
      		this.localService.showError(response.message,'Operation Successfull');
        }
      }, (error)=> {
      	this.localService.showSuccess('Error Please contact admin','Operation UnSuccessfull');
      });
    }
    check_approval_staff(type){
    	// return this.localService.check_approval_staff(this.loanSignatoryList, this.user.id, type)

    	for (var i in this.loanSignatoryList) {
        if(this.loanSignatoryList[i].staff_id == this.user.id){
          console.log('true')
          return true;
        }else{
          console.log('false')
          return false;
        }
      }
    }
   /* 
    upload() {
        let inputEl = this.el.nativeElement.firstElementChild;
        if (inputEl.files.length == 0) return;

        let files :FileList = inputEl.files;
        const formData = new FormData();
        for(var i = 0; i < files.length; i++){
            formData.append(files[i].name, files[i]);
        }

        // this.http
        //     .post('/api/test/fileupload', formData)
        //     .subscribe();
        this.loanrequestService.upload_loan_request_requirements(formData).subscribe((response) => {
        if(response.success)
        {
        	//this.getLoanRequest();
      		this.localService.showSuccess(response.message,'Operation Successfull');
        }else{
      		this.localService.showError(response.message,'Operation Successfull');
        }
      }, (error)=> {
      	this.localService.showSuccess('Error Please contact admin','Operation UnSuccessfull');
      });

    }*/
    upload() {
	    const formData: any = new FormData();
	    const files: Array<File> = this.filesToUpload;
	    console.log(files);

	    for(let i =0; i < files.length; i++){
	        formData.append("uploads[]", files[i], files[i]['name']);
	    }
	    this.uploader_check = true;
	    this.loanrequestService.upload_loan_request_requirements(formData, this.loan_request_id).subscribe((response) => {
	        if(response.success)
	        {
	        	this.getLoanRequest();
	    	this.uploader_check = false;
	      	this.localService.showSuccess(response.message,'Operation Successfull');
	        }else{
	    	this.uploader_check = false;
	      		this.localService.showError(response.message,'Operation Successfull');
	        }
	      }, (error)=> {
	    	this.uploader_check = false;
	      	this.localService.showError('Error Please contact admin','Operation UnSuccessfull');
	    });
	    
	}

	fileChangeEvent(fileInput: any) {
	    this.filesToUpload = <Array<File>>fileInput.target.files;
	    //this.product.photo = fileInput.target.files[0]['name'];
	}

	delete_loan_request_requirement(id)
    {
      this.loanrequestService.delete_loan_request_requirement(id).subscribe((response) => {
        if(response.success)
        {
        	this.getLoanRequest();
      		this.localService.showSuccess(response.message,'Operation Successfull');
        }else{
      		this.localService.showError(response.message,'Operation Successfull');
        }
      }, (error)=> {
      	this.localService.showError('Error Please contact admin','Operation UnSuccessfull');
      });
    }
    manage_member(id)
    {
      this.route.navigate(['app/members/'+id+'/view']);
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
}
