import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SigninComponent } from './auth/signin/signin.component';
import { AuthGuardService } from './shared/guards/index';
// Import Containers
import {
  FullLayoutComponent,
  SimpleLayoutComponent
} from './containers';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: '',
    canActivate: [AuthGuardService],
    component: FullLayoutComponent,
    data: {
      title: 'Home'
    },
    children: [
      {
        path: 'dashboard',
        loadChildren: './vendor/dashboard/dashboard.module#DashboardModule'
      },
      {
        path: 'app',
        loadChildren: './vendor/vendor.module#VendorModule'
      }
    ]
  },
  {
    path: 'auth',
    canActivate: [AuthGuardService],
    component: SimpleLayoutComponent,
    data: {
      title: 'Auth'
    },
    children: [
      {
        path: '',
        component: SigninComponent,
      }
    ]
  }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
