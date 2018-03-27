import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { MembershipRoutingModule } from './membership-routing.module';
import { ManageMembersComponent } from './manage-members/manage-members.component';
import { ViewMemberComponent } from './view-member/view-member.component';
import { MembersService } from './members.service';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
@NgModule({
  imports: [
    CommonModule,
    MembershipRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    ModalModule.forRoot(),
    TabsModule.forRoot(),
    NgbModule

  ],
  declarations: [ManageMembersComponent, ViewMemberComponent],
  providers: [MembersService]
})
export class MembershipModule { }
