import { Component, OnInit } from '@angular/core';
import { trigger, style, animate, transition } from '@angular/animations';
import { Observable } from 'rxjs/Observable';
import {of} from 'rxjs/observable/of';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LocalService } from '../../storage/local.service';
import { ContributionService } from './contribution.service';
// import { XlsxToJsonService } from '../../shared/xls/index'
import { MembersService } from '../membership/members.service';
import { StaffService } from '../staff/staff.service';
import { VendorService } from '../vendor.service';
import { TableExportService } from '../../shared/services/index';
//import * as FileSaver from 'file-saver';
import * as moment from 'moment';

@Component({
  selector: 'app-manage-contribution',
  templateUrl: './manage-contribution.component.html',
   animations: [
    trigger('slideInOut', [
      transition(':enter', [
        style({transform: 'translateY(-100%)'}),
        animate('200ms ease-in', style({transform: 'translateY(0%)'}))
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({transform: 'translateY(-100%)'}))
      ])
    ])
  ],
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
export class ManageContributionComponent implements OnInit {

	// public xlsxToJsonService: XlsxToJsonService = new XlsxToJsonService();
	public vendor;
	public contibutionsList = [];
	public runContributionForm : FormGroup;
	file;
	public result: any;
	submitPending: boolean;
  btn_loader: boolean = false;
	contribution_type_list;
	successAlert;
	toPage;
  	loader;
  	toRequestPage;
  	monthList;
    user;
    filterForm: FormGroup;
    adv_filter: boolean = false;
  	public changeContibutionsRequestList;
    contribution_plan_list;
  	current_year = moment().format('YYYY');
    searching = false;
    searchFailed = false;
    hideSearchingWhenUnsubscribed = new Observable(() => () => this.searching = false);
    
    staff_searchFailed = false;
    staff_searching = false;
    staff_hideSearchingWhenUnsubscribed  = new Observable(() => () => this.searching = false);
    vendor_branches;
	constructor(
		private localService : LocalService,
    private exportService: TableExportService,
		private _fb : FormBuilder,
    private memberService : MembersService,
    private vendor_service : VendorService,
    private staffService : StaffService,
		private contributionService : ContributionService
  		) {
    this.user = JSON.parse(this.localService.getUser());
		this.vendor = JSON.parse(this.localService.getVendor());
		this.getContributions();
		this.get_contribution_type()
    this.get_contribution_plan();
    this.get_vendor_branches();

		this.monthList = this.localService.yearjson();
  		}

	  ngOnInit() {
	  	/*this.runContributionForm = this._fb.group({
        plan_id : [null, Validators.compose([Validators.required])],
  			type : [null, Validators.compose([Validators.required])],
  			period : [null, Validators.compose([Validators.required])]
  		});*/
      
  		 /*filter form*/
       this.filterForm = this._fb.group({
          transaction_id : '',
	        from : '',
	        to : '',
	        id : '',
          member_id:'',
          branch_id: '',
          staff_id:'',
          plan_id:'',
          type:'',
          status:''
	      })

	  }

    search = (text$: Observable<string>) =>
    text$
      .debounceTime(300)
      .distinctUntilChanged()
      .do(() => this.searching = true)
      .switchMap(term =>
        this.memberService.filterMembers(term)
          .do(() => this.searchFailed = false)
          .catch(() => {
            this.searchFailed = true;
            return of([]);
          }))
      .do(() => this.searching = false)
      .merge(this.hideSearchingWhenUnsubscribed);
      formatter = (x: {first_name: string, middle_name: string, last_name: string, passport: string}) => x.first_name+'  '+ x.middle_name+'  '+ x.last_name;

    search_staff = (text$: Observable<string>) =>
    text$
      .debounceTime(300)
      .distinctUntilChanged()
      .do(() => this.staff_searching = true)
      .switchMap(sterm =>
        this.staffService.filterStaff(sterm)
          .do(() => this.staff_searchFailed = false)
          .catch(() => {
            this.staff_searchFailed = true;
            return of([]);
          }))
      .do(() => this.staff_searching = false)
      .merge(this.staff_hideSearchingWhenUnsubscribed);
      staff_formatter = (y: {first_name: string, middle_name: string, last_name: string, passport: string, staff_id: string}) => y.first_name+'  '+ y.middle_name+'  '+ y.last_name;


	  handleFile(event) {
	    let file = event.target.files[0];
	    /*this.xlsxToJsonService.processFileToJson({}, file).subscribe(data => {
	    this.result = JSON.stringify(data['sheets'].Sheet1);
	    console.log(data['sheets'].Sheet1);
	    });*/
	  }

	get_contribution_type()
  	{
  		this.contributionService.get_contribution_type().subscribe((response) => {
  			this.contribution_type_list = response.data;
  		})
  	}
  	/**
	/**
	 * @method getContributions
	 * get vendor contrinbution
	 * @return data
	 */
	getContributions()
	{
		this.contributionService.getContributions().subscribe((response) => {
			this.toPage = response.next_page_url;
			this.contibutionsList = response.data
			/*for(var i=0; i < response.data.length; i++)
	         {
	           	this.contibutionsList.push(response.data[i])
	         }*/
		});
	}

  get_contribution_plan()
    {
      this.submitPending = true;
      this.contributionService.get_contribution_plan().subscribe((response) => {
        this.contribution_plan_list = response;
        this.submitPending = false;
      })
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
  
	manageContribution()
	{
		
	}
	/**
	 * @method getChangeContributionRequest
	 * get vendor contrinbution
	 * @return data
	 */
	getChangeContributionRequest()
	{
		this.contributionService.getChangeContributionRequest().subscribe((response) => {
			this.changeContibutionsRequestList = response.data;
			this.toRequestPage = response.next_page_url;
			 /*for(var i=0; i < response.data.length; i++)
	         {
	           	this.changeContibutionsRequestList.push(response.data[i])
	         }*/
		});
	}
	loadMoreChangeContributionRequest()
    {
     this.loader = true;
      if(this.toRequestPage){
       this.localService.getPaginateData(this.toRequestPage).subscribe((response) => {
         this.toRequestPage = response.next_page_url;
         this.loader = false;
        for(var i=0; i < response.data.length; i++)
         {
           this.changeContibutionsRequestList.push(response.data[i])
         }

       })
     }else{
         this.loader = false;
          this.localService.showError('All data have been loaded','Operation Unsuccessfull');
     }
    }

	loadMoreContributions()
    {
     this.loader = true;
      if(this.toPage){
       this.localService.getPaginateData(this.toPage).subscribe((response) => {
         this.toPage = response.next_page_url;
         this.loader = false;
        for(var i=0; i < response.data.length; i++)
         {
           this.contibutionsList.push(response.data[i])
         }

       })
     }else{
         this.loader = false;
          this.localService.showError('All data have been loaded','Operation Unsuccessfull');
     }
    }

	/**
	 * @method runContribution
	 * get vendor contrinbution
	 * @return data
	 */
	runContribution(data)
	{
		 this.submitPending = true;
		data['vendor_id'] = JSON.parse(this.localService.getVendor()).id
		data['approved_by'] = JSON.parse(this.localService.getUser()).id
		this.contributionService.runContributions(data).subscribe((response) => {
		if(response.success = true)
	    {
	        this.submitPending = false;
	         this.getContributions();
	         this.runContributionForm.reset();
	         this.successAlert = response.message;
	        this.localService.showSuccess(response.message,'Operation Successfull');
	    } else{
	        this.submitPending = false;
	        this.localService.showError(response.message,'Operation Unsuccessfull');
	    }
			}, (error) => {
				this.submitPending = false;
	        	this.localService.showError(error,'Operation Unsuccessfull');
			});
	}
	/*download()
	{
		this.contributionService.exportExcelContributionFormat().subscribe((response) => {
			FileSaver.saveAs(response,'test.xls')
			});
	}*/

	getFiles(files: any) {
        let taskExcelFiles: FileList = files.files;
        this.file = taskExcelFiles[0];
    }


	uploadExcelFormat()
	{
		let data = [];
		 if (this.file !== undefined) {
			data['type'] = 'contribution';
			data['file'] = this.file;
       		this.contributionService.uploadExcelContributionFormat(this.file)
            .map(response => {
               console.log(response)
            })/*.catch(error => this.errorMessage = <any>error);
            setTimeout(() => {
                this.alertClosed = true;
            }, 5000);*/
        } else {
            //show error
        }
	}


    filterContribution(filterValues)
    {
      this.submitPending = true;
      let data = {
        from : filterValues.from,
        transaction_id : filterValues.transaction_id,
        plan_id : filterValues.plan_id,
        branch_id : filterValues.branch_id,
        to : filterValues.to,
        id : filterValues.id,
        staff_id : filterValues.staff_id.id,
        member_id : filterValues.member_id.id,
        type : filterValues.type,
        status : filterValues.status,
        vendor_id: parseInt(this.vendor.id)
      }
      this.contributionService.filterContribution(data).subscribe((response) => {
        this.contibutionsList = response.data
        this.submitPending = false;
      },(error) => {
        this.submitPending = false;
        this.localService.showError('Oops! Server Error!','Server Error Please contact Administrator');
      })
    }
    show_adv_form()
    {
      this.adv_filter =!this.adv_filter
    }

    post_transaction(transaction, status)
    {
      console.log(transaction)
      this.btn_loader = true;
      let data = {
        id: transaction.id,
        member_id: transaction.member_id,
        user_id: this.user.user_id,
        approved_by: this.user.id,
        vendor_id: this.vendor.id,
        status: status
      }
      
      this.contributionService.post_contribution_history(data).subscribe((response) => {
        if (response.success) {
            this.btn_loader = false;
            this.getContributions();
            this.localService.showSuccess(response.message,'Operation Successfull');
          }else{
            this.btn_loader = false;
            this.localService.showError(response.message,'Operation Unsuccessfull');
          }
        }, (error) => {
            this.btn_loader = false;
                this.localService.showError('Server Error Please contact Administrator','Operation Unsuccessfull');
        });
    }

}
