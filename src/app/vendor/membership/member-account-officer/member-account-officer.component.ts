import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { LocalService, currency } from '../../../storage/index';
import { TableExportService } from '../../../shared/services/index';
import { ViewMemberComponent } from '../view-member/view-member.component';
import * as moment from 'moment';
@Component({
  selector: 'app-member-account-officer',
  templateUrl: './member-account-officer.component.html'
})
export class MemberAccountOfficerComponent implements OnInit {

	vendor;
	user;
  member_id;
  show_add_form_check: boolean = false;
  public acc_oficer_form : FormGroup;
  account_officers

  constructor(
		private localService : LocalService,
    private exportService: TableExportService,
		private _fb: FormBuilder,
    private view_member_component: ViewMemberComponent
		) { 
		  this.vendor = JSON.parse(this.localService.getVendor());
	    this.user = JSON.parse(this.localService.getUser());
      this.member_id = this.view_member_component.memberId;

    }

  	ngOnInit() {
      this.acc_oficer_form = this._fb.group({
        staff_id : [null, Validators.compose([Validators.required])],
        member_id: '',
        approved_by: '',
        status: '',
        description:''
      });

  	}

    save_acct_officer_form(form_values)
    {
      console.log(form_values)
    }
}