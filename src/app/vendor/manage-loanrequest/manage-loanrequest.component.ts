import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LocalService } from '../../storage/local.service';
import { LoanRequestService } from './loan-request.service';
import { MembersService } from '../membership/members.service';
import { VendorService } from '../vendor.service';
import { LoanSettingsService } from '../loans/loan-settings/loan-settings.service';
import { TableExportService } from '../../shared/services/index';
import * as moment from 'moment';

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
  user
	public loanRequestList= [] ;
  toPage;
  loader;
  memberData;
  submitPending: boolean;
  paymentOptionCard: boolean;
  paymentOptionAccount: boolean;
  bank_accounts
  cardForm : FormGroup;
  bankAccountForm: FormGroup;
  filterForm: FormGroup;
  loanTypeList;
    public loanRequestForm : FormGroup;
  bank_list;
  editAccountData;
  account;
  vendor_branches;
  @ViewChild('paymentModal') public paymentModal :ModalDirective;
  @ViewChild('accountModal') public accountModal :ModalDirective;
  @ViewChild('accountUpdateModal') public accountUpdateModal :ModalDirective;
  @ViewChild('newLoanRequestModal') public newLoanRequestModal : ModalDirective;

	constructor(
	private localService : LocalService,
	private _fb : FormBuilder,
  private exportService: TableExportService,
  private route: Router,
  private loanrequestService : LoanRequestService,
  private vendor_service : VendorService,
  private loanSettingsService : LoanSettingsService,
  private manageVendorService : VendorService,
	private memberService : MembersService
	) {
	this.vendor = JSON.parse(this.localService.getVendor());
  this.user = JSON.parse(this.localService.getUser());
	this.getLoanRequest();
  this.getAccountNumbers();
  this.get_vendor_branches();
  //this.getBankList()
  this.getLoanType();

		}
	ngOnInit() {
    this.cardForm = this._fb.group({
      name: [null, Validators.compose([Validators.required])],
      number: [null, Validators.compose([Validators.required])],
      cvv: [null, Validators.compose([Validators.required])],
      exp: [null, Validators.compose([Validators.required])]
    })
    /*bank account form*/
        this.bankAccountForm = this._fb.group({
            bank_code: [null, Validators.compose([Validators.required])],
            account_number: [null, Validators.compose([Validators.required])],
            account_name: [null, Validators.compose([Validators.required])],
            description: ''
        });
        /*filter form*/
       this.filterForm = this._fb.group({
        from : '',
        to : '',
        id : '',
        member_id:'',
        loan_request_id: '',
        loan_id:'',
        branch_id:'',
        repayment_method: '',
        status: '',
        approved_by: '',
      })
       this.loanRequestForm =this._fb.group({
        loan_type : [null, Validators.compose([Validators.required])],
        repayment_method : [null, Validators.compose([Validators.required])],
        amount : [null, Validators.compose([Validators.required])],
        description : '',
        //requirements : '',
      });
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
     * @method getLoanType
     * creates a new loan type  resource
     * @return data
     */
    getLoanType()
    {
        this.loanSettingsService.getLoanType().subscribe((response) => {
         
           this.loanTypeList = response.data
       })
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

    count_no_loan_days(start_date)
    {
      if(start_date)
      {
        var a = moment(start_date);
        var b = moment();
        return b.diff(a, 'days')
      }
    }
    
    requestHistory(id)
    {
      this.route.navigate(['app/loan-request/'+id+'/loan-request-history'])
    }
    /*manage payment*/

    loadPaymentModal(data)
    {
      this.memberData = data
      this.paymentModal.show();
    }

    requestUpdateDetails(id)
    {
      this.submitPending = true;
      this.memberService.updateBankAcountRequest(id).subscribe((response) => {
          if(response)
          {
            this.submitPending = false;
            this.localService.showSuccess(response.message,'Operation Successfull');
          }
        });
    }
    GetCardType(number)
    {
        // visa
        var re = new RegExp("^4");
        if (number.match(re) != null)
            return "Visa";

        // Mastercard 
        // Updated for Mastercard 2017 BINs expansion
         if (/^(5[1-5][0-9]{14}|2(22[1-9][0-9]{12}|2[3-9][0-9]{13}|[3-6][0-9]{14}|7[0-1][0-9]{13}|720[0-9]{12}))$/.test(number)) 
            return "Mastercard";

        // AMEX
        re = new RegExp("^3[47]");
        if (number.match(re) != null)
            return "AMEX";

        // Discover
        re = new RegExp("^(6011|622(12[6-9]|1[3-9][0-9]|[2-8][0-9]{2}|9[0-1][0-9]|92[0-5]|64[4-9])|65)");
        if (number.match(re) != null)
            return "Discover";

        // Diners
        re = new RegExp("^36");
        if (number.match(re) != null)
            return "Diners";

        // Diners - Carte Blanche
        re = new RegExp("^30[0-5]");
        if (number.match(re) != null)
            return "Diners - Carte Blanche";

        // JCB
        re = new RegExp("^35(2[89]|[3-8][0-9])");
        if (number.match(re) != null)
            return "JCB";

        // Visa Electron
        re = new RegExp("^(4026|417500|4508|4844|491(3|7))");
        if (number.match(re) != null)
            return "Visa Electron";

        return "";
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
    
     paymentOptions(status)
    {
      console.log(status)
      if(status === 'from_card')
      {
        this.paymentOptionCard = true;
        this.paymentOptionAccount = false;
      }else{
        this.paymentOptionCard = false;
        this.paymentOptionAccount = true;
      }

    }
    getAccountNumbers()
    {
        this.manageVendorService.getBankAccount().subscribe((response) => {
            this.bank_accounts = response.data;
        },(error) => {
            this.localService.showError(error,'Operation Unsuccessfull');
            });
    }

    /*account number*/
    addAccountNumber(data)
    {
        data['vendor_id'] = this.vendor.id;
        data['bank_name'] = this.getBankName(data.bank_code)
        console.log(data)
        this.manageVendorService.addBankAccount(data).subscribe((response) => {
            if(response.success = true)
            {
                this.getAccountNumbers();
                this.submitPending = false;
                this.bankAccountForm.reset()
                this.accountModal.hide()
                this.localService.showSuccess(response.message,'Operation Successfull');
            } else{
                this.submitPending = false;
                this.localService.showError(response.message,'Operation Unsuccessfull');
                }
            }/*,(error) => {
                this.submitPending = false;
                this.localService.showError(error,'Operation Unsuccessfull');
            }*/);
    }

    newAccount()
    {
        this.editAccountData = [];
        this.accountModal.show()
    }

    editAccount(data)
    {
        this.editAccountData = data;
        this.accountUpdateModal.show()
    }

    updateAccountNumber(data)
    {
        data['id'] = this.editAccountData.id;
        data['vendor_id'] = this.vendor.id;
        data['bank_name'] = this.getBankName(data.bank_code)
        console.log(data)
        this.manageVendorService.updateBankAccount(data).subscribe((response) => {
                  if(response.success = true)
                  {
                      this.getAccountNumbers();
                    this.submitPending = false;
                this.accountUpdateModal.hide()
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

    deleteAccount(id)
    {
        this.manageVendorService.deleteBankAccount(id).subscribe((response) => {
            this.localService.showError(response.message,'Operation Unsuccessfull');

        },(error) => {
            this.localService.showError(error,'Operation Unsuccessfull');
            });
    }
    getBankList()
    {
        this.manageVendorService.getBankList().subscribe((response) => {
            let group = [];
            let bank_list = response.data;
            for (var key in bank_list) {
                if (bank_list.hasOwnProperty(key)) {
                    let data = { code: key, name: bank_list[key]}
                 group.push(data)                
                }
            }
            this.bank_list = group;
        },(error) => {
            this.localService.showError(error,'Operation Unsuccessfull');
            });
    }

    getBankName(code)
    {
        for (let i=0; i < this.bank_list.length; i++) {
            if(this.bank_list[i].code === code){
                let name = this.bank_list[i].name;
                return name;

            }
        }
    }
    chooseAccount(data)
    {
      this.account = data;
    }

    payNow()
    {
      console.log(this.account)
    }

     percentage_to_amount(total_amount, percentage)
    {
      let amount = 0
      return amount = parseInt(total_amount) * (parseInt(percentage)/100);
    }
    filterLoanRequest(filterValues)
    {
      this.submitPending = true;
      filterValues['vendor_id'] = parseInt(this.vendor.id);
      this.loanrequestService.filterLoanRequest(filterValues).subscribe((response) => {
        this.loanRequestList = response.data;
        this.submitPending = false;
      })
    }

    /**
     * @method makeLoanRequest
     * make a loan request
     * @return true/false
     */
    makeLoanRequest(data)
    {
      //data['member_id'] = this.memberId
      data['vendor_id'] = JSON.parse(this.localService.getVendor()).id;
      //data['requirements'] = this.files;
      this.loanrequestService.addLoanRequest(data).subscribe((response) => {
        if(response.success)
        {
          this.submitPending = false;
           this.getLoanRequest()
           this.newLoanRequestModal.hide();
           this.loanRequestForm.reset();
          this.localService.showSuccess(response.message,'Operation Successfull');
        }
        else{
          this.submitPending = false;
          this.localService.showError(response.message,'Operation Unsuccessfull');
        }
      }, (error) => {
        this.submitPending = false;
        this.localService.showError(error,'Operation Unsuccessfull');
      });
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
