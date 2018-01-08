import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TabsModule } from 'ngx-bootstrap/tabs';

import { ModalModule } from 'ngx-bootstrap';
import { MessageCenterRoutingModule } from './message-center-routing.module';
import { MessageCenterComponent } from './message-center.component';
import { MessageService } from './message.service';

@NgModule({
  imports: [
    CommonModule,
    MessageCenterRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    ModalModule.forRoot(),
    TabsModule
  ],
  declarations: [MessageCenterComponent],
  providers: [MessageService]
})
export class MessageCenterModule { }
