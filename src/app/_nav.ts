export const navigation = [
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
    title: true,
    name: 'Manage'
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
        name: 'Manage Contributions',
        url: '/app/contributions',
        icon: 'icon-star'
      },
      {
        name: 'Manage Target Savings',
        url: '/app/target-savings',
        icon: 'icon-star'
      },
      {
        name: 'Manage Deductions',
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
        name: 'Member Form Settings',
        url: '/app/form-settings/members',
        icon: 'icon-star'
      }
    ]
  },
  /*{
    name: 'Components',
    url: '/components',
    icon: 'icon-puzzle',
    children: [
      {
        name: 'Buttons',
        url: '/components/buttons',
        icon: 'icon-puzzle'
      },
      {
        name: 'Social Buttons',
        url: '/components/social-buttons',
        icon: 'icon-puzzle'
      },
      {
        name: 'Cards',
        url: '/components/cards',
        icon: 'icon-puzzle'
      },
      {
        name: 'Forms',
        url: '/components/forms',
        icon: 'icon-puzzle'
      },
      {
        name: 'Modals',
        url: '/components/modals',
        icon: 'icon-puzzle'
      },
      {
        name: 'Switches',
        url: '/components/switches',
        icon: 'icon-puzzle'
      },
      {
        name: 'Tables',
        url: '/components/tables',
        icon: 'icon-puzzle'
      },
      {
        name: 'Tabs',
        url: '/components/tabs',
        icon: 'icon-puzzle'
      }
    ]
  },
  {
    name: 'Icons',
    url: '/icons',
    icon: 'icon-star',
    children: [
      {
        name: 'Font Awesome',
        url: '/icons/font-awesome',
        icon: 'icon-star',
        badge: {
          variant: 'secondary',
          text: '4.7'
        }
      },
      {
        name: 'Simple Line Icons',
        url: '/icons/simple-line-icons',
        icon: 'icon-star'
      }
    ]
  },
  {
    name: 'Widgets',
    url: '/widgets',
    icon: 'icon-calculator',
    badge: {
      variant: 'info',
      text: 'NEW'
    }
  },
  {
    name: 'Charts',
    url: '/charts',
    icon: 'icon-pie-chart'
  },*/
  {
    divider: true
  },
  {
    title: true,
    name: 'Extras',
  },
  /*{
    name: 'Pages',
    url: '/pages',
    icon: 'icon-star',
    children: [
      {
        name: 'Login',
        url: '/pages/login',
        icon: 'icon-star'
      },
      {
        name: 'Register',
        url: '/pages/register',
        icon: 'icon-star'
      },
      {
        name: 'Error 404',
        url: '/pages/404',
        icon: 'icon-star'
      },
      {
        name: 'Error 500',
        url: '/pages/500',
        icon: 'icon-star'
      }
    ]
  },*/
  {
    name: 'Message Center',
    url: '/app/message-center',
    icon: 'fa fa-times',
    badge: {
      variant: 'info',
      text: 'NEW'
    }
  },
];
