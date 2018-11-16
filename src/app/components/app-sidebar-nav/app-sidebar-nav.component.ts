import { Component, ElementRef, Input, OnInit, Renderer2 } from '@angular/core';
import { LocalService } from '../../storage/local.service';

// Import navigation elements
import { navigation } from './../../_nav';

@Component({
  selector: 'app-sidebar-nav',
  templateUrl: './app-sidebar-nav.component.html'

  /*template: `
    <nav class="sidebar-nav" style="width:250px !important;">
      <ul class="nav" style="width:250px !important;">
        <ng-template ngFor let-navitem [ngForOf]="navigation">
          <li *ngIf="isDivider(navitem)" class="nav-divider"></li>
          <ng-template [ngIf]="isTitle(navitem)">
            <app-sidebar-nav-title [title]='navitem'></app-sidebar-nav-title>
          </ng-template>
          <ng-template [ngIf]="!isDivider(navitem)&&!isTitle(navitem)">
            <app-sidebar-nav-item [item]='navitem'></app-sidebar-nav-item>
          </ng-template>
        </ng-template>
      </ul>
    </nav>`*/
})
export class AppSidebarNavComponent {

  public navigation = navigation;
  vendor
  user
  public isDivider(item) {
    return item.divider ? true : false
  }

  public isTitle(item) {
    return item.title ? true : false
  }

  constructor(
    private localService : LocalService,

    ) {
      this.vendor = JSON.parse(this.localService.getVendor());
        this.user = JSON.parse(this.localService.getUser());
    //console.log(this.navigation)
     this.navigation = this.getNav()
     }

  getNav()
  {
    let group;
    if(this.vendor.vendor_type_id == 1 || this.vendor.vendor_type_id == 4)
    {
      if(this.user.role_id == 2)
      {
        group = [
        {
          name: 'Dashboard',
          url: '/dashboard',
          icon: 'icon-speedometer',
          badge: {
            variant: 'info',
            text: 'NEW'
          }
        },
        {
          name: 'Members Activity',
          url: '/members',
          icon: 'icon-star',
          children: [
            {
              name: 'Manage Members',
              url: '/app/members/manage-members',
              icon: 'icon-star'
            },
            {
              name: 'Manage Widthdrawals',
              url: '/app/widthdrawals',
              icon: 'icon-star'
            },
            {
              name: 'Member Contributions',
              url: '/app/contributions/member-contribution-plan',
              icon: 'icon-star'
            },
            {
              name: 'Contribution History',
              url: '/app/contributions',
              icon: 'icon-star'
            },
            {
              name: 'Member Investments',
              url: '/app/investment/member-investments',
              icon: 'icon-star'
            },
            {
              name: 'Investments History',
              url: '/app/investment/history',
              icon: 'icon-star'
            },
            /*{
              name: 'Manage Target Savings',
              url: '/app/target-savings',
              icon: 'icon-star'
            },*/
            {
              name: 'Manage Repayments',
              url: '/app/deductions',
              icon: 'icon-star'
            },
            {
              name: 'Manage Loan Request',
              url: '/app/loan-request',
              icon: 'icon-star'
            },
          ]
        },
        {
          title: true,
          name: 'Manage'
        },
        {
          name: 'Settings',
          url: '/settings',
          icon: 'icon-star',
          children: [
            {
              name: 'Coorperative Profile',
              url: '/app/manage-vendor',
              icon: 'icon-star'
            },
            {
              name: 'Staff Settings',
              url: '/app/staff',
              icon: 'icon-star'
            },
            {
              name: 'Notification Settings',
              url: '/app/notifications',
              icon: 'icon-star'
            },
            {
              name: 'Loan Settings',
              url: '/app/loan/settings',
              icon: 'icon-star'
            },
            {
              name: 'Contribution Settings',
              url: '/app/contributions/contribution-types',
              icon: 'icon-star'
            },
            {
              name: 'Investment Settings',
              url: '/app/investment/manage',
              icon: 'icon-star'
            },
            {
              name: 'Repayment Settings',
              url: '/app/deductions/deductions-types',
              icon: 'icon-star'
            },
            {
              name: 'Member Form Settings',
              url: '/app/form-settings/members',
              icon: 'icon-star'
            }
          ]
        },
        {
          name: 'Activity Log',
          url: '/app/activity-log',
          icon: 'icon-speedometer',
          // badge: {
          //   variant: 'info',
          //   text: 'NEW'
          // }
        },
      ]
      }else if(this.user.role_id == 3)
      {
        group = [
        {
          name: 'Dashboard',
          url: '/dashboard',
          icon: 'icon-speedometer',
          /*badge: {
            variant: 'info',
            text: 'NEW'
          }*/
        },
        {
          name: 'Manage Members',
          url: '/app/members/manage-members',
          icon: 'icon-star'
        },
        {
          name: 'Manage Widthdrawals',
          url: '/app/widthdrawals',
          icon: 'icon-star'
        },
        {
          name: 'Member Contributions',
          url: '/app/contributions/member-contribution-plan',
          icon: 'icon-star'
        },
        {
          name: 'Contribution History',
          url: '/app/contributions',
          icon: 'icon-star'
        },
        {
          name: 'Member Investments',
          url: '/app/investment/member-investments',
          icon: 'icon-star'
        },
        {
          // name: 'Investments History',
          url: '/app/investment/history',
          icon: 'icon-star'
        },
        {
          name: 'Manage Target Savings',
          url: '/app/target-savings',
          icon: 'icon-star'
        },
        {
          name: 'Manage Repayments',
          url: '/app/deductions',
          icon: 'icon-star'
        },
        {
          name: 'Manage Loan Request',
          url: '/app/loan-request',
          icon: 'icon-star'
        },
        /*{
          name: 'Members Activity',
          url: '/members',
          icon: 'icon-star',
          children: [
            {
              name: 'Manage Members',
              url: '/app/members/manage-members',
              icon: 'icon-star'
            },
            {
              name: 'Manage Widthdrawals',
              url: '/app/widthdrawals',
              icon: 'icon-star'
            },
            {
              name: 'Manage Contributions',
              url: '/app/contributions',
              icon: 'icon-star'
            },
            {
              name: 'Manage Investments',
              url: '/app/investment/history',
              icon: 'icon-star'
            },
            {
              name: 'Manage Target Savings',
              url: '/app/target-savings',
              icon: 'icon-star'
            },
            {
              name: 'Manage Repayments',
              url: '/app/deductions',
              icon: 'icon-star'
            },
            {
              name: 'Manage Loan Request',
              url: '/app/loan-request',
              icon: 'icon-star'
            },
          ]
        },*/
  ]
        
      }else if(this.user.role_id == 4)
      {
        group = [
       /* {
          name: 'Dashboard',
          url: '/dashboard',
          icon: 'icon-speedometer',
          badge: {
            variant: 'info',
            text: 'NEW'
          }
        },*/
        {
          name: 'Manage Members',
          url: '/app/members/manage-members',
          icon: 'icon-star'
        },
        /*{
          name: 'Members Activity',
          url: '/members',
          icon: 'icon-star',
          children: [
            {
              name: 'Manage Members',
              url: '/app/members/manage-members',
              icon: 'icon-star'
            },
            {
              name: 'Manage Widthdrawals',
              url: '/app/widthdrawals',
              icon: 'icon-star'
            },
            {
              name: 'Manage Contributions',
              url: '/app/contributions',
              icon: 'icon-star'
            },
            {
              name: 'Manage Investments',
              url: '/app/investment/history',
              icon: 'icon-star'
            },
            {
              name: 'Manage Target Savings',
              url: '/app/target-savings',
              icon: 'icon-star'
            },
            {
              name: 'Manage Repayments',
              url: '/app/deductions',
              icon: 'icon-star'
            },
            {
              name: 'Manage Loan Request',
              url: '/app/loan-request',
              icon: 'icon-star'
            },
          ]
        }*/
        ]
      }
    }
    if(this.vendor.vendor_type_id == 3)
    {
      if(this.user.role_id == 2)
      {
        group = [
        {
          name: 'Dashboard',
          url: '/dashboard',
          icon: 'icon-speedometer',
          /*badge: {
            variant: 'info',
            text: 'NEW'
          }*/
        },
        {
          name: 'Coorperative Activity',
          url: '/members',
          icon: 'icon-star',
          children: [
            {
              name: 'Manage Vendors',
              url: '/app/finance/manage-coorps',
              icon: 'icon-star'
            },
            {
              name: 'Manage Widthdrawals',
              url: '/app/widthdrawals',
              icon: 'icon-star'
            },
            {
              name: 'Member Contributions',
              url: '/app/contributions/member-contribution-plan',
              icon: 'icon-star'
            },
            {
              name: 'Contribution History',
              url: '/app/contributions',
              icon: 'icon-star'
            },
            {
              name: 'Member Investments',
              url: '/app/investment/member-investments',
              icon: 'icon-star'
            },
            {
              name: 'Investments History',
              url: '/app/investment/history',
              icon: 'icon-star'
            },
            {
              name: 'Manage Target Savings',
              url: '/app/target-savings',
              icon: 'icon-star'
            },
            {
              name: 'Manage Repayments',
              url: '/app/deductions',
              icon: 'icon-star'
            },
            {
              name: 'Manage Loan Request',
              url: '/app/loan-request',
              icon: 'icon-star'
            },
          ]
        },
        {
          title: true,
          name: 'Manage'
        },
        {
          name: 'Settings',
          url: '/settings',
          icon: 'icon-star',
          children: [
            {
              name: 'Profile',
              url: '/app/manage-vendor',
              icon: 'icon-star'
            },
            {
              name: 'Staff Settings',
              url: '/app/staff',
              icon: 'icon-star'
            },
            {
              name: 'Loan Settings',
              url: '/app/loan/settings',
              icon: 'icon-star'
            },
            {
              name: 'Contribution Settings',
              url: '/app/contributions/contribution-types',
              icon: 'icon-star'
            },
            {
              name: 'Investment Settings',
              url: '/app/investment/manage',
              icon: 'icon-star'
            },
            {
              name: 'Repayment Settings',
              url: '/app/deductions/deductions-types',
              icon: 'icon-star'
            }
          ]
        },
      ]
      }else if(this.user.role_id == 3)
      {
        group = [
        {
          name: 'Dashboard',
          url: '/dashboard',
          icon: 'icon-speedometer',
          /*badge: {
            variant: 'info',
            text: 'NEW'
          }*/
        },
        {
          name: 'Manage Vendors',
          url: '/app/vendor/manage-coorps',
          icon: 'icon-star'
        },
        {
          name: 'Manage Widthdrawals',
          url: '/app/widthdrawals',
          icon: 'icon-star'
        },
        {
          name: 'Member Contributions',
          url: '/app/contributions/member-contribution-plan',
          icon: 'icon-star'
        },
        {
          name: 'Contribution History',
          url: '/app/contributions',
          icon: 'icon-star'
        },
        {
          name: 'Member Investments',
          url: '/app/investment/member-investments',
          icon: 'icon-star'
        },
        {
          name: 'Investments History',
          url: '/app/investment/history',
          icon: 'icon-star'
        },
        {
          name: 'Manage Target Savings',
          url: '/app/target-savings',
          icon: 'icon-star'
        },
        {
          name: 'Manage Repayments',
          url: '/app/deductions',
          icon: 'icon-star'
        },
        {
          name: 'Manage Loan Request',
          url: '/app/loan-request',
          icon: 'icon-star'
        },
  ]
        
      }else if(this.user.role_id == 4)
      {
        group = [
        {
          name: 'Manage Coorperatives',
          url: '/app/vendor/manage-coorps',
          icon: 'icon-star'
        },
        ]
      }
    }

    
    
    /*for(let i=0; i < nav.length; i++){
      if(this.user.user_level == 'Admin')
      {
        group.push(nav[i])
      }else if(this.user.user_level == 'Manager' && this.user.module_id == 1){
        if(nav[i].name == "Booking Manager")
        group.push(nav[i])

      }
    }*/
      //console.log(group)
      return group;
  }

}

import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar-nav-item',
  template: `
    <li *ngIf="!isDropdown(); else dropdown" [ngClass]="hasClass() ? 'nav-item ' + item.class : 'nav-item'">
      <app-sidebar-nav-link [link]='item'></app-sidebar-nav-link>
    </li>
    <ng-template #dropdown>
      <li [ngClass]="hasClass() ? 'nav-item nav-dropdown ' + item.class : 'nav-item nav-dropdown'"
          [class.open]="isActive()"
          routerLinkActive="open"
          appNavDropdown>
        <app-sidebar-nav-dropdown [link]='item'></app-sidebar-nav-dropdown>
      </li>
    </ng-template>
    `
})
export class AppSidebarNavItemComponent {
  @Input() item: any;

  public hasClass() {
    return this.item.class ? true : false
  }

  public isDropdown() {
    return this.item.children ? true : false
  }

  public thisUrl() {
    return this.item.url
  }

  public isActive() {
    return this.router.isActive(this.thisUrl(), false)
  }

  constructor( private router: Router )  { }

}

@Component({
  selector: 'app-sidebar-nav-link',
  template: `
    <a *ngIf="!isExternalLink(); else external"
      [ngClass]="hasVariant() ? 'nav-link nav-link-' + link.variant : 'nav-link'"
      routerLinkActive="active"
      [routerLink]="[link.url]">
      <!-- <i *ngIf="isIcon()" class="{{ link.icon }}"></i> -->
      {{ link.name }}
      <span *ngIf="isBadge()" [ngClass]="'badge badge-' + link.badge.variant">{{ link.badge.text }}</span>
    </a>
    <ng-template #external>
      <a [ngClass]="hasVariant() ? 'nav-link nav-link-' + link.variant : 'nav-link'" href="{{link.url}}">
        <i *ngIf="isIcon()" class="{{ link.icon }}"></i>
        {{ link.name }}
        <span *ngIf="isBadge()" [ngClass]="'badge badge-' + link.badge.variant">{{ link.badge.text }}</span>
      </a>
    </ng-template>
  `
})
export class AppSidebarNavLinkComponent {
  @Input() link: any;

  public hasVariant() {
    return this.link.variant ? true : false
  }

  public isBadge() {
    return this.link.badge ? true : false
  }

  public isExternalLink() {
    return this.link.url.substring(0, 4) === 'http' ? true : false
  }

  public isIcon() {
    return this.link.icon ? true : false
  }

  constructor() { }
}

@Component({
  selector: 'app-sidebar-nav-dropdown',
  template: `
    <a class="nav-link nav-dropdown-toggle" appNavDropdownToggle>
      <i *ngIf="isIcon()" class="{{ link.icon }}"></i>
      {{ link.name }}
      <span *ngIf="isBadge()" [ngClass]="'badge badge-' + link.badge.variant">{{ link.badge.text }}</span>
    </a>
    <ul class="nav-dropdown-items" style="pointer:cursor;">
      <ng-template ngFor let-child [ngForOf]="link.children">
        <app-sidebar-nav-item [item]='child'></app-sidebar-nav-item>
      </ng-template>
    </ul>
  `
})
export class AppSidebarNavDropdownComponent {
  @Input() link: any;

  public isBadge() {
    return this.link.badge ? true : false
  }

  public isIcon() {
    return this.link.icon ? true : false
  }

  constructor() { }
}

@Component({
  selector: 'app-sidebar-nav-title',
  template: ''
})
export class AppSidebarNavTitleComponent implements OnInit {
  @Input() title: any;

  constructor(private el: ElementRef, private renderer: Renderer2) { }

  ngOnInit() {
    const nativeElement: HTMLElement = this.el.nativeElement;
    const li = this.renderer.createElement('li');
    const name = this.renderer.createText(this.title.name);

    this.renderer.addClass(li, 'nav-title');

    if ( this.title.class ) {
      const classes = this.title.class;
      this.renderer.addClass(li, classes);
    }

    if ( this.title.wrapper ) {
      const wrapper = this.renderer.createElement(this.title.wrapper.element);

      this.renderer.appendChild(wrapper, name);
      this.renderer.appendChild(li, wrapper);
    } else {
      this.renderer.appendChild(li, name);
    }
    this.renderer.appendChild(nativeElement, li)
  }
}

export const APP_SIDEBAR_NAV = [
  AppSidebarNavComponent,
  AppSidebarNavDropdownComponent,
  AppSidebarNavItemComponent,
  AppSidebarNavLinkComponent,
  AppSidebarNavTitleComponent
];
