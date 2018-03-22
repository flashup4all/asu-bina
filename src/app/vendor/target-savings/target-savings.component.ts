import { Component, OnInit, ViewChild } from '@angular/core';

import { ModalDirective } from 'ngx-bootstrap/modal';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LocalService } from '../../storage/local.service';
import { TargetSavingsService } from './target-savings.service';
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
}
