import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap';
import { TabsModule } from 'ngx-bootstrap/tabs';

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
    TabsModule
  ],
  declarations: [ManageWidthdrawalsComponent],
  providers: [WidthdrawalsService]
})
export class ManageWidthdrawalsModule { }
