import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { SweetAlert2Module } from '@toverux/ngx-sweetalert2';
import { ModalModule } from 'ngx-bootstrap';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { BsDropdownModule } from 'ngx-bootstrap';
import { ManageLoanrequestRoutingModule } from './manage-loanrequest-routing.module';
import { ManageLoanrequestComponent } from './manage-loanrequest.component';
import { LoanRequestService } from './loan-request.service';
import { ViewRequestHistoryComponent } from './view-request-history/view-request-history.component';
import { LoanCalculatorComponent } from '../../loan-calculator/loan-calculator.component';

@NgModule({
  imports: [
    CommonModule,
    ManageLoanrequestRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    ModalModule.forRoot(),
    BsDropdownModule.forRoot(),
    TabsModule,
    SharedModule,
    SweetAlert2Module
  ],
  declarations: [ManageLoanrequestComponent, ViewRequestHistoryComponent, LoanCalculatorComponent],
  providers: [LoanRequestService]
})
export class ManageLoanrequestModule { }
