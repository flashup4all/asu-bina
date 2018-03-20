import { Component, OnInit } from '@angular/core';
import { trigger, style, animate, transition } from '@angular/animations';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LocalService } from '../../storage/local.service';
import { ContributionService } from './contribution.service';
import { XlsxToJsonService } from '../../shared/xls/index'
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
    /*trigger(
      'enterAnimation', [
        transition(':enter', [
          style({transform: 'translateX(100%)', opacity: 0}),
          animate('500ms', style({transform: 'translateX(0)', opacity: 1}))
        ]),
        transition(':leave', [
          style({transform: 'translateX(0)', opacity: 1}),
          animate('500ms', style({transform: 'translateX(100%)', opacity: 0}))
        ])
      ]
    )*/
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

	public xlsxToJsonService: XlsxToJsonService = new XlsxToJsonService();
	public vendor;
	public contibutionsList = [];
	public runContributionForm : FormGroup;
	file;
	public result: any;
	submitPending: boolean;
	contribution_type_list;
	successAlert;
	toPage;
  	loader;
  	toRequestPage;
  	monthList;
    filterForm: FormGroup;
    adv_filter: boolean;
  	public changeContibutionsRequestList;
  	current_year = moment().format('YYYY');
	constructor(
		private localService : LocalService,
  		private _fb : FormBuilder,
  		private contributionService : ContributionService
  		) {
		this.vendor = JSON.parse(this.localService.getVendor());
		this.getContributions();
		this.get_contribution_type()
		this.monthList = this.localService.yearjson();
		console.log(this.monthList)
		this.adv_filter = false;
		//this.getChangeContributionRequest();
  		}

	  ngOnInit() {
	  	this.runContributionForm = this._fb.group({
  			repayment_method : [null, Validators.compose([Validators.required])],
  			period : [null, Validators.compose([Validators.required])]
  		});
  		 /*filter form*/
       this.filterForm = this._fb.group({
	        from : '',
	        to : '',
	        id : ''
	      })

	  }

	  handleFile(event) {
	    let file = event.target.files[0];
	    this.xlsxToJsonService.processFileToJson({}, file).subscribe(data => {
	    this.result = JSON.stringify(data['sheets'].Sheet1);
	    console.log(data['sheets'].Sheet1);
	    });
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
		 	console.log('true')
       		this.contributionService.uploadExcelContributionFormat(this.file)
            .map(response => {
               console.log(response)
            })/*.catch(error => this.errorMessage = <any>error);
            setTimeout(() => {
                this.alertClosed = true;
            }, 5000);*/
        } else {
		 	console.log('false')
            //show error
        }
	}


    filterContribution(filterValues)
    {
      this.submitPending = true;
      filterValues['vendor_id'] = parseInt(this.vendor.id);
      console.log(filterValues)
      this.contributionService.filterContribution(filterValues).subscribe((response) => {
        this.contibutionsList = response.data
        this.submitPending = false;
      })
    }
    show_adv_form()
    {
      this.adv_filter =!this.adv_filter
    }

}
