import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap';
import { TabsModule } from 'ngx-bootstrap/tabs';

import { SharedModule } from '../../shared/shared.module';
import { SweetAlert2Module } from '@toverux/ngx-sweetalert2';

import { ManageWidthdrawalsRoutingModule } from './manage-widthdrawals-routing.module';
import { ManageWidthdrawalsComponent } from './manage-widthdrawals.component';
import { WidthdrawalsService } from './widthdrawals.service';

@NgModule({
  imports: [
    CommonModule,
    ManageWidthdrawalsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    ModalModule.forRoot(),
    TabsModule,
    SharedModule,
    SweetAlert2Module,
    NgbModule,
  ],
  declarations: [ManageWidthdrawalsComponent],
  providers: [WidthdrawalsService]
})
export class ManageWidthdrawalsModule { }
