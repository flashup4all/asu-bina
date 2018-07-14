import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from '../../shared/shared.module';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap';
import { TabsModule } from 'ngx-bootstrap/tabs';

import { ManageContributionRoutingModule } from './manage-contribution-routing.module';
import { ManageContributionComponent } from './manage-contribution.component';
import { ContributionService } from './contribution.service';
import { CollectionsComponent } from './collections/collections.component';
import { RunContributionComponent } from './run-contribution/run-contribution.component';
import { ContributionTypeComponent } from './contribution-type/contribution-type.component';
import { ContributionPlanComponent } from './contribution-plan/contribution-plan.component';

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
  ],
  declarations: [
    ManageContributionComponent, 
    CollectionsComponent, 
    RunContributionComponent, 
    ContributionTypeComponent,
    ContributionPlanComponent
  ],
  providers: [ContributionService]
})
export class ManageContributionModule { }
