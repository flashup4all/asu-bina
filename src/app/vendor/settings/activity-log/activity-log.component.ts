import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';

import { ModalDirective } from 'ngx-bootstrap/modal';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { VendorService } from '../../vendor.service';
import { countries, LocalService, states, cities, currency } from '../../../storage/index';
import { environment } from '../../../../environments/environment';
import { StaffService } from '../../staff/staff.service';

@Component({
  selector: 'app-activity-log',
  templateUrl: './activity-log.component.html',
  styleUrls: ['./activity-log.component.scss']
})
export class ActivityLogComponent implements OnInit {

	logs;
	filter_form: FormGroup;
	submitPending: boolean = false;
	staffList;
	vendor;
	user;
	objectKeys = Object.keys;
  	constructor(
  		private localService : LocalService,
  		private _fb : FormBuilder,
  		private manageVendorService : VendorService,
    	private staffService : StaffService,
  		) { 
  		this.get_activity_logs();
  		this.getStaff();
		this.vendor = JSON.parse(this.localService.getVendor());
		this.user = JSON.parse(this.localService.getUser());

  	}

  	ngOnInit() {
  		this.filter_form = this._fb.group({
	        user_id : '',
	        from : '',
	        to : '',
	        id : '',
	      })
  	}

  	/**
  	 * @method get_activity_logs
  	 *
  	 */
  	get_activity_logs()
    {
        this.manageVendorService.get_vendor_logs().subscribe((response) => {
            this.logs = response.data;

        },(error) => {
            this.localService.showError(error,'Operation Unsuccessfull');
            });
    }

    /**
     * @method getStaff
     * creates a new staff  resource
     * @return data
     */
    getStaff()
    {
        this.staffService.getStaff().subscribe((response) => {
         this.staffList = response.data.data;
       })
    }
    /**
     * @method decode
     * decodes json data 
     */
    decode(data)
    {
    	let array = JSON.parse(data)
    	return array;

    }

    /**
     *
     *
     */
    filter_logs(form_values)
    {
        form_values['vendor_id'] = this.vendor.id;
        this.manageVendorService.filter_vendor_logs(form_values).subscribe((response) => {
            this.logs = response.data
            },(error) => {
                this.submitPending = false;
                this.localService.showError(error,'Operation Unsuccessfull');
            });
    }
}
