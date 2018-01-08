import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap';

import { LoansRoutingModule } from './loans-routing.module';
import { LoanSettingsComponent } from './loan-settings/loan-settings.component';
import { LoanSettingsService } from './loan-settings/loan-settings.service';


@NgModule({
  imports: [
    CommonModule,
    LoansRoutingModule,
    TabsModule,
    FormsModule,
    ModalModule.forRoot(),
    ReactiveFormsModule
  ],
  declarations: [
  LoanSettingsComponent
  ],
  providers: [LoanSettingsService]
})
export class LoansModule { }
