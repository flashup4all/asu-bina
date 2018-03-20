import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule } from '@angular/forms';
//import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import { SettingsRoutingModule } from './settings-routing.module';
import { SettingsComponent } from './settings.component';
//import { UiSwitchModule } from '../../../../../node_modules/angular2-ui-switch/src';
//import { UiSwitchModule } from 'ngx-ui-switch/src'
//import { UiSwitchModule } from 'angular2-ui-switch';
import { SettingsService } from './settings.service';

@NgModule({
  imports: [
    CommonModule,
    SettingsRoutingModule,
    //UiSwitchModule,
    FormsModule,
    ReactiveFormsModule,
     //NgbModule,
  ],
  declarations: [SettingsComponent],
  providers: [ SettingsService ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],

})
export class SettingsModule { }
