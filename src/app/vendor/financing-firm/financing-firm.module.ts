import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap';
import { TabsModule } from 'ngx-bootstrap/tabs';
//import { MembershipRoutingModule } from './membership-routing.module';
import { ManageVendorComponent } from './manage-vendors/manage-vendors.component';
import { VendorInvestmentsComponent } from './vendor-investments/vendor-investments.component';
import { VendorContributionsComponent } from './vendor-contributions/vendor-contributions.component';
import { MembersService } from './members.service';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from '../../shared/shared.module';
import { SweetAlert2Module } from '@toverux/ngx-sweetalert2';

export const members_routes = [
  { path: '', redirectTo: 'manage-members', pathMatch: 'full'},
  { path: 'manage-coorps', component: ManageVendorComponent, data: { breadcrumb: 'Manage Members' } },
  //{ path: ':member_id/view', component: ViewMemberComponent, data: { breadcrumb: ' Member Details' } },
  //{ path: 'manage', component: MemberInvestmentsComponent, data: { breadcrumb: 'Investment Settings' } },
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
  ManageVendorComponent, 
  ///ViewMemberComponent, 
  VendorInvestmentsComponent, 
  VendorContributionsComponent],
  providers: [MembersService]
})
export class FinancingFirmModule { }
