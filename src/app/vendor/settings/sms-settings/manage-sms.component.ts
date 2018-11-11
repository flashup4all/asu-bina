import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';

import { ModalDirective } from 'ngx-bootstrap/modal';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { VendorService } from '../../vendor.service';
import { countries, LocalService, states, cities, currency } from '../../../storage/index';

@Component({
  selector: 'app-manage-sms',
  templateUrl: './manage-sms.component.html'
})
export class ManageSmsComponent implements OnInit {

  vendor;
  user;
    sms_loader: boolean = false;
    loader: boolean = false;
    sms_settings;
    invoice_data;
    toPage
   constructor(
    private localService : LocalService,
        private _fb: FormBuilder,
      private vendor_service: VendorService,
      ) { 
        this.vendor = JSON.parse(this.localService.getVendor());
      this.user = JSON.parse(this.localService.getUser());
        // this.filter_curency(this.vendor.currency_code)
      this.get_sms_settings()

    }

    ngOnInit() {
    }

    /**
     * @method get_sms_settings
     * get vendor sms settings resource
     * @return data
     */
    get_sms_settings()
    {
      this.sms_loader = true;
      this.vendor_service.get_sms_settings().subscribe((response) => {
        this.sms_settings = response.data;
        this.sms_loader = false;  
      }, (error) => {
        this.sms_loader = false;
        this.localService.showError(error,'Operation Unsuccessfull');
      });
    }
}