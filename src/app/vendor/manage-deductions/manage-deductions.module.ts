import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { SharedModule } from '../../shared/shared.module';
import { SweetAlert2Module } from '@toverux/ngx-sweetalert2';

import { ManageDeductionsRoutingModule } from './manage-deductions-routing.module';
import { ManageDeductionsComponent } from './manage-deductions.component';
import { DeductionsService } from './deductions.service';
import { RunDeductionsComponent } from './run-deductions/run-deductions.component';
import { DeductionRepaymentTypesComponent } from './deduction-repayment-types/deduction-repayment-types.component';


@NgModule({
  imports: [
    CommonModule,
    ManageDeductionsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    ModalModule.forRoot(),
    TabsModule,
    NgbModule,
    SharedModule,
    SweetAlert2Module
  ],
  declarations: [ManageDeductionsComponent, RunDeductionsComponent, DeductionRepaymentTypesComponent],
  providers: [DeductionsService]
})
export class ManageDeductionsModule { }
