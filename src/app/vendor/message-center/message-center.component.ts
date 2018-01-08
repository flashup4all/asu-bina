import { Component, OnInit, ViewChild } from '@angular/core';

import { ModalDirective } from 'ngx-bootstrap/modal/modal.component';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LocalService } from '../../storage/local.service';
import { MessageService } from './message.service';

@Component({
  selector: 'app-message-center',
  templateUrl: './message-center.component.html',
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
export class MessageCenterComponent implements OnInit {

    public vendor;
	  private messagesList;
    private messages: boolean;
    private viewMessages: boolean;
    private messageDetails;
    private messageForm: FormGroup;
    submitPending: boolean;
    @ViewChild('newMessageModal')  public newMessageModal: ModalDirective;

	  constructor(
		  private localService : LocalService,
  		private _fb : FormBuilder,
      private messageService : MessageService
  		) {
		  this.vendor = JSON.parse(this.localService.getVendor());
      this.getVendorMessages('inbox');
  		}

	  ngOnInit() {
      this.messageForm = this._fb.group({
          subject : [null, Validators.compose([Validators.required])],
          details : [null, Validators.compose([Validators.required])],
          type: [null, Validators.compose([Validators.required])],
          //emails: this._fb.array([this.initEmails()])
      })
	  }
    /**
     * @method createItem
     * create new form group
     * @return true
     */
    initEmails(): FormGroup {
      return this._fb.group({
        recievers_id: [null, Validators.compose([Validators.required])],
        sender_id: [null, Validators.compose([Validators.required])]
      });
  }

  /**
   * @method sendMessage
   * send mail
   * @return true
   */
  sendMessage(data)
  {
    data['vendor_id'] = this.vendor.id;
    data['vendor_name'] = this.vendor.name;
    data['sender_email'] = JSON.parse(this.localService.getUser()).email;
    this.messageService.postMessage(data).subscribe((response) => {
      if(response.success = true)
      {
        this.submitPending = false;
        this.newMessageModal.hide();
        this.localService.showSuccess(response.message,'Operation Successfull');
      }
      else{
        this.submitPending = false;
        this.localService.showError(response.message,'Operation Unsuccessfull');
      }
    });
  }

  /**
   * @method getVendorMessages
   * get vendor mails
   * @return data
   */
   getVendorMessages(status)
   {
     this.messages = true;
     this.viewMessages = false;
     this.messageService.getVendorMessage(status).subscribe((response) => {
       this.messagesList = response;
     })
   }

   mailSelector(data)
   {
     this.viewMessages = false;
     this.getVendorMessages(data)
   }
   viewMessage(data)
   {
     this.messages = false;
     this.viewMessages = true;
     this.messageDetails = data;
     console.log(data)
   }
}
