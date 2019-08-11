import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap';
import { TabsModule } from 'ngx-bootstrap/tabs';
//import { MembershipRoutingModule } from './membership-routing.module';
import { ManageMembersComponent } from './manage-members/manage-members.component';
import { ViewMemberComponent } from './view-member/view-member.component';
import { MemberWithdrawalsComponent } from './member-withdrawals/member-withdrawals';
import { MemberInvestmentsComponent } from './member-investments/member-investments.component';
import { MemberContributionsComponent } from './member-contributions/member-contributions.component';
import { MemberAccountOfficerComponent } from './member-account-officer/member-account-officer.component';
import { MemberLoanRequestComponent } from './member-loan-request/member-loan-request.component';
import { MemberDeductionsComponent } from './member-deductions/member-deductions.component';
import { MemberTransactionComponent } from './member-transaction/member-transaction.component';
import { MembersService } from './members.service';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from '../../shared/shared.module';
//import { MaskPipe } from '../../shared/pipe/mask.pipe';

import { SweetAlert2Module } from '@toverux/ngx-sweetalert2';
import { MemberUploadComponent } from './member-upload/member-upload.component';

export const members_routes = [
  { path: '', redirectTo: 'manage-members', pathMatch: 'full'},
  { path: 'manage-members', component: ManageMembersComponent, data: { breadcrumb: 'Manage Members' } },
  { path: ':member_id/view', component: ViewMemberComponent, data: { breadcrumb: ' Member Details' } },
  { path: 'manage', component: MemberInvestmentsComponent, data: { breadcrumb: 'Investment Settings' } },
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(members_routes),
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    ModalModule.forRoot(),
    TabsModule.forRoot(),
    NgbModule,
    SweetAlert2Module

  ],
  declarations: [
    MemberAccountOfficerComponent,
    ManageMembersComponent, 
    ViewMemberComponent, 
    MemberInvestmentsComponent, 
    MemberContributionsComponent,
    MemberLoanRequestComponent,
    MemberDeductionsComponent,
    MemberWithdrawalsComponent,
    MemberUploadComponent,
    MemberTransactionComponent,
    // MaskPipe,
  ],
  providers: [MembersService]
})
export class MembershipModule { }
