import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { ModalModule } from 'ngx-bootstrap';
import { ManageStaffComponent } from './manage-staff/manage-staff.component';
import { ViewStaffComponent } from './view-staff/view-staff.component';
import { AccountOfficerComponent } from './account-officer/account-officer.component';
import { StaffService } from './staff.service';
import { StaffRoutingModule } from './staff-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { SweetAlert2Module } from '@toverux/ngx-sweetalert2';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  imports: [
    CommonModule,
    StaffRoutingModule,
    ModalModule.forRoot(),
     FormsModule, ReactiveFormsModule,
     TabsModule.forRoot(),
     SharedModule,
     SweetAlert2Module,
     NgbModule,
  ],
  declarations: [
  	ManageStaffComponent,
    ViewStaffComponent,
    AccountOfficerComponent,
  ],
  providers:[
  	StaffService
  ]
})
export class StaffModule { }
