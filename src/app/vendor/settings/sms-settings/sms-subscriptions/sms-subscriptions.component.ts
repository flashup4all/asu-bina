import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';

import { ModalDirective } from 'ngx-bootstrap/modal';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { VendorService } from '../../../vendor.service';
import { countries, LocalService, states, cities, currency } from '../../../../storage/index';

@Component({
  selector: 'app-sms-subscriptions',
  templateUrl: './sms-subscriptions.component.html'
})
export class SmsSubscriptionComponent implements OnInit {

	vendor;
	user;
  	sms_subscription_loader: boolean = false;
  	loader: boolean = false;
  	sms_subscriptions;
  	invoice_data;
  	toPage;
    @ViewChild('sms_subscription_invoice_modal') public sms_subscription_invoice_modal : ModalDirective;

	 constructor(
		private localService : LocalService,
      	private _fb: FormBuilder,
  		private vendor_service: VendorService,
  		) { 
  		  this.vendor = JSON.parse(this.localService.getVendor());
		  this.user = JSON.parse(this.localService.getUser());
  		  // this.filter_curency(this.vendor.currency_code)
  		  this.get_vendor_sms_subscriptions()

  	}

  	ngOnInit() {
  	}
  	/**
     * @method get_vendor_sms_subscriptions
     * get vendor sms subscriptions resource
     * @return data
     */
    get_vendor_sms_subscriptions()
    {
      this.sms_subscription_loader = true;
      this.vendor_service.get_vendor_subscriptions().subscribe((response) => {
        this.sms_subscriptions = response.data;
        this.sms_subscription_loader = false;  
      }, (error) => {
        this.sms_subscription_loader = false;
        this.localService.showError(error,'Operation Unsuccessfull');
      });
    }

    view_subscription_invoice(data)
    {
    	this.invoice_data = data;
    	this.sms_subscription_invoice_modal.show();
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
           this.sms_subscriptions.push(response.data[i])
         }

       })
     }else{
         this.loader = false;
          this.localService.showError('All data have been loaded','Operation Unsuccessfull');
     }
    }
}