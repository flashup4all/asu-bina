import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';

import { HttpEvent, HttpErrorResponse, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {HttpModule, Http} from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import{ ToastModule } from 'ng2-toastr/ng2-toastr';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from './shared/shared.module';
import { SweetAlert2Module } from '@toverux/ngx-sweetalert2';
import { DomainService } from './shared/services/index';
import { DeviceDetectorModule } from 'ngx-device-detector';
import { NgIdleKeepaliveModule } from '@ng-idle/keepalive'; 

import { AuthRoutesResolver } from './shared/resolvers/index';
import { AuthService } from './auth/auth.service';
import { AppComponent } from './app.component';
import { LocalService } from './storage/local.service';
import { AuthGuardService } from './shared/guards/index';
import { handleErrors } from './shared/helpers/index';
import { MembersService } from './vendor/membership/members.service';
import { FormService } from './vendor/form-settings/form.service';
import { LoanSettingsService } from './vendor/loans/loan-settings/loan-settings.service';
import { SettingsService } from './vendor/settings/settings/settings.service';
import { LoanRequestService } from './vendor/manage-loanrequest/loan-request.service';
import { MessageService } from './vendor/message-center/message.service';
import { ContributionService } from './vendor/manage-contribution/contribution.service';
import { DeductionsService } from './vendor/manage-deductions/deductions.service';
import { WidthdrawalsService } from './vendor/manage-widthdrawals/widthdrawals.service';
import { TargetSavingsService } from './vendor/target-savings/target-savings.service';
import { InvestmentService } from './vendor/manage-investments/investment.service';
import { TableExportService } from './shared/services/index';


// Import containers
import {
  FullLayoutComponent,
  SimpleLayoutComponent
} from './containers';

const APP_CONTAINERS = [
  FullLayoutComponent,
  SimpleLayoutComponent
]

// Import components
import {
  AppAsideComponent,
  AppBreadcrumbsComponent,
  AppFooterComponent,
  AppHeaderComponent,
  AppSidebarComponent,
  AppSidebarFooterComponent,
  AppSidebarFormComponent,
  AppSidebarHeaderComponent,
  AppSidebarMinimizerComponent,
  APP_SIDEBAR_NAV
} from './components';

const APP_COMPONENTS = [
  AppAsideComponent,
  AppBreadcrumbsComponent,
  AppFooterComponent,
  AppHeaderComponent,
  AppSidebarComponent,
  AppSidebarFooterComponent,
  AppSidebarFormComponent,
  AppSidebarHeaderComponent,
  AppSidebarMinimizerComponent,
  APP_SIDEBAR_NAV
]

// Import directives
import {
  AsideToggleDirective,
  NAV_DROPDOWN_DIRECTIVES,
  ReplaceDirective,
  SIDEBAR_TOGGLE_DIRECTIVES
} from './directives';

const APP_DIRECTIVES = [
  AsideToggleDirective,
  NAV_DROPDOWN_DIRECTIVES,
  ReplaceDirective,
  SIDEBAR_TOGGLE_DIRECTIVES
]

// Import routing module
import { AppRoutingModule } from './app.routing';

// Import 3rd party components
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { ChartsModule } from 'ng2-charts/ng2-charts';
import { SigninComponent } from './auth/signin/signin.component';
@NgModule({
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    HttpModule,
    BrowserAnimationsModule,
    BsDropdownModule.forRoot(),
    TabsModule.forRoot(),
    ToastModule.forRoot(),
    ChartsModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule.forRoot(),
    SharedModule,
    SweetAlert2Module.forRoot(),
    DeviceDetectorModule.forRoot(),
    NgIdleKeepaliveModule.forRoot(),

  ],
  declarations: [
    AppComponent,
    ...APP_CONTAINERS,
    ...APP_COMPONENTS,
    ...APP_DIRECTIVES,
    SigninComponent
  ],
  providers: [
  {
    provide: LocationStrategy,
    useClass: HashLocationStrategy
  },
  AuthRoutesResolver,
  AuthService,
  LocalService, 
  AuthGuardService, 
  MembersService, 
  FormService,
  LoanSettingsService,
  SettingsService,
  LoanRequestService,
  MessageService,
  ContributionService,
  WidthdrawalsService,
  DeductionsService,
  TargetSavingsService,
  handleErrors,
  TableExportService,
  InvestmentService,
  DomainService
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
