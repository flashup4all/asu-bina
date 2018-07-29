import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { FormGroup, FormBuilder, Validators, FormControl, FormArray } from '@angular/forms';
import { LocalService } from '../../../storage/local.service';
import { MembersService } from '../../membership/members.service';
import { StaffService } from '../../staff/staff.service';
import { LoanRequestService } from '../../manage-loanrequest/loan-request.service';
import { LoanSettingsService } from '../../loans/loan-settings/loan-settings.service';
import { ContributionService } from '../../manage-contribution/contribution.service';
import { DeductionsService } from '../../manage-deductions/deductions.service';
import { TargetSavingsService } from '../../target-savings/target-savings.service';
import { WidthdrawalsService } from '../../manage-widthdrawals/widthdrawals.service';
import * as moment from 'moment';
import { TableExportService } from '../../../shared/services/index';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-view-staff',
  templateUrl: './view-staff.component.html',
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
export class ViewStaffComponent implements OnInit {
    public vendor;
    public user;
    public staffId;
    image_url
    monthList
    staff;
    
   @ViewChild('fileInput') fileInput: ElementRef;

    constructor(
      private route : ActivatedRoute, 
    	private localService : LocalService,
      private contributionService : ContributionService,
      private deductionService : DeductionsService,
      private withdrawalService : WidthdrawalsService,
      private exportService: TableExportService,
      private router : Router,
      private sanitizer:DomSanitizer,
  	  private _fb : FormBuilder,
      private memberService : MembersService,
      private staff_service : StaffService,
      private loanRequestService : LoanRequestService,
      private loanSettingsService : LoanSettingsService,
    	private targetService : TargetSavingsService
    	) {
        this.image_url = environment.api.imageUrl+'profile/staff/';
        this.vendor = JSON.parse(this.localService.getVendor());
        this.user = JSON.parse(this.localService.getUser());
        //this.router.events.subscribe((val) => {
        this.staffId = this.route.snapshot.params['staff_id'];
         // });
        this.monthList = this.localService.yearjson();
        this.get_staff(this.staffId)
        
       }

    ngOnInit() {
      
    }

    /**
     * @method get_staff
     * get a particular staff resource
     * @return data
     */
     get_staff(id)
     {
       this.staff_service.get_single_staff(id).subscribe((response) => {
         this.staff = response.data
       })
     }
}