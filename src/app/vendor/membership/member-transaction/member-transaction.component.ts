import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { FormGroup, FormBuilder, Validators, FormControl, FormArray } from '@angular/forms';
import { LocalService } from '../../../storage/local.service';
import { MembersService } from '../members.service';

import { ContributionService } from '../../manage-contribution/contribution.service';

import { WidthdrawalsService } from '../../manage-widthdrawals/widthdrawals.service';
import { ViewMemberComponent } from '../view-member/view-member.component';
import { DeviceDetectorService } from 'ngx-device-detector';

import * as moment from 'moment';
import { TableExportService } from '../../../shared/services/index';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-member-transaction',
  templateUrl: './member-transaction.component.html',
  styleUrls: ['./member-transaction.component.scss']
})
export class MemberTransactionComponent implements OnInit {

  image_url;
  signature_url;
  vendor;
  user;
  vendor_branch;
  memberId;
  monthList;
  transaction_list;
  constructor(private route: ActivatedRoute,
    private localService: LocalService,
    private contributionService: ContributionService,
    private withdrawalService: WidthdrawalsService,
    private exportService: TableExportService,
    private router: Router,
    private sanitizer: DomSanitizer,
    private _fb: FormBuilder,
    private memberService: MembersService,
    private view_member_component: ViewMemberComponent,
    private deviceService: DeviceDetectorService,
  ) {

    this.image_url = environment.api.imageUrl + 'profile/member/';
    this.signature_url = environment.api.imageUrl + 'profile/signature/';
    this.vendor = JSON.parse(this.localService.getVendor());
    this.user = JSON.parse(this.localService.getUser());
    this.vendor_branch = JSON.parse(this.localService.getBranchData());
    this.memberId = this.route.snapshot.params['member_id'];
    this.monthList = this.localService.yearjson();
  }

  ngOnInit() {
    this.get_member_transactions();
  }

  /**
   * @method getMemberWithdrawal
   * get member profile resource
   * @return data
   */
  get_member_transactions() {
    this.memberService.get_member_transactions(this.memberId).subscribe((response) => {
      this.transaction_list = response.data;
    })
  }
}
