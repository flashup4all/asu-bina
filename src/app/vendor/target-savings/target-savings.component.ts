import { Component, OnInit, ViewChild } from '@angular/core';

import { ModalDirective } from 'ngx-bootstrap/modal';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LocalService } from '../../storage/local.service';
import { TargetSavingsService } from './target-savings.service';
import { TableExportService } from '../../shared/services/index';

@Component({
  selector: 'app-target-savings',
  templateUrl: './target-savings.component.html',
  styleUrls: ['./target-savings.component.scss']
})
export class TargetSavingsComponent implements OnInit {

	public vendor;
	public targetList = [];
	toPage;
  	loader;

  	constructor(
  		private localService : LocalService,
      private exportService: TableExportService,
  		private _fb : FormBuilder,
  		private targetService : TargetSavingsService
  		) {
  			this.getVendorTargetSavings()
  		 }

  	ngOnInit() {
  	}

  	/**
	 * @method getVendorTargetSavings
	 * get vendor target savings
	 *	@return true/false
	 */
  	getVendorTargetSavings()
	{
		this.targetService.getVendorTargetSavings().subscribe((response) => {
			this.toPage = response.next_page_url;
			this.targetList = response.data;
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
         this.targetList.push(response.data[i])
       }

     })
   }else{
       this.loader = false;
        this.localService.showError('All data have been loaded','Operation Unsuccessfull');
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
