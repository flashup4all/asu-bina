import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';

import { ModalDirective } from 'ngx-bootstrap/modal';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { VendorService } from '../../../vendor.service';
import { countries, LocalService, states, cities, currency } from '../../../../storage/index';

@Component({
  selector: 'app-sms-history',
  templateUrl: './sms-history.component.html'
})

export class SmsHistoryComponent implements OnInit {

	public single_sms_form : FormGroup;
  	sms_settings_loader: boolean = false;
  	sms_settings_data;
  	send_sms_loader: boolean = false;
  	sms_history_loader : boolean = false;
  	loader: boolean = false;
  	vendor;
	user;
	sms_history;
	toPage;

  	@ViewChild('single_sms_modal') public single_sms_modal : ModalDirective;
  	constructor(
		private localService : LocalService,
      	private _fb: FormBuilder,
  		private vendor_service: VendorService,
  		) { 
  		  this.vendor = JSON.parse(this.localService.getVendor());
		    this.user = JSON.parse(this.localService.getUser());
  		  // this.filter_curency(this.vendor.currency_code)
        this.get_sms_settings();
        this.get_vendor_sms_history()
  	}

  	ngOnInit() {
      this.single_sms_form = this._fb.group({
        //identifier : [null, Validators.compose([Validators.required])],
        message: '',
        phone_no: '',
      });
  	}

  	get_sms_settings()
    {
      this.vendor_service.get_sms_settings().subscribe((response) => {
        this.sms_settings_data = response.sms_settings;        
      }, (error) => {
        this.sms_settings_loader = false;
        this.localService.showError(error,'Operation Unsuccessfull');
      });
    }
    /**
     * @method get_vendor_sms_history
     * get vendor sms history resource
     * @return data
     */
    get_vendor_sms_history()
    {
      this.sms_history_loader = true;
      this.vendor_service.get_vendor_sms_history().subscribe((response) => {
        this.sms_history = response.data;
        this.toPage = response.next_page_url;
        this.sms_history_loader = false;  
      }, (error) => {
        this.sms_history_loader = false;
        this.localService.showError(error,'Operation Unsuccessfull');
      });
    }
    /**
     * @method resend_sms
     * delete a row from sms history
     * @return response
     */
    resend_sms(item)
    {
      let data = {
       vendor_id: this.vendor.id,
       staff_id: this.user.id,
       phone_no: item.recipient,
       message: item.message,
       identifier: item.identifier 
      }
      this.vendor_service.send_bulk_sms(data).subscribe((response) => {
        if(response.success)
        {
           // this.sms_history = response.data;
         this.get_sms_settings();
         this.get_vendor_sms_history();
         this.single_sms_form.reset();
         this.single_sms_modal.hide()
          this.send_sms_loader = false;  
        }else{
          this.send_sms_loader = false;
        this.localService.showError(response.message,'Operation Unsuccessfull');
        }
      
      }, (error) => {
        this.send_sms_loader = false;
        this.localService.showError(error,'Operation Unsuccessfull');
      });
    }
    /**
     * @method send_sms
     * send sms
     * @return response
     */
    send_sms(form_values)
    {
      this.send_sms_loader = true;
      form_values['identifier'] = this.sms_settings_data.identifier;
      form_values['vendor_id'] = this.vendor.id;
      form_values['staff_id'] = this.user.id;
      this.vendor_service.send_bulk_sms(form_values).subscribe((response) => {
        if(response.success)
        {
           // this.sms_history = response.data;
         this.get_sms_settings();
         this.get_vendor_sms_history();
         this.single_sms_form.reset();
         this.single_sms_modal.hide()
          this.send_sms_loader = false;  
        }else{
          this.send_sms_loader = false;
        this.localService.showError(response.message,'Operation Unsuccessfull');
        }
      
      }, (error) => {
        this.send_sms_loader = false;
        this.localService.showError(error,'Operation Unsuccessfull');
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
           this.sms_history.push(response.data[i])
         }

       })
     }else{
         this.loader = false;
          this.localService.showError('All data have been loaded','Operation Unsuccessfull');
     }
    }
}
