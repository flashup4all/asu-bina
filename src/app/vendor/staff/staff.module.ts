import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { ModalModule } from 'ngx-bootstrap';
import { ManageStaffComponent } from './manage-staff/manage-staff.component';
import { StaffService } from './staff.service';
import { StaffRoutingModule } from './staff-routing.module';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    StaffRoutingModule,
    ModalModule.forRoot(),
     FormsModule, ReactiveFormsModule,
     TabsModule.forRoot(),
     SharedModule,
  ],
  declarations: [
  	ManageStaffComponent,
  ],
  providers:[
  	StaffService
  ]
})
export class StaffModule { }
