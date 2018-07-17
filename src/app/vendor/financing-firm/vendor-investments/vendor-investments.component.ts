import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { LocalService, currency } from '../../../storage/index';
import { TableExportService } from '../../../shared/services/index';
import { InvestmentService } from '../../manage-investments/investment.service';
import { ContributionService } from '../../manage-contribution/contribution.service';
//import { ViewMemberComponent } from '../view-member/view-member.component';
import * as moment from 'moment';
@Component({
  selector: 'app-vendor-investments',
  templateUrl: './vendor-investments.component.html'
})
export class VendorInvestmentsComponent implements OnInit {

  public investment_application_form : FormGroup;
  public investmentHistoryForm : FormGroup;
  public investmentFilterForm : FormGroup;
  submitPending: boolean = false;
  investment_details_loader: boolean = false;
	form_loader: boolean = false;
  investment_history_form_loader: boolean =false;
  investment_history_loader: boolean =false;
	vendor;
	user;
	editData;
	member_plan_list:any;
  investment_plan_list;
  contribution_type_list;
  member_inv_history_list;
	vendor_curency;
	button;
  duration_list;
  amount_type_list
  return_on_investment_list;
  rot_value;
  accept_terms;
  rot_error_message;
  currencies = currency;
  min_amount_check: boolean = false;
  max_amount_check: boolean = false;
  min_amount_label;
  max_amount_label;
  member_id;
  investment_plan_min_amt_error_msg;
  errorMessage;

    @ViewChild('newInvestmentPlanModal') public newInvestmentPlanModal : ModalDirective;
  	@ViewChild('newInvestmentHistoryModal') public newInvestmentHistoryModal : ModalDirective;
  	constructor(
		private localService : LocalService,
  		private investmentService : InvestmentService,
      private exportService: TableExportService,
  		private _fb: FormBuilder,
      private contributionService : ContributionService,
      //private view_member_component: ViewMemberComponent
  		) { 
  		  this.vendor = JSON.parse(this.localService.getVendor());
		    this.user = JSON.parse(this.localService.getUser());
  		  this.filter_curency(this.vendor.currency_code)
      	this.duration_list = this.localService.duration();
      	this.amount_type_list = this.localService.amount_type();
        this.return_on_investment_list = this.localService.return_on_investment_type()
        //this.member_id = this.view_member_component.memberId;
        this.refresh()

  	}

  	ngOnInit() {

      this.investment_application_form = this._fb.group({
        accept_terms : [null, Validators.compose([Validators.required])],
        roi_value: [null, Validators.compose([Validators.required])],
      });
      this.investmentHistoryForm = this._fb.group({
        //period : [null, Validators.compose([Validators.required])],
        type : [null, Validators.compose([Validators.required])],
        //date : [null, Validators.compose([Validators.required])],
        amount: [null, Validators.compose([Validators.required])],
        investmentplan_id: [null, Validators.compose([Validators.required])],
      });

      this.investmentFilterForm = this._fb.group({
        from : '',
        to : '',
        id : '',
        type:'',
        investmentplan_id:''
      });
  	}

    refresh()
    {
      this.submitPending = true;
      this.get_member_investment_plan()
      this.get_investment_plan();
      this.get_member_investment_history();
      this.get_contribution_type()
      this.submitPending = false;
    }
    get_contribution_type()
    {
      this.contributionService.get_contribution_type().subscribe((response) => {
        this.contribution_type_list = response.data;
      })
    }
    

  	get_member_investment_plan()
  	{
      this.submitPending = true;
  		this.investmentService.get_member_investment_plan(this.member_id).subscribe((response) => {
  			this.member_plan_list = response.data;
        this.submitPending = false;
  		})
  	}

    get_investment_plan()
    {
      this.submitPending = true;
      this.investmentService.get_investment_plan().subscribe((response) => {
        this.investment_plan_list = response;
        this.submitPending = false;
      })
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

  	filter_curency(code)
  	{
  		for (var i in this.currencies) {
  			if(this.currencies[i].code == code)
  			{
  				return this.vendor_curency = this.currencies[i].symbol;
  			}
  		}
  	}

    return_roi(value)
    {
      for (var i in this.return_on_investment_list) {
        if(this.return_on_investment_list[i].value == value)
        {
          return this.return_on_investment_list[i].name
        }
      }
    }
    rot_check(event)
    {
      for (var i in this.return_on_investment_list) {
        if(this.return_on_investment_list[i].value == event)
        {
          this.rot_value = this.return_on_investment_list[i]
        }
      }
    }
    apply_investment(form_values,investment)
    {
      this.investment_application_form.updateValueAndValidity();
    if (this.investment_application_form.invalid) {
      Object.keys(this.investment_application_form.controls).forEach(key => {
        this.investment_application_form.get(key).markAsDirty();
      });
      return;
    }
      for (var i in this.member_plan_list) {
        if(this.member_plan_list[i].investmentplan_id == investment.id)
        {
          this.errorMessage = 'This member already have this plan active as part of his investment';
          return this.localService.showError('This member already have this plan active as part of his investment','Operation Successfull');
        }
      }
      let data = {
        member_id: this.member_id,
        investmentplan_id: investment.id,
        vendor_id: this.vendor.id,
        staff_id: this.user.id,
        roi_value:form_values.roi_value
      }
      this.form_loader = true;
      this.investmentService.create_member_investment_plan(data).subscribe((response) => {
        if(response.success)
        {
          this.form_loader = false;
          this.get_member_investment_plan()
          this.newInvestmentPlanModal.hide();
          this.localService.showSuccess(response.message,'Operation Successfull');
        }else{
          this.form_loader = false;
              this.localService.showError(response.message,'Operation Successfull');
              this.localService.showError(response,'Operation Successfull');
        }
      }, (error)=> {
          this.form_loader = false;
        this.localService.showError(error,'!Oops Operation UnSuccessfull');
      })
    }

    approve_investment(id, status)
    {
      let data = {
        id: id,
        approved_by: this.user.id,
        vendor_id: this.vendor.id,
        status: status,
      }
      
      this.investmentService.approve_investment(data).subscribe((response) => {
        if (response.success) {
            this.get_member_investment_plan();
            this.localService.showSuccess(response.message,'Operation Successfull');
          }else{
            this.localService.showError(response.message,'Operation Unsuccessfull');
          }
        }, (error) => {
          this.investment_history_form_loader = false;
                this.localService.showError(error,'Operation Unsuccessfull');
        });
    }

    filter_investment_history(filterValues)
    {
      this.investment_history_loader = true;
      filterValues['vendor_id'] = parseInt(this.vendor.id);
      filterValues['member_id'] = parseInt(this.member_id);
      this.investmentService.filter_investment_history(filterValues).subscribe((response) => {
        this.member_inv_history_list = response.data
        //this.total_contribution_amount = response.total;
        this.investment_history_loader = false;
      })
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

    new_inv_history_modal()
    {
      this.investment_history_form_loader = false;
      this.newInvestmentHistoryModal.show();
    }
    saveInvestmentHistory(formValues)
    {
      this.investmentHistoryForm.updateValueAndValidity();
      if (this.investmentHistoryForm.invalid) {
        Object.keys(this.investmentHistoryForm.controls).forEach(key => {
          this.investmentHistoryForm.get(key).markAsDirty();
        });
        return;
      }

      /*if(this.investments_plan_min_amount(formValues.investmentplan_id) > formValues.amount)
      {
        return this.investment_plan_min_amt_error_msg = "Minimum Amount for this Investment Plan is "+this.investments_plan_min_amount(formValues.investmentplan_id)
      }*/
      formValues.member_id = this.member_id;
      formValues.staff_id = this.user.id;
      formValues.vendor_id = this.vendor.id;
      formValues.transaction_type = 'credit';
      formValues.status = 0;
        this.investment_history_form_loader = true;
        this.investmentService.create_investment_history(formValues).subscribe((response) => {
          if (response.success) {
            this.investment_history_form_loader = false;
            this.get_member_investment_history();
            this.investmentHistoryForm.reset()
            this.newInvestmentHistoryModal.hide();
            this.localService.showSuccess(response.message,'Operation Successfull');
          }else{
            this.localService.showError(response.message,'Operation Unsuccessfull');
          }
        }, (error) => {
          this.investment_history_form_loader = false;
                this.localService.showError(error,'Operation Unsuccessfull');
        });
    }

    get_member_investment_history()
    {
      this.investment_history_loader = true;
      this.investmentService.get_member_investment_history(this.member_id).subscribe((response) => {
        this.member_inv_history_list = response.data;
        this.investment_history_loader = false;
      })
    }

    investments_plan_min_amount(investmentplan_id)
    {
      for (var i in this.member_plan_list) {
        if(this.member_plan_list[i].id == investmentplan_id)
        {
          return this.member_plan_list[i].min_amount;
        }
        // code...
      }
    }
    post_transaction(transaction_id)
    {
      let data = {
        id: transaction_id,
        approved_by: this.user.id,
        vendor_id: this.vendor.id,
        status: 1
      }
      
      this.investmentService.post_investment_history(data).subscribe((response) => {
        if (response.success) {
            this.get_member_investment_history();
            this.localService.showSuccess(response.message,'Operation Successfull');
          }else{
            this.localService.showError(response.message,'Operation Unsuccessfull');
          }
        }, (error) => {
          this.investment_history_form_loader = false;
                this.localService.showError(error,'Operation Unsuccessfull');
        });
    }
}