import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';

import { ModalDirective } from 'ngx-bootstrap/modal';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { VendorService } from '../../../vendor.service';
import { countries, LocalService, states, cities, currency } from '../../../../storage/index';

@Component({
  selector: 'app-sms-settings',
  templateUrl: './sms-settings.component.html'
})
export class SmsSettingsComponent implements OnInit {

  public sms_setting_form : FormGroup;
  public birthday_sms_setting_form : FormGroup;
  public welcome_sms_setting_form : FormGroup;
  public anouncement_sms_setting_form : FormGroup;
  public single_sms_form : FormGroup;
  submitPending: boolean = false;
  sms_settings_loader: boolean = false;
  birthday_sms_settings_loader: boolean = false;
  sms_notification_loader: boolean = false;
  send_sms_loader: boolean = false;
  welcome_sms_notification_loader: boolean = false;
	sms_subscription_loader: boolean = false;
  loader: boolean = false;
  sms_history_loader : boolean = false;
  sms_subscriptions;
  invoice_data;
  toPage;

	vendor;
	user;
  sms_settings_data;
  birthday_settings_data;
	welcome_sms_settings;
  sms_history
	
  errorMessage;
  member_msg_length
  member_unit_length
  staff_msg_length
  staff_unit_length
  identifier
  @ViewChild('sms_subscription_invoice_modal') public sms_subscription_invoice_modal : ModalDirective;
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
        this.get_vendor_sms_subscriptions();
        this.get_vendor_sms_history()
  	}

  	ngOnInit() {

      this.sms_setting_form = this._fb.group({
        identifier : [null, Validators.compose([Validators.required])],
        member_sms: '',
        member_email: '',
        staff_sms: '',
        staff_email: '',
      });
      this.single_sms_form = this._fb.group({
        identifier : [null, Validators.compose([Validators.required])],
        message: '',
        phone_no: '',
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
      this.welcome_sms_setting_form = this._fb.group({
        identifier : [null, Validators.compose([Validators.required])],
        activate_member_sms: '',
        member_sms: '',
        member_email: '',
        activate_staff_sms: '',
        staff_sms: '',
        staff_email: '',
        staff_msg: [null, Validators.compose([Validators.required])],
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
    /**
     * @method save_sms_setting_form
     * save sms message settings
     * @return response
     */
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
    /**
     * @method save_welcome_sms_setting_form
     * save welcome message settings
     * @return response
     */
    save_welcome_sms_setting_form(form_values)
    {
      this.welcome_sms_notification_loader = true;
      form_values.vendor_id = this.vendor.id;
      form_values.staff_id = this.user.id;
      this.vendor_service.update_welcome_sms_settings(form_values).subscribe((response) => {
        if(response.success)
        {
          this.welcome_sms_notification_loader = false;
           this.get_sms_settings()
          this.localService.showSuccess(response.message,'Operation Successfull');
        }
        else{
          this.welcome_sms_notification_loader = false;
          this.localService.showError(response.message,'Operation Unsuccessfull');
        }
      }, (error) => {
        this.welcome_sms_notification_loader = false;
        this.localService.showError(error,'Operation Unsuccessfull');
      });
    }
    /**
     * @method save_birthday_sms_setting_form
     * save birthday message settings
     * @return response
     */
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
      this.vendor_service.send_bulk_notification(form_values).subscribe((response) => {
        if(response.success)
        {
          this.get_sms_settings();
         this.get_vendor_sms_history();
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
        this.welcome_sms_settings = response.welcome_sms_settings;
        
      }, (error) => {
        this.sms_settings_loader = false;
        this.localService.showError(error,'Operation Unsuccessfull');
      });
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
        this.sms_subscriptions = response;
        this.sms_subscription_loader = false;  
      }, (error) => {
        this.sms_subscription_loader = false;
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
     * @method delete_sms_history
     * delete a row from sms history
     * @return response
     */
    delete_sms_history(item)
    {

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
           this.sms_history.push(response.data[i])
         }

       })
     }else{
         this.loader = false;
          this.localService.showError('All data have been loaded','Operation Unsuccessfull');
     }
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
                

              
              .row{
                display: block;
                width: 100%;
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
               
               .left{ 
                 float: left;
                 width:50%;
               }
               
               .right{
                 width:50%;
                 float: right;
               }
               
               
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