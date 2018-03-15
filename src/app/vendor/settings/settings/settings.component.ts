import { Component, OnInit } from '@angular/core';
//import { ModalDirective } from 'ngx-bootstrap/modal';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LocalService } from '../../../storage/local.service';
import { SettingsService } from './settings.service';
@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
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
export class SettingsComponent implements OnInit {
    public vendor;
    private settingsList;
    submitPending: boolean;
    public isCollapsed = false;

    constructor(
      private localService : LocalService,
      private _fb : FormBuilder,
      private settingSevice: SettingsService
      ) {
      this.vendor = JSON.parse(this.localService.getVendor());
      this.getSettings();
      }

    ngOnInit() {
    }
    /**
     * @method updateSettings
     * update settings resource
     * @return data
     */
    updateSettings(status, id)
    {
        let data = {
          id: id,
          status: status,
          vendor_id: this.vendor.id
        }
        this.settingSevice.updateSettings(data).subscribe((response) => {
          if(response.success = true)
          {
            this.submitPending = false;
            this.localService.showSuccess(response.message,'Operation Successfull');
          }
          else{
            this.submitPending = false;
            this.localService.showError(response.message,'Operation Unsuccessfull');
        }
        });
    }

    /**
     * @method getSettings
     * get settings resource
     * @return data
     */
     getSettings()
     {
       this.settingSevice.getSettings().subscribe((response) => {
         this.settingsList = response.data;
       })
     }

}
