import { Component, OnInit, ElementRef, Input, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LocalService } from '../../../storage/local.service';
import { LoanRequestService } from '../loan-request.service';
import { LoanSettingsService } from '../../loans/loan-settings/loan-settings.service';
import { DeductionsService } from '../../manage-deductions/deductions.service';
import { MembersService } from '../../membership/members.service';
import { environment } from '../../../../environments/environment';
import * as moment from 'moment';

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
  approve_loan_request_form : FormGroup;
  public addDeductionForm : FormGroup;
	loan_files_url;
	member_image_url;
	loanSignatoryList;
	@Input() multiple: boolean = false;
	uploader_check: boolean = false;
	filesToUpload: Array<File> = [];
  submitPending: boolean = false;
  approve_btn_loader: boolean = false;
  approvals_loader : boolean = false;
  history_loader : boolean = false;
  approval_data;
  memberLoanDeductionsList;
  deduction_type_list;
  monthList;
  current_year = moment().format('YYYY');
  @ViewChild('approve_loan_request_modal') public approve_loan_request_modal :ModalDirective;
  @ViewChild('newRepaymentModal') public newRepaymentModal : ModalDirective;

  	constructor(
  		private localService : LocalService,
		  private _fb : FormBuilder,
  		private el: ElementRef,
      private router: ActivatedRoute,
  		private route: Router,
      private loanSettingsService : LoanSettingsService,
      private deductionService : DeductionsService,
      private memberService : MembersService,
		  private loanrequestService : LoanRequestService
	) { 
		this.vendor = JSON.parse(this.localService.getVendor());
		this.user = JSON.parse(this.localService.getUser());
  		this.loan_request_id = this.router.snapshot.params['loan-request-id']
  		this.getLoanSignatories(this.loan_request_id);
  		this.getLoanRequest();
      this.get_deduction_type()
      this.monthList = this.localService.yearjson();
      this.member_image_url = environment.api.imageUrl+'profile/member/';
      this.loan_files_url = environment.api.imageUrl+'requirements/';

	}

  	ngOnInit() {
      this.approve_loan_request_form = this._fb.group({
        start_date: [null, Validators.compose([Validators.required])],
        //comment: '',
      })

      this.addDeductionForm = this._fb.group({
        period : [null, Validators.compose([Validators.required])],
        repayment_method : [null, Validators.compose([Validators.required])],
        run_date : [null, Validators.compose([Validators.required])],
        repayment_amount: '',
        depositor: '',
        description: '',
      });
  	}
  	/**
	 * @method getLoanRequest
	 * get vendor loan request
	 * @return data
	 */
	getLoanRequest()
	{
    this.history_loader = true;
		this.loanrequestService.getSingleLoanRequest(this.loan_request_id).subscribe((response) => {
      this.history_loader = false;
			this.loanRequest = response
		});
	}

	/**
  	 * @method getLoanSignatories
  	 * creates a new staff  resource
  	 * @return data
  	 */
  	getLoanSignatories(id)
  	{
      this.approvals_loader = true;
        this.loanrequestService.getLoanRequestApprovals(id).subscribe((response) => {
      this.approvals_loader = false;
         this.loanSignatoryList = response.data
         //console.log(this.loanSignatoryList)
         //this.total_signatories = response.data.length
        
       })
  	}
	/**
     * @method show_sapprove_loan_request_form
     * cancel lhoan request
     * @return data
     */
    show_approve_loan_request_form(item)
    {
      this.approval_data = item;
      this.approve_loan_request_modal.show()
    }

    /**
     * @method approve_loan_request
     * cancel loan request
     * @return data
     */
    approve_loan_request(form_values)
    {
      let data = {
        id: this.approval_data.id,
        loan_request_id: this.approval_data.loan_request_id,
        signatory_type: this.approval_data.signatory_type,
        approved_by: this.user.id,
        vendor_id: this.vendor.id,
        start_date: form_values.start_date,
        //comment: form_values.comment
      }
      this.loanrequestService.approveLoanRequest(data).subscribe((response) => {
        if(response.success)
        {
          this.getLoanRequest();
          this.approve_loan_request_modal.hide()
          this.approval_data = null;
          this.localService.showSuccess(response.message,'Operation Successfull');
        }else{
          this.localService.showError(response.message,'Operation Unsuccessfull');
        }
      }, (error) => {
        this.localService.showError('Please try again later or contact admin','Server Error!!');
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

    get_deduction_type()
    {
      this.deductionService.get_repayment_type().subscribe((response) => {
        this.deduction_type_list = response.data;
      })
    }
    make_a_repayment(formValues)
    {
      formValues['vendor_id'] = this.vendor.id
      formValues['staff_id'] = this.user.id
      formValues['loan_request_id'] = this.loanRequest.id
      formValues['user_id'] = this.user.user_id
      this.submitPending = true;
      this.deductionService.repayment(formValues).subscribe((response) => {
        if (response.success) {
          this.submitPending = false;
          //this.member_loan_request_component.getMemberLoanRequest();
          this.getMemberLoanDeductions();
          this.newRepaymentModal.hide();
          this.addDeductionForm.reset()
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

  /**
     * @method getMemberLoanDeductions
     * get member loan deductions resource
     * @return data
     */
    getMemberLoanDeductions()
    {
      this.memberService.getMemberDeductions(this.loanRequest.member_id).subscribe((response) => {
        this.loanRequest['deductions_per_loan'] = response.data.data;
        // this.memberLoanDeductionsList = response.data.data
      })
    }
  post_repayment(id, status)
    {
      let data = {
        id: id,
        status: status,
        approved_by : this.user.id,
        vendor_id: this.vendor.id,
        user_id: this.user.user_id
      };
      this.approve_btn_loader = true;
      this.deductionService.post_repayment(data).subscribe((response) => {
        if (response.success) {
          this.approve_btn_loader = false;
          //this.member_loan_request_component.getMemberLoanRequest();
          this.getMemberLoanDeductions();
          this.localService.showSuccess(response.message,'Operation Successfull');
        }else{
          this.approve_btn_loader = false;
                this.localService.showError(response.message,'Operation Unsuccessfull');
        }
      }, (error) => {
        this.approve_btn_loader = false;
              this.localService.showError(error,'Operation Unsuccessfull');
      });
    }
}
