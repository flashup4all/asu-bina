import { Component, OnInit } from '@angular/core';
import { trigger, style, animate, transition } from '@angular/animations';
import {NgbTypeahead} from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs/Rx';
import { Observable } from 'rxjs/Observable';
import {of} from 'rxjs/observable/of';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LocalService } from '../../storage/local.service';
import { DeductionsService } from './deductions.service';
import { MembersService } from '../membership/members.service';
import * as moment from 'moment';

@Component({
  selector: 'app-manage-deductions',
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
  templateUrl: './manage-deductions.component.html',
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
export class ManageDeductionsComponent implements OnInit {

	public vendor;
	public deductionsList = [];
	public runDeductionsForm : FormGroup;
    filterForm: FormGroup;
	submitPending: boolean;
  	adv_filter:boolean;
	successAlert;
	toPage;
  	loader;
  	current_year = moment().format('YYYY');
  	monthList;
  	searching = false;
  	searchFailed = false;
  	hideSearchingWhenUnsubscribed = new Observable(() => () => this.searching = false);
  
	constructor(
		private localService : LocalService,
  		private _fb : FormBuilder,
      	private memberService : MembersService,
  		private deductionService : DeductionsService
  		) {
		this.adv_filter = false;
		this.vendor = JSON.parse(this.localService.getVendor());
		this.getLoanDeductions();
		this.monthList = this.localService.yearjson();

  		}

	  ngOnInit() {
	  	this.runDeductionsForm = this._fb.group({
  			repayment_method : [null, Validators.compose([Validators.required])],
  			period : [null, Validators.compose([Validators.required])]
  		});
  		this.filterForm = this._fb.group({
        from : '',
        to : '',
        id : '',
        member_id : '',
        loan_type_id : '',
        loan_request_id : '',
      })
	  }

	  search = (text$: Observable<string>) =>
    text$
      .debounceTime(300)
      .distinctUntilChanged()
      .do(() => this.searching = true)
      .switchMap(term =>
        this.memberService.queryMember(term)
          .do(() => this.searchFailed = false)
          .catch(() => {
            this.searchFailed = true;
            return of([]);
          }))
      .do(() => this.searching = false)
      .merge(this.hideSearchingWhenUnsubscribed);
      formatter = (x: {name: string}) => x.name;

      /*searchStaff = (text$: Observable<string>) =>
    text$
      .debounceTime(300)
      .distinctUntilChanged()
      .do(() => this.searching = true)
      .switchMap(sterm =>
        this.staffService.filterStaff(sterm)
          .do(() => this.searchFailed = false)
          .catch(() => {
            this.searchFailed = true;
            return of([]);
          }))
      .do(() => this.searching = false)
      .merge(this.hideSearchingWhenUnsubscribed);
      st_formatter = (x: {name: string}) => x.name;
*/

	/**
	 * @method getDeductions
	 * get vendor contrinbution
	 * @return data
	 */
	getLoanDeductions()
	{
		this.deductionService.getDeductions().subscribe((response) => {
			this.toPage = response.next_page_url;
			this.deductionsList = response.data;
			/* for(var i=0; i < response.data.length; i++)
	        {
	           	this.deductionsList.push(response.data[i])
	        }*/
		});
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
           this.deductionsList.push(response.data[i])
        }

       })
     }else{
         this.loader = false;
          this.localService.showError('All data have been loaded','Operation Unsuccessfull');
     }
    }

	/**
	 * @method runDeductions
	 * run loan deductions
	 * @return data
	 */
	runDeductions(data)
	{
		this.submitPending = true;
		data['vendor_id'] = JSON.parse(this.localService.getVendor()).id
		data['approved_by'] = JSON.parse(this.localService.getUser()).id
		this.deductionService.runDeductions(data).subscribe((response) => {
		if(response.success = true)
	    {
	        this.submitPending = false;
	         this.getLoanDeductions();
	         this.runDeductionsForm.reset();
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
	show_adv_form()
    {
      this.adv_filter =!this.adv_filter
    }

    filterDeduction(filterValues)
    {
      this.submitPending = true;
      filterValues['vendor_id'] = parseInt(this.vendor.id);
      this.deductionService.filterDeduction(filterValues).subscribe((response) => {
        this.deductionsList = response
        this.submitPending = false;
      })
    }
}
