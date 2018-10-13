import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import { ModalModule } from 'ngx-bootstrap';

import { TabsModule } from 'ngx-bootstrap/tabs';
import { SweetAlert2Module } from '@toverux/ngx-sweetalert2';
import { ReactiveFormsModule, FormsModule} from '@angular/forms';
import { RouterModule } from '@angular/router';
import { InvestmentPlanComponent } from './investment-plan/investment-plan.component';
import { InvestmentHistoryComponent } from './investment-history/investment-history.component';
import { InvestmentService } from './investment.service';
import { ManageMemberInvestmentsComponent } from './member-investments/member-investments.component';

export const investment_routes = [
  { path: '', redirectTo: 'manage', pathMatch: 'full'},
  { path: 'member-investments', component: ManageMemberInvestmentsComponent, data: { breadcrumb: 'Members Investments' } },
  { path: 'manage', component: InvestmentPlanComponent, data: { breadcrumb: 'Investment Settings' } },
  { path: 'history', component: InvestmentHistoryComponent, data: { breadcrumb: 'Investment History' } },
];
@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(investment_routes),
    ReactiveFormsModule,
    NgbModule,
    ModalModule.forRoot(),
    TabsModule,
  	FormsModule,
    SweetAlert2Module
    
  ],
  declarations: [InvestmentPlanComponent, InvestmentHistoryComponent, ManageMemberInvestmentsComponent],
  providers:[ InvestmentService ]
})
export class ManageInvestmentsModule { }
