import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';

import { ModalDirective } from 'ngx-bootstrap/modal';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { VendorService } from '../../vendor.service';
import { countries, LocalService, states, cities, currency } from '../../../storage/index';

@Component({
  selector: 'app-sms-settings',
  templateUrl: './sms-settings.component.html'
})
export class SmsSettingsComponent implements OnInit {

  public sms_setting_form : FormGroup;
  public birthday_sms_setting_form : FormGroup;
  public anouncement_sms_setting_form : FormGroup;
  public investmentHistoryForm : FormGroup;
  public investmentFilterForm : FormGroup;
  submitPending: boolean = false;
  sms_settings_loader: boolean = false;
  birthday_sms_settings_loader: boolean = false;
  sms_notification_loader: boolean = false;
	
	vendor;
	user;
  sms_settings_data;
	birthday_settings_data;
	
  errorMessage;
  member_msg_length
  member_unit_length
  staff_msg_length
  staff_unit_length
  identifier
    constructor(
		private localService : LocalService,
      private _fb: FormBuilder,
  		private vendor_service: VendorService,
  		) { 
  		  this.vendor = JSON.parse(this.localService.getVendor());
		    this.user = JSON.parse(this.localService.getUser());
  		  // this.filter_curency(this.vendor.currency_code)
        this.get_sms_settings();
  	}

  	ngOnInit() {

      this.sms_setting_form = this._fb.group({
        identifier : [null, Validators.compose([Validators.required])],
        member_sms: '',
        member_email: '',
        staff_sms: '',
        staff_email: '',
      });

      this.birthday_sms_setting_form = this._fb.group({
        identifier : [null, Validators.compose([Validators.required])],
        member_sms: '',
        member_email: '',
        staff_sms: '',
        staff_email: '',
        staff_msg: '',
        member_msg: '',
      });
      this.anouncement_sms_setting_form = this._fb.group({
        identifier : [null, Validators.compose([Validators.required])],
        message: '',
        recipient: '',
        all_staff: '',
        all_members: '',
        sms: '',
        email: '',

      });
      
  	}

    save_sms_setting_form(form_values)
    {
      this.sms_settings_loader = true;
      form_values.vendor_id = this.vendor.id;
      form_values.staff_id = this.user.id;
      this.vendor_service.update_sms_settings(form_values).subscribe((response) => {
        if(response.success)
        {
          this.sms_settings_loader = false;
           this.get_sms_settings()
          this.localService.showSuccess(response.message,'Operation Successfull');
        }
        else{
          this.sms_settings_loader = false;
          this.localService.showError(response.message,'Operation Unsuccessfull');
        }
      }, (error) => {
        this.sms_settings_loader = false;
        this.localService.showError(error,'Operation Unsuccessfull');
      });
    }
    save_birthday_sms_setting_form(form_values)
    {
      this.birthday_sms_settings_loader = true;
      form_values.vendor_id = this.vendor.id;
      form_values.staff_id = this.user.id;
      this.vendor_service.update_birthday_sms_settings(form_values).subscribe((response) => {
        if(response.success)
        {
          this.birthday_sms_settings_loader = false;
           this.get_sms_settings()
          this.localService.showSuccess(response.message,'Operation Successfull');
        }
        else{
          this.birthday_sms_settings_loader = false;
          this.localService.showError(response.message,'Operation Unsuccessfull');
        }
      }, (error) => {
        this.birthday_sms_settings_loader = false;
        this.localService.showError(error,'Operation Unsuccessfull');
      });
    }
    send_anouncement_sms_setting_form(form_values)
    {
      this.sms_notification_loader = true;
      form_values.vendor_id = this.vendor.id;
      form_values.staff_id = this.user.id;
      this.vendor_service.send_notification(form_values).subscribe((response) => {
        if(response.success)
        {
          this.sms_notification_loader = false;
          this.localService.showSuccess(response.message,'Operation Successfull');
        }
        else{
          this.sms_notification_loader = false;
          this.localService.showError(response.message,'Operation Unsuccessfull');
        }
      }, (error) => {
        this.sms_notification_loader = false;
        this.localService.showError(error,'Operation Unsuccessfull');
      });
    }

    get_sms_settings()
    {
      this.vendor_service.get_sms_settings().subscribe((response) => {
        this.sms_settings_data = response.sms_settings;
        this.birthday_settings_data = response.birthday_sms_settings;
      }, (error) => {
        this.sms_settings_loader = false;
        this.localService.showError(error,'Operation Unsuccessfull');
      });
    }
    count_staff_msg(event)
    {
      /*if(event.length > 0)
      {
        this.staff_msg_length = event.length+' Characters';
        
        if(event.length < 160)
        {
          this.staff_unit_length = '1 Units';
        }

        if(event.length > 160)
        {
          this.staff_unit_length = '2 Units';
        }
        if(event.length > 320)
        {
          this.staff_unit_length = '3 Units';
        }
      }*/
    }

    count_member_msg(event)
    {
      /*if(event.length > 0)
      {
        this.member_msg_length = event.length+' Characters';
        
        if(event.length < 160)
        {
          this.member_unit_length = '1 Units';
        }
        if(event.length > 160)
        {
          this.member_unit_length = '2 Units';
        }
        if(event.length > 320)
        {
          this.member_unit_length = '3 Units';
        }
      }*/
    }
}