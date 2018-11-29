import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { LocalService, currency } from '../../../storage/index';
import { TableExportService } from '../../../shared/services/index';
import { InvestmentService } from '../../manage-investments/investment.service';
import { ContributionService } from '../../manage-contribution/contribution.service';
import * as moment from 'moment';

@Component({
  selector: 'app-member-investments',
  templateUrl: './member-investments.component.html',
  styleUrls: ['./member-investments.component.scss']
})
export class ManageMemberInvestmentsComponent implements OnInit {

  public investmentFilterForm : FormGroup;
  vendor;
  user;
  investment_plan_list;
  contribution_type_list;
  inv_member_list;
  submitPending;
  investment_history_loader: boolean =false;
  show_pagination_button: boolean = true;
  loader: boolean =false;
  btn_loader: boolean =false;
  toPage
  return_on_investment_list;
  approve_btn_loader : boolean = false;
  investment_history_form_loader: boolean =false;
  
  constructor(
  	private localService : LocalService,
  	private investmentService : InvestmentService,
    private exportService: TableExportService,
      private contributionService : ContributionService,
  	private _fb: FormBuilder,
  	) { 
  	this.vendor = JSON.parse(this.localService.getVendor());
	this.user = JSON.parse(this.localService.getUser());
	this.get_member_investment_plans()
      this.get_investment_plan();
      this.get_contribution_type()
  }

  ngOnInit() {
  	this.investmentFilterForm = this._fb.group({
        from : '',
        to : '',
        status : '',
        investmentplan_id:''
      });
  }

  get_contribution_type()
    {
      this.contributionService.get_contribution_type().subscribe((response) => {
        this.contribution_type_list = response.data;
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

    get_member_investment_plans()
    {
      this.investment_history_loader = true;
      this.investmentService.get_vendor_member_investment_plan().subscribe((response) => {
		this.toPage = response.next_page_url;
        this.inv_member_list = response.data;
        this.investment_history_loader = false;
      })
    }

    filter_member_investment_plan(filterValues)
    {
      this.investment_history_loader = true;
      filterValues['vendor_id'] = parseInt(this.vendor.id);
      this.investmentService.filter_member_investment_plan(filterValues).subscribe((response) => {
        this.inv_member_list = response.data
        this.show_pagination_button = false;
        //this.total_contribution_amount = response.total;
        this.investment_history_loader = false;
      },(error) => {
        this.investment_history_loader = false;
      	this.show_pagination_button = true;
      	this.localService.showError('Server Error', 'Please Contact Admin')
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
    loadMore()
    {
     this.loader = true;
      if(this.toPage){
       this.localService.getPaginateData(this.toPage).subscribe((response) => {
         this.toPage = response.next_page_url;
         this.loader = false;
        for(var i=0; i < response.data.length; i++)
         {
           this.inv_member_list.push(response.data[i])
         }

       })
     }else{
         this.loader = false;
          this.localService.showError('All data have been loaded','Operation Unsuccessfull');
     }
    }


    /*filter interest type from list of interest type*/
    filter_interest_type(id)
    {
      let interest_type = this.localService.interest_type()
      for (var i in interest_type) {
        if(interest_type[i].value == id)
        {
          return interest_type[i].name;
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
    /**
   * @method calculate_inv_plan_balance
   * calculates member_investment_plan balance from last active deductions
   * @var member_investment_plan
   */
  calculate_inv_plan_balance(member_investment_plan)
  {
      if(member_investment_plan.status == 1 || member_investment_plan.status == 3)
      {
        if(member_investment_plan.investment_plan.interest_type == 2)
        {
          if(member_investment_plan.investment_history.length > 0)
          {
            var lastItem = member_investment_plan.investment_history[member_investment_plan.investment_history.length-1];
            let balance = lastItem.current_balance;
            let interest = lastItem.interest_percent;
            let last_date = lastItem.date;
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
                interest_rate = ((interest / 100) / 30).toFixed(4);

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
            return 0;
          }
        }
      } else {

        return 0;
      }
    }

    approve_investment(id, status)
    {
      this.approve_btn_loader = true;
      let data = {
        id: id,
        approved_by: this.user.id,
        user_id: this.user.user_id,
        vendor_id: this.vendor.id,
        status: status,
      }
      
      this.investmentService.approve_investment(data).subscribe((response) => {
        if (response.success) {
            this.approve_btn_loader = false;
			this.get_member_investment_plans();
            this.localService.showSuccess(response.message,'Operation Successfull');
          }else{
            this.approve_btn_loader = false;
            this.localService.showError(response.message,'Operation Unsuccessfull');
          }
        }, (error) => {
            this.approve_btn_loader = false;
            this.investment_history_form_loader = false;
                this.localService.showError(error,'Operation Unsuccessfull');
        });
    }
}
