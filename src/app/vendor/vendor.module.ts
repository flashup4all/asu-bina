import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabsModule } from 'ngx-bootstrap/tabs';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProfileComponent } from './user-account/profile/profile.component';
import { VendorRoutingModule } from './vendor-routing.module';
import { ManageVendorComponent } from './settings/manage-vendor/manage-vendor.component';
import { VendorService } from './vendor.service';
import { ModalModule } from 'ngx-bootstrap';

@NgModule({
  imports: [
    CommonModule,
    VendorRoutingModule,
    TabsModule,
    FormsModule,
    ReactiveFormsModule,
    ModalModule.forRoot(),
    NgbModule.forRoot(),
  ],
  declarations: [
  	ManageVendorComponent,
    ProfileComponent
  ],
  providers:[
  	VendorService
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],

})
export class VendorModule { }
