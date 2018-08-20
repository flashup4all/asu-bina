import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { SharedModule } from '../shared/shared.module';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProfileComponent } from './user-account/profile/profile.component';
import { VendorRoutingModule } from './vendor-routing.module';
import { ManageVendorComponent } from './settings/manage-vendor/manage-vendor.component';
import { SmsSettingsComponent } from './settings/sms-settings/sms-settings.component';
import { VendorService } from './vendor.service';
import { ModalModule } from 'ngx-bootstrap';
import { ActivityLogComponent } from './settings/activity-log/activity-log.component';

@NgModule({
  imports: [
    CommonModule,
    VendorRoutingModule,
    TabsModule,
    FormsModule,
    ReactiveFormsModule,
    ModalModule.forRoot(),
    NgbModule,
    SharedModule,
  ],
  declarations: [
  	ManageVendorComponent,
    ProfileComponent,
    SmsSettingsComponent,
    ActivityLogComponent
  ],
  providers:[
  	VendorService
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],

})
export class VendorModule { }
