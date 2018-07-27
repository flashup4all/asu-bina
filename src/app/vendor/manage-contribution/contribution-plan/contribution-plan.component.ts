import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { ContributionService } from '../contribution.service';
import { LocalService, currency } from '../../../storage/index';
import { TableExportService } from '../../../shared/services/index';

@Component({
  selector: 'app-contribution-plan',
  templateUrl: './contribution-plan.component.html',
  styleUrls: ['./contribution-plan.component.scss']
})
export class ContributionPlanComponent implements OnInit {
	
	public contribution_plan_form : FormGroup
  submitPending: boolean = false;
	form_loader: boolean = false;
	vendor;
	user;
	editData;
	contribution_plan_list:any;
  vendor_curency;
  currencies = currency;
	button;
  duration_list;
  min_amount_check: boolean = false;
  max_amount_check: boolean = false;
  min_amount_label;
  max_amount_label;
  amount_type_list
  	@ViewChild('newContributionPlanModal') public newContributionPlanModal : ModalDirective;
  	@ViewChild('editContributionPlanModal') public editContributionPlanModal : ModalDirective;
  	constructor(
		private localService : LocalService,
  		private contributionService : ContributionService,
      private exportService: TableExportService,
  		private _fb: FormBuilder,
  		) { 
  		this.get_contribution_plan();
  		this.vendor = JSON.parse(this.localService.getVendor());
		  this.user = JSON.parse(this.localService.getUser());
      this.filter_curency(this.vendor.currency_code)
       this.amount_type_list = this.localService.amount_type();
      this.duration_list = this.localService.duration();
  	}

  	ngOnInit() {
  		this.contribution_plan_form = this._fb.group({
  			name: [null, Validators.compose([Validators.required])],
  			description: '',
        terms_conditions:'',
        min_amount: '',
        max_amount: '',
        amount_type : [null, Validators.compose([Validators.required])],
        duration : [null, Validators.compose([Validators.required])],
        interest : [null, Validators.compose([Validators.required])],
        interest_duration : [null, Validators.compose([Validators.required])],
        withdrawal_limit : [null, Validators.compose([Validators.required])],
        withdrawal_permit : [null, Validators.compose([Validators.required])],
        contribution_type : [null, Validators.compose([Validators.required])],
        status : [null, Validators.compose([Validators.required])],
  		})
  	}

  	new_plan()
  	{
      this.form_loader = false;
  		//this.editData = null;
  		this.button = 'New';
      this.contribution_plan_form.reset()
  		this.newContributionPlanModal.show()
  	}

  	edit(data)
  	{
      this.form_loader = false;
  		this.editData = data; 
  		this.button = 'Update';
  		this.newContributionPlanModal.show()
  	}
  	save_contribution_plan(formValues)
  	{
      this.contribution_plan_form.updateValueAndValidity();
      if (this.contribution_plan_form.invalid) {
        Object.keys(this.contribution_plan_form.controls).forEach(key => {
          this.contribution_plan_form.get(key).markAsDirty();
        });
        return;
      }
      
      if(formValues.amount_type === 'fixed')
      {
        this.min_amount_label = " Fixed Amount";
        this.min_amount_check = true;
        formValues.max_amount = 0;

      }else if(formValues.amount_type === 'any'){
        this.min_amount_check = false;
        this.max_amount_check = false;
        formValues.min_amount = 0;
        formValues.max_amount = 0;
      }

  		this.form_loader = true;
  		if(this.editData == null)
  		{
        this.new_contribution_plan(formValues)
  		} else{
        this.update_contribution_plan(formValues, this.editData.id)
      }
  		
  	}

    amount_type_setting(amount_type)
    {
      if(amount_type === 'fixed')
      {
        this.min_amount_label = " Fixed Amount";
        this.min_amount_check = true;
        this.max_amount_check = false;
        //this.editData.max_amount = 0;

      }else if(amount_type === 'range')
      {
        this.min_amount_label = " Mininum Amount";
        this.max_amount_label = " Maximum Amount";
        this.min_amount_check = true;
        this.max_amount_check = true;
      } else{
        this.min_amount_check = false;
        this.max_amount_check = false;
        
      }
    }

    new_contribution_plan(data)
    {
      data['vendor_id'] = this.vendor.id;
      data['created_by'] = this.user.id;
      this.contributionService.addContributionPlan(data).subscribe((response) => {
        if(response.success)
        {
          this.form_loader = false;
          this.get_contribution_plan()
          this.contribution_plan_form.reset()
          this.newContributionPlanModal.hide();
              this.localService.showSuccess(response.message,'Operation Successfull');
        }else{
          this.form_loader = false;
              this.localService.showError(response.message,'Operation Successfull');
              this.localService.showError(response,'Operation Successfull');
        }
      }, (error) => {
        this.form_loader = false;
         this.localService.showError('Server Error!', 'Server Error Ply try again later or contact administrator');
      })
    }


    update_contribution_plan(data, id)
    {
      data['vendor_id'] = this.vendor.id;
      data['created_by'] = this.user.id;
      this.contributionService.update_contribution_plan(data, id).subscribe((response) => {
        if(response.success)
        {
          this.form_loader = false;
          this.get_contribution_plan()
          //this.contribution_plan_form.reset()
          this.newContributionPlanModal.hide();
              this.localService.showSuccess(response.message,'Operation Successfull');
        }else{
          this.form_loader = false;
              this.localService.showError(response.message,'Operation Successfull');
              this.localService.showError(response,'Operation Successfull');
        }
      }, (error) => {
        this.form_loader = false;
         this.localService.showError('Server Error!', 'Server Error Ply try again later or contact administrator');
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

  	delete(id)
  	{
  		this.contributionService.delete_contribution_plan(id).subscribe((response) => {
  			this.get_contribution_plan()
          	this.localService.showSuccess('Operation Successful','Operation Successfull');
  		})
  	}
    filter_curency(code)
    {
      for (var i in this.currencies) {
        if(this.currencies[i].code == code)
        {
          return this.vendor_curency = this.currencies[i].symbol;
        }
      }
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
}
