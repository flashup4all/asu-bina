import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { ModalModule } from 'ngx-bootstrap';

import { FormSettingsRoutingModule } from './form-settings-routing.module';
import { MembersFormComponent } from './members-form/members-form.component';

@NgModule({
  imports: [
    CommonModule,
    FormSettingsRoutingModule,
     ModalModule.forRoot(),
     FormsModule, ReactiveFormsModule,
     TabsModule.forRoot()
  ],
  declarations: [
  	MembersFormComponent,
  ]
})
export class FormSettingsModule { }
