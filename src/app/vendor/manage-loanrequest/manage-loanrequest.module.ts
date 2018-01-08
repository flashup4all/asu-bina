import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { BsDropdownModule } from 'ngx-bootstrap';
import { ManageLoanrequestRoutingModule } from './manage-loanrequest-routing.module';
import { ManageLoanrequestComponent } from './manage-loanrequest.component';
import { LoanRequestService } from './loan-request.service';
import { ViewRequestHistoryComponent } from './view-request-history/view-request-history.component';

@NgModule({
  imports: [
    CommonModule,
    ManageLoanrequestRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    ModalModule.forRoot(),
    BsDropdownModule.forRoot(),
    TabsModule
  ],
  declarations: [ManageLoanrequestComponent, ViewRequestHistoryComponent],
  providers: [LoanRequestService]
})
export class ManageLoanrequestModule { }
