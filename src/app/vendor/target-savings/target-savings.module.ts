import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap';
import { TabsModule } from 'ngx-bootstrap/tabs';

import { TargetSavingsRoutingModule } from './target-savings-routing.module';
import { TargetSavingsComponent } from './target-savings.component';
import { TargetSavingsService } from './target-savings.service';

@NgModule({
  imports: [
    CommonModule,
    TargetSavingsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    ModalModule.forRoot(),
    TabsModule
  ],
  declarations: [TargetSavingsComponent],
  providers: [
  	TargetSavingsService
  ]
})
export class TargetSavingsModule { }
