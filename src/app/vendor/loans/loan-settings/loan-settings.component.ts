import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { LocalService } from '../../../storage/local.service';
import { LoanSettingsService } from './loan-settings.service';
import { SettingsService } from '../../settings/settings/settings.service';
import { VendorService } from '../../vendor.service';

@Component({
  selector: 'app-loan-settings',
  templateUrl: './loan-settings.component.html',
  //styleUrls: ['./loan-settings.component.css']
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
export class LoanSettingsComponent implements OnInit {

	public loanSignatoryForm : FormGroup;
	public editloanSignatoryForm : FormGroup;
  public newLoanTypeForm : FormGroup;
	public editLoanTypeForm : FormGroup;
  public loanThresholdForm: FormGroup;
  public eligibilityForm: FormGroup;
  public loanTypeItemForm: FormGroup;
	public loanSignatoryList;
	public loanTypeList;
  interest_type;
  public editLoanSignatoryData;
	public editLoanTypeData;
	public managementStaffList;
  submitPending: boolean;
  loanSignatoryCheck: boolean;
  loanTypeCheck: boolean;
  updateloanSignatoryCheck:boolean;
  public vendor;
  public user;
  public loanThresholdData;
  public loanEligibilityData;
  public eligibilitycheck :boolean;
  public thresholdCheck: boolean;
  updateloanTypeCheck: boolean;
  public settingsList;
  public percentage;
  public loanItemList;
  public loanTypeId;
  total_signatories;
  loanItemButtonName;
  toPage;
  loader;
  total_loan_type;
  addItemCheck: boolean;
  edit_loan_type_approvals;
  vendor_branches;
  @ViewChild('loanSettingsItemModal') public loanSettingsItemModal :ModalDirective;
	@ViewChild('loanSignatoryModal') public loanSignatoryModal :ModalDirective;
  @ViewChild('editLoanSignatoryModal') public editLoanSignatoryModal :ModalDirective;
  @ViewChild('newLoanTypeModal') public newLoanTypeModal :ModalDirective;
	@ViewChild('editLoanTypeModal') public editLoanTypeModal :ModalDirective;

  	constructor(
  		private localService : LocalService,
  		private _fb : FormBuilder,
      private vendor_service : VendorService,
      private loanSettingsService : LoanSettingsService,
  		private settingsService : SettingsService,
  		) {
  			this.getManagementStaff();
        //this.get_vendor_branches();
  			this.getLoanSignatories();
        this.getLoanType();
        this.vendor = JSON.parse(this.localService.getVendor());
        this.user = JSON.parse(this.localService.getUser());
        this.getThreshold();
        this.getEligibility();
        this.getSetings();
        this.interest_type = this.localService.interest_type();
  		}

  	ngOnInit() {
  		/*loan signatory form*/
  		this.loanSignatoryForm = this._fb.group({
  			level:[null, Validators.compose([Validators.required])],
  			staff_id: [null, Validators.compose([Validators.required])]
  		});
  		/*edit signatory form*/
  		this.editloanSignatoryForm = this._fb.group({
  			user_id: [null, Validators.compose([Validators.required])]
  		});
  		/*loan type form*/
  		this.newLoanTypeForm =this._fb.group({
  			loan_type : [null, Validators.compose([Validators.required])],
  			interest : [null, Validators.compose([Validators.required])],
        interest_type : [null, Validators.compose([Validators.required])],
  			//minimum_amount : '',
  			//maximum_amount : '',
  			description : '',
  			requirements : '',
  			duration : [null, Validators.compose([Validators.required])],
        signatory: this._fb.array([])
  		});

      this.editLoanTypeForm =this._fb.group({
        loan_type : [null, Validators.compose([Validators.required])],
        interest : [null, Validators.compose([Validators.required])],
        interest_type : [null, Validators.compose([Validators.required])],
        //minimum_amount : '',
        //maximum_amount : '',
        description : '',
        requirements : '',
        duration : [null, Validators.compose([Validators.required])],
        signatory: this._fb.array([])
      });

      /*laon type item form*/
      this.loanTypeItemForm = this._fb.group({
        id:[null],
        loan_setting_id: [null, Validators.compose([Validators.required])],
        loan_setting_amount: [null, Validators.compose([Validators.required])],
        item_name: [null, Validators.compose([Validators.required])],
        amount: [null, Validators.compose([Validators.required])],
        description: [null]
      })
      /*threshold form*/
      this.loanThresholdForm = this._fb.group({
        threshold_amount: [null, Validators.compose([Validators.required, Validators.minLength(0)])]
      })

      /*eligibility form*/
      this.eligibilityForm = this._fb.group({
        percentage: [null],
        membership_duration: [null],
        max_running_loans: [null]
      });
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
    /**
     * @method createItem
     * create new form group
     * @return true
     */
    create_signatory_fields(data): FormGroup {
      return this._fb.group({
        signatory_id: parseInt(data.id),
        signatory_type:data.signatory_type,
        status: '',
        //id: data.approval_id
      });
  }
    create_edit_signatory_fields(data): FormGroup {
      return this._fb.group({
        signatory_id: parseInt(data.signatory_id),
        signatory_type:data.signatory_type,
        status: data.status,
        id: data.id
      });
    }

  	/**
  	 * @method getManagementStaff
  	 * creates a new staff  resource
  	 * @return data
  	 */
  	getManagementStaff()
  	{
        this.loanSettingsService.getManagementStaff().subscribe((response) => {
         this.managementStaffList = response.data
       })
  	}

    /**
     * @method getManagementStaff
     * creates a new staff  resource
     * @return data
     */
    manageLoanItems(data)
    {
      this.loanTypeId = data.id
        this.loanTypeItemForm = this._fb.group({
          id:[null],
          loan_setting_id: data.id,
          loan_setting_amount: data.maximum_amount,
          item_name: [null, Validators.compose([Validators.required])],
          amount: [null, Validators.compose([Validators.required])],
          description: [null]
        })
        this.loanItemButtonName = 'Create'
        this.getLoanItems(data.id)
    }

    addLoanItemCheck(check, data=null)
    {
      if(check == 'add')
      {
        this.loanItemButtonName = 'Create'
        this.addItemCheck = true;
      }else{
        this.addItemCheck = false;
      }
    }

    editLoanItem(data)
    {
        this.loanItemButtonName = 'Update'
        this.loanTypeItemForm = this._fb.group({
          loan_setting_id: data.loan_setting_id,
          id: data.id,
          item_name: data.item_name,
          amount: data.amount,
          description: data.description
        });
        this.addItemCheck = true;
    }

    updateLoanItem(data)
    {
       this.loanSettingsService.updateLoanItem(data).subscribe((response) => {
         if(response.success)
        {
          this.submitPending = false;
           this.loanTypeItemForm.reset();
           this.getLoanItems(data.loan_setting_id);
          this.addItemCheck = false;
          this.localService.showSuccess(response.message,'Operation Successfull');
        }
        else{
          this.submitPending = false;
          this.localService.showError(response.message,'Operation Unsuccessfull');
        }
       });
    }
    getLoanItems(id)
    {
      this.loanSettingsService.getLoanItem(id).subscribe((response) => {
         this.loanItemList = response
         this.loanSettingsItemModal.show();
       })
    }

    deleteLoanItems(id)
    {
      this.loanSettingsService.deleteLoanItem(id).subscribe((response) => {
        this.localService.showSuccess(response.message,'Operation Successfull');
        this.getLoanItems(this.loanTypeId)
       })
    }
    addModifyLoanItem(data)
    {
      if(!data.id)
      {
        this.addLoanItem(data);
      }else{
        this.updateLoanItem(data);
      }
    }
    /**
     * @method addLoanSignatory
     * creates a new loan signatory  resource
     * @return data
     */
    addLoanItem(data)
    {
      data['user_id'] = this.user.user_id;
      this.submitPending = true;
      this.loanSettingsService.addLoanItem(data).subscribe((response) => {
         if(response.success)
        {
          this.submitPending = false;
           this.loanTypeItemForm.reset();
           this.getLoanItems(data.loan_setting_id);
          this.localService.showSuccess(response.message,'Operation Successfull');
        }
        else{
          this.submitPending = false;
          this.localService.showError(response.message,'Operation Unsuccessfull');
        }
       },(error) => {
          this.submitPending = false;
          this.localService.showError(error,'Operation Unsuccessfull');
       });
    }


    /**
     * @method addLoanSignatory
     * creates a new loan signatory  resource
     * @return data
     */
  	addLoanSignatory(data)
  	{
      this.loanSignatoryForm.updateValueAndValidity();
      if (this.loanSignatoryForm.invalid) {
        Object.keys(this.loanSignatoryForm.controls).forEach(key => {
          this.loanSignatoryForm.get(key).markAsDirty();
        });
        return;
      }
  		this.loanSignatoryCheck = true;
  		data['vendor_id'] = JSON.parse(this.localService.getVendor()).id;
      data['user_id'] = this.user.user_id;
  		this.loanSettingsService.addLoanSignatory(data).subscribe((response) => {
  	 		if(response.success)
  			{
  				this.loanSignatoryCheck = false;
  	 			this.getLoanSignatories()
  	 			this.loanSignatoryModal.hide();
  	 			this.loanSignatoryForm.reset();
  				this.localService.showSuccess(response.message,'Operation Successfull');
  			}
  			else{
  				this.loanSignatoryCheck = false;
  				this.localService.showError(response.message,'Operation Unsuccessfull');
  			}
  	 	},(error) => {
          this.loanSignatoryCheck = false;
          this.localService.showError(error,'Operation Unsuccessfull');
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
         this.total_signatories = response.data.length
        
       })
  	}
	
	/**
  	 * @method editLoanSignatory
  	 * change a signatory  resource
  	 * @return data
  	 */
  	editLoanSignatory(data)
  	{
  		console.log(data)
  		this.editLoanSignatoryData = data;
  		this.editLoanSignatoryModal.show()
  	}

  	/**
  	 * @method updateLoanSignatory
  	 * change a signatory  resource
  	 * @return data
  	 */
  	updateLoanSignatory(data,id)
  	{
  		 this.updateloanSignatoryCheck = true;
	      this.loanSettingsService.updateLoanSignatory(data, id).subscribe((response) => {
	      if(response.success = true)
	      {
	        this.updateloanSignatoryCheck = false;
	         this.getLoanSignatories();
	         this.editLoanSignatoryModal.hide();
	        this.localService.showSuccess(response.message,'Operation Successfull');
	      }
	      else{
	        this.updateloanSignatoryCheck = false;
	        this.localService.showError(response.message,'Operation Unsuccessfull');
	      }
	  },(error) => {
          this.updateloanSignatoryCheck = false;
          this.localService.showError(error,'Operation Unsuccessfull');
       });
  	}
  	/**
  	 * @method deleteLoanSignatories
  	 * creates a new staff  resource
  	 * @return data
  	 */
  	deleteLoanSignatory(id)
  	{
      let data = {
        id : id,
        user_id: this.user.user_id,
        vendor_id: this.vendor.id
        
      } 
        this.loanSettingsService.deleteLoanSignatory(data).subscribe((response) => {
        	this.getLoanSignatories();
			this.localService.showSuccess(response.message,'Operation Successfull');
       })
  	}

    /*manage loan type*/

    /**
     * @method addLoanType
     * creates a new loan type  resource
     * @return data
     */
    addLoanType(data)
    {
      this.loanTypeCheck = true;
      data['vendor_id'] = JSON.parse(this.localService.getVendor()).id;
      data['minimum_amount'] = 0;
      data['maximum_amount'] = 0;
      this.loanSettingsService.addLoanType(data).subscribe((response) => {
         if(response.success)
        {
          this.loanTypeCheck = false;
           this.getLoanType()
           this.newLoanTypeModal.hide();
           this.newLoanTypeForm.reset();
          this.localService.showSuccess(response.message,'Operation Successfull');
        }
        else{
          this.loanTypeCheck = false;
          this.localService.showError(response.message,'Operation Unsuccessfull');
        }
       },(error) => {
          this.loanTypeCheck = false;
          this.localService.showError(error,'Operation Unsuccessfull');
       });
    }

    /**
     * @method getLoanType
     * creates a new loan type  resource
     * @return data
     */
    getLoanType()
    {
        this.loanSettingsService.getLoanType().subscribe((response) => {
         
           this.loanTypeList = response.data
           this.total_loan_type = response.data.length;
       })
    }
  
    loadMore()
    {
     this.loader = true;
      if(this.toPage){
       this.localService.getPaginateData(this.toPage).subscribe((response) => {
         this.toPage = response.data.next_page_url;
         this.loanTypeList = response.data.data;
         this.loader = false;
        /*for(var i=0; i < response.data.data.length; i++)
         {
           this.loanTypeList.push(response.data.data[i])
         }*/

       })
     }else{
         this.loader = false;
          this.localService.showError('All data have been loaded','Operation Unsuccessfull');
     }
    }

    show_newLoanTypeModal()
    {
      this.newLoanTypeModal.show()
      this.newLoanTypeForm =this._fb.group({
        loan_type : [null, Validators.compose([Validators.required])],
        interest : [null, Validators.compose([Validators.required])],
        interest_type : [null, Validators.compose([Validators.required])],
        //minimum_amount : '',
        //maximum_amount : '',
        description : '',
        requirements : '',
        duration : [null, Validators.compose([Validators.required])],
        signatory: this._fb.array([])
      });
      this.loanSignatoryList.forEach((list)=> 
            (<FormArray>this.newLoanTypeForm.controls['signatory']).push(this.create_signatory_fields(list))
          );
    }
  /**
     * @method editLoanType
     * change a loan type resource
     * @return data
     */
    editLoanType(data)
    {
      this.editLoanTypeForm =this._fb.group({
        loan_type : [null, Validators.compose([Validators.required])],
        interest : [null, Validators.compose([Validators.required])],
        interest_type : [null, Validators.compose([Validators.required])],
        //minimum_amount : '',
        //maximum_amount : '',
        description : '',
        requirements : '',
        duration : [null, Validators.compose([Validators.required])],
        signatory: this._fb.array([])
      });
      this.editLoanTypeData = data;
      this.edit_loan_type_approvals = data.approvals;
      console.log(data.approvals)
      this.edit_loan_type_approvals.forEach((list)=> 
            (<FormArray>this.editLoanTypeForm.controls['signatory']).push(this.create_edit_signatory_fields(list))
          );
      this.editLoanTypeModal.show()
    }

    /**
     * @method updateLoanType
     * change a loan type resource
     * @return data
     */
    updateLoanType(data,id)
    {
       this.updateloanTypeCheck = true;
       data['vendor_id'] = JSON.parse(this.localService.getVendor()).id;
       data['minimum_amount'] = 0;
       data['maximum_amount'] = 0;
        this.loanSettingsService.updateLoanType(data, id).subscribe((response) => {
        if(response.success = true)
        {
          this.updateloanTypeCheck = false;
           this.getLoanType();
           this.editLoanTypeModal.hide();
          this.localService.showSuccess(response.message,'Operation Successfull');
        }
        else{
          this.updateloanTypeCheck = false;
          this.localService.showError(response.message,'Operation Unsuccessfull');
        }
    },(error) => {
          this.updateloanTypeCheck = false;
          this.localService.showError(error,'Operation Unsuccessfull');
       });
    }
    /**
     * @method deleteLoanType
     * delete aloan type  resource
     * @return data
     */
    deleteLoanType(id)
    {
        this.loanSettingsService.deleteLoanType(id).subscribe((response) => {
          this.getLoanType();
      this.localService.showSuccess(response.message,'Operation Successfull');
       })
    }

    /*threshold method*/
    /**
     * @method updateThreshold
     * update threshold amount
     * @return data
     */
    updateThreshold(data)
    {
      console.log(data)
      data['vendor_id'] = JSON.parse(this.localService.getVendor()).id;
       this.loanSettingsService.updateThreshold(data).subscribe((response) => {
          if(response.success = true)
          {
            this.submitPending = false;
             this.getThreshold();
             this.editLoanTypeModal.hide();
            this.localService.showSuccess(response.message,'Operation Successfull');
          }
          else{
            this.submitPending = false;
            this.localService.showError(response.message,'Operation Unsuccessfull');
          }
      },(error) => {
          this.submitPending = false;
          this.localService.showError(error,'Operation Unsuccessfull');
       });
    }

    /**
     * @method getThreshold
     * get threshold amount
     * @return data
     */
    getThreshold()
    {
      
      this.loanSettingsService.getThreshold().subscribe((response) => {
         if(response.success == true)
          {
            this.thresholdCheck = true;
            this.loanThresholdData = response.data;
          }else{
            this.thresholdCheck = false;
            //this.localService.showError(response.message,'Operation Unsuccessfull');
          }
      })
    }
    
    /*eligibility seetings method*/
    /**
     * @method updateEligibility
     * update eligibility settings
     * @return data
     */
    updateEligibility(data)
    {
      data['vendor_id'] = JSON.parse(this.localService.getVendor()).id;
       this.loanSettingsService.updateEligibility(data).subscribe((response) => {
          if(response.success = true)
          {
            this.submitPending = false;
             this.getThreshold();
             this.editLoanTypeModal.hide();
            this.localService.showSuccess(response.message,'Operation Successfull');
          }
          else{
            this.submitPending = false;
            this.localService.showError(response.message,'Operation Unsuccessfull');
          }
      },(error) => {
          this.submitPending = false;
          this.localService.showError(error,'Operation Unsuccessfull');
       });
    }

    /**
     * @method getEligibilitysettings
     * get eligibility settings
     * @return data
     */
    getEligibility()
    {
      
      this.loanSettingsService.getEligibility().subscribe((response) => {
        if(response.success == true)
          {
            this.eligibilitycheck = true;
            this.loanEligibilityData = response.data 
            //this.percentage = this.loanEligibilityData.percentage
            console.log(this.loanEligibilityData)
          }else{
            this.eligibilitycheck = false;
            //this.localService.showError(response.message,'Operation Unsuccessfull');
          }
          
      },(error) => {
          this.submitPending = false;
          this.localService.showError(error,'Operation Unsuccessfull');
       })
    }

    /*settings*/
    /**
     * @method getSettings
     * get eligibility settings
     * @return data
     */
    getSetings()
    {
      
      this.loanSettingsService.getSettings().subscribe((response) => {
        this.settingsList = response.data;
      })
    }

     /**
     * @method updateSettings
     * update settings resource
     * @return data
     */
    updateSettings(status, id)
    {
      console.log(status)
        let data = {
          id: id,
          status: status,
          vendor_id: this.vendor.id
        }
        this.settingsService.updateSettings(data).subscribe((response) => {
          if(response.success = true)
          {
            this.submitPending = false;
            this.localService.showSuccess(response.message,'Operation Successfull');
            window.location.reload()
          }
          else{
            this.submitPending = false;
            this.localService.showError(response.message,'Operation Unsuccessfull');
        }
        },(error) => {
          this.submitPending = false;
          this.localService.showError(error,'Operation Unsuccessfull');
       });
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
