import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ManageVendorComponent } from './settings/manage-vendor/manage-vendor.component';
import { ProfileComponent } from './user-account/profile/profile.component';
const routes: Routes = [
	{
		path: '',
	    data: {
	      title: 'App'
	    },
	    children: [
	      {
	        path: 'manage-vendor',
	        component: ManageVendorComponent,
	        data: {
	          title: 'Buttons'
	        }
	      },
	      {
	        path: 'profile',
	        component: ProfileComponent,
	        data: {
	          title: 'Buttons'
	        }
	      },
	      {
	        path: 'staff',
	        loadChildren: './staff/staff.module#StaffModule',
	      },
	      {
	        path: 'form-settings',
	        loadChildren: './form-settings/form-settings.module#FormSettingsModule',
	      },
	      {
	        path: 'loan',
	        loadChildren: './loans/loans.module#LoansModule',
	      },
	      {
	        path: 'members',
	        loadChildren: './membership/membership.module#MembershipModule',
	      },
	      {
	        path: 'widthdrawals',
	        loadChildren: './manage-widthdrawals/manage-widthdrawals.module#ManageWidthdrawalsModule',
	      },
	      {
	        path: 'deductions',
	        loadChildren: './manage-deductions/manage-deductions.module#ManageDeductionsModule',
	      },
	      {
	        path: 'contributions',
	        loadChildren: './manage-contribution/manage-contribution.module#ManageContributionModule',
	      },
	      {
	        path: 'loan-request',
	        loadChildren: './manage-loanrequest/manage-loanrequest.module#ManageLoanrequestModule',
	      },
	      {
	        path: 'message-center',
	        loadChildren: './message-center/message-center.module#MessageCenterModule',
	      },
		]
	}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VendorRoutingModule { }
