import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { LocalService, currency } from '../../../storage/index';
import { TableExportService } from '../../../shared/services/index';
import { InvestmentService } from '../../manage-investments/investment.service';
import { ContributionService } from '../../manage-contribution/contribution.service';
import * as moment from 'moment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-investment-history',
  templateUrl: './investment-history.component.html',
  styleUrls: ['./investment-history.component.scss']
})
export class InvestmentHistoryComponent implements OnInit {

  public investmentFilterForm : FormGroup;
  vendor;
  user;
  investment_plan_list;
  contribution_type_list;
  inv_history_list;
  submitPending;
  investment_history_loader: boolean =false;
  loader: boolean =false;
  btn_loader: boolean =false;
  toPage
  
  constructor(
  	private localService : LocalService,
  	private investmentService : InvestmentService,
    private exportService: TableExportService,
      private contributionService : ContributionService,
  	private _fb: FormBuilder,
  	) { 
  	this.vendor = JSON.parse(this.localService.getVendor());
	this.user = JSON.parse(this.localService.getUser());
	this.get_vendor_investment_history()
      this.get_investment_plan();
      this.get_contribution_type()
  }

  ngOnInit() {
  	this.investmentFilterForm = this._fb.group({
        from : '',
        to : '',
        id : '',
        type:'',
        transaction_type:'',
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

    get_vendor_investment_history()
    {
      this.investment_history_loader = true;
      this.investmentService.get_vendor_investment_history().subscribe((response) => {
		this.toPage = response.next_page_url;
        this.inv_history_list = response.data;
        this.investment_history_loader = false;
      })
    }

    filter_investment_history(filterValues)
    {
      this.investment_history_loader = true;
      filterValues['vendor_id'] = parseInt(this.vendor.id);
      this.investmentService.filter_investment_history(filterValues).subscribe((response) => {
        this.inv_history_list = response.data
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
    loadMore()
    {
     this.loader = true;
      if(this.toPage){
       this.localService.getPaginateData(this.toPage).subscribe((response) => {
         this.toPage = response.next_page_url;
         this.loader = false;
        for(var i=0; i < response.data.length; i++)
         {
           this.inv_history_list.push(response.data[i])
         }

       })
     }else{
         this.loader = false;
          this.localService.showError('All data have been loaded','Operation Unsuccessfull');
     }
    }

    calculate_loan_balance(balance, interest, last_date)
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
    }

    post_transaction(transaction_id, status)
    {
      let t_title :string;
      let t_text : string;
      if(status == 1)
      {
        t_title = 'Approve?';
        t_text = "Are You Sure You want to Approve this Transaction?";
      }
      if(status == 2)
      {
        t_title = 'Cancel?';
        t_text = "Are You Sure You want to Cancel this Transaction?";
      }
      Swal.fire({
      title: `${t_title}`,
      text: t_text,
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes!'
      }).then((result) => {
      if (result.value) {
        this.btn_loader = true;
        let data = {
          id: transaction_id,
          approved_by: this.user.id,
          user_id: this.user.user_id,
          vendor_id: this.vendor.id,
          status: status
        }
        
        this.investmentService.post_investment_history(data).subscribe((response) => {
          if (response.success) {
            this.btn_loader = false;
              this.get_vendor_investment_history();
              this.localService.showSuccess(response.message,'Operation Successfull');
            }else{
              this.btn_loader = false;
              this.localService.showError(response.message,'Operation Unsuccessfull');
            }
          }, (error) => {
            this.btn_loader = false;
              this.localService.showError('Please try again later or contact admin','Server Error');
          });
      }
      })
    }
}
