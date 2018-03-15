import { Component, OnInit } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LocalService } from '../../../storage/local.service';
import { ContributionService } from '../contribution.service';

@Component({
  selector: 'app-collections',
  templateUrl: './collections.component.html',
  styleUrls: ['./collections.component.css']
})
export class CollectionsComponent implements OnInit {

	public vendor;
	private contibutionsList = [];
	public runContributionForm : FormGroup;
	file
	submitPending: boolean;
	successAlert;
	toPage;
  	loader;
  	toRequestPage;
  	private changeContibutionsRequestList;

  	constructor(
  		private localService : LocalService,
  		private _fb : FormBuilder,
  		private contributionService : ContributionService
  		) {
		this.vendor = JSON.parse(this.localService.getVendor());
		this.getContributions();
		//this.getChangeContributionRequest();
  		}
  	ngOnInit() {
  	}

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

}
