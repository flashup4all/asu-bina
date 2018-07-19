import { Component, OnInit } from '@angular/core';

import { ModalDirective } from 'ngx-bootstrap/modal';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LocalService } from '../../storage/local.service';
import { WidthdrawalsService } from './widthdrawals.service';
import { TableExportService } from '../../shared/services/index';

@Component({
  selector: 'app-manage-widthdrawals',
  templateUrl: './manage-widthdrawals.component.html',
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
export class ManageWidthdrawalsComponent implements OnInit {

	public vendor;
	user;
	public widthdrawalsList = [];
	toPage;
  	loader;
	constructor(
		private localService : LocalService,
      	private exportService: TableExportService,
  		private _fb : FormBuilder,
  		private widthdrawalService : WidthdrawalsService
  		) {
		this.vendor = JSON.parse(this.localService.getVendor());
        this.user = JSON.parse(this.localService.getUser());
		this.getWidthdrawals();
  		}

	ngOnInit() {
	}

	/**
	 * @method getWidthdrawals
	 * get member widthdrawal
	 *	@return true/false
	 */
  	getWidthdrawals()
	{
		this.widthdrawalService.getWidthdrawals().subscribe((response) => {
			this.toPage = response.next_page_url;
			this.widthdrawalsList = response.data;
         /*for(var i=0; i < response.data.length; i++)
         {
           this.widthdrawalsList.push(response.data[i])
         }*/
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
           this.widthdrawalsList.push(response.data[i])
         }

       })
     }else{
         this.loader = false;
          this.localService.showError('All data have been loaded','Operation Unsuccessfull');
     }
    }

	/**
	 * @method approveWidthdrawalRequest
	 * approve widthdrawal requests
	 *	@return true/false
	 */
	approveWidthdrawalRequest(id)
	{
		let data = {
			id : id,
			vendor_id: this.vendor.id,
			status: 'Approved',
			approved_by: JSON.parse(this.localService.getUser()).id
		}
		this.widthdrawalService.approveWidthdrawalRequest(data).subscribe((response) => {
  	 		if(response.success = true)
			{
	 			this.getWidthdrawals()
				this.localService.showSuccess(response.message,'Operation Successfull');
			}
			else{
				this.localService.showError(response.message,'Operation Unsuccessfull');
			}
  	 	}, (error) => {
  	 		this.localService.showError('Error while performing this action, please try again later', 'Server Error')
  	 	});
	}

	/**
	 * @method cancelWidthdrawalRequest
	 * cancel widthdrawal requests
	 *	@return true/false
	 */
	cancelWidthdrawalRequest(id)
	{
		let data = {
			id : id,
			vendor_id: this.vendor.id,
			status: 'Cancelled',
			approved_by: JSON.parse(this.localService.getUser()).id
		}
		this.widthdrawalService.cancelWidthdrawalRequest(data).subscribe((response) => {
  	 		if(response.success = true)
			{
	 			this.getWidthdrawals()
				this.localService.showSuccess(response.message,'Operation Successfull');
			}
			else{
				this.localService.showError(response.message,'Operation Unsuccessfull');
			}
  	 	}, (error) => {
  	 		this.localService.showError('Error while performing this action, please try again later', 'Server Error')
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
