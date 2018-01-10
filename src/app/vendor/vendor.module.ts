import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabsModule } from 'ngx-bootstrap/tabs';
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
  ],
  declarations: [
  	ManageVendorComponent,
    ProfileComponent
  ],
  providers:[
  	VendorService
  ]
})
export class VendorModule { }
