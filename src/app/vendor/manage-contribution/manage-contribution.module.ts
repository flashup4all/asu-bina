import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap';
import { TabsModule } from 'ngx-bootstrap/tabs';

import { ManageContributionRoutingModule } from './manage-contribution-routing.module';
import { ManageContributionComponent } from './manage-contribution.component';
import { ContributionService } from './contribution.service';
import { CollectionsComponent } from './collections/collections.component';
import { RunContributionComponent } from './run-contribution/run-contribution.component';
@NgModule({
  imports: [
    CommonModule,
    ManageContributionRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    ModalModule.forRoot(),
    TabsModule
  ],
  declarations: [ManageContributionComponent, CollectionsComponent, RunContributionComponent],
  providers: [ContributionService]
})
export class ManageContributionModule { }
