import React from 'react';
import DashboardPage from 'views/Dashboard/Dashboard.jsx';
import Users from 'views/Users/Users.jsx';
import UserShow from 'views/Users/UserShow.jsx';

import {
  Dashboard,
  Person,
  Fingerprint,
  LibraryBooks,
  Email
} from '@material-ui/icons';

const dashboardRoutes = [
  {
    path: '/dashboard',
    pathRegex: /^\/dashboard$/,
    sidebarName: 'Dashboard',
    navbarName: 'Dashboard',
    icon: Dashboard,
    component: DashboardPage
  },
  {
    path: '/users/:id',
    pathRegex: /^\/users\/\d*$/,
    navbarName: 'User Show',
    noSidebar: true,
    component: UserShow
  },
  {
    path: '/users',
    pathRegex: /^\/users$/,
    sidebarName: 'Usuarios',
    navbarName: 'Usuarios',
    icon: Person,
    component: Users
  },
  {
    path: '/codes',
    pathRegex: /^\/codes$/,
    sidebarName: 'Códigos',
    navbarName: 'Códigos',
    icon: Fingerprint,
    component: () => <h1>Códigos</h1>
  },
  {
    path: '/books',
    pathRegex: /^\/books$/,
    sidebarName: 'Contenido',
    navbarName: 'Contenido',
    icon: LibraryBooks,
    component: () => <h1>Contenido</h1>
  },
  {
    path: '/emails',
    pathRegex: /^\/emails$/,
    sidebarName: 'Emails',
    navbarName: 'Enviar Emails',
    icon: Email,
    component: () => <h1>Enviar Emails</h1>
  },
  { redirect: true, path: '/', pathRegex: /^\/$/, to: '/dashboard', navbarName: 'Redirect' }
];

export default dashboardRoutes;
