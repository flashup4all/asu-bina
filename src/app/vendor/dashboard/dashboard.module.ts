import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { BsDropdownModule } from 'ngx-bootstrap';

import { ModalModule } from 'ngx-bootstrap';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { DashboardService } from './dashboard.service';
@NgModule({
  imports: [
    CommonModule,
    DashboardRoutingModule,
    FormsModule, 
    ReactiveFormsModule,
    ModalModule.forRoot(),
    TabsModule,
    BsDropdownModule.forRoot()
  ],
  declarations: [DashboardComponent],
  providers: [DashboardService]
})
export class DashboardModule { }
