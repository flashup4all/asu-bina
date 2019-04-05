import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from '../../shared/shared.module';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { SweetAlert2Module } from '@toverux/ngx-sweetalert2';

import { ManageContributionRoutingModule } from './manage-contribution-routing.module';
import { ManageContributionComponent } from './manage-contribution.component';
import { ContributionService } from './contribution.service';
import { CollectionsComponent } from './collections/collections.component';
import { RunContributionComponent } from './run-contribution/run-contribution.component';
import { ContributionTypeComponent } from './contribution-type/contribution-type.component';
import { ContributionPlanComponent } from './contribution-plan/contribution-plan.component';
import { MemberContributionPlanComponent } from './member-contribution-plan/member-contribution-plan.component';
import { UploadMembersToPlanComponent } from './upload-members-to-plan/upload-members-to-plan.component';

@NgModule({
  imports: [
    CommonModule,
    ManageContributionRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    ModalModule.forRoot(),
    TabsModule,
    NgbModule,
    SharedModule,
    SweetAlert2Module,
  ],
  declarations: [
    ManageContributionComponent, 
    CollectionsComponent, 
    RunContributionComponent, 
    ContributionTypeComponent,
    ContributionPlanComponent,
    MemberContributionPlanComponent,
    UploadMembersToPlanComponent
  ],
  providers: [ContributionService]
})
export class ManageContributionModule { }
