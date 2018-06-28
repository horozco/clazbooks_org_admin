import React from 'react';
import DashboardPage from 'views/Dashboard/Dashboard.jsx';
import Users from 'views/Users/Users.jsx';
import UserShow from 'views/Users/UserShow.jsx';
import Settings from 'views/Settings/Settings.jsx';
import Codes from 'views/Codes/Codes.jsx';

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
    navbarName: 'Información del usuario',
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
    component: Codes
  },
  {
    path: '/emails',
    pathRegex: /^\/emails$/,
    sidebarName: 'Enviar Códigos',
    navbarName: 'Enviar Códigos',
    icon: Email,
    component: () => <h1>Coming soon...</h1>
  },
  {
    path: '/books',
    pathRegex: /^\/books$/,
    sidebarName: 'Contenido',
    navbarName: 'Contenido',
    icon: LibraryBooks,
    component: () => <h1>Coming soon...</h1>
  },
  {
    path: '/settings',
    pathRegex: /^\/settings\/\d*$/,
    navbarName: 'Configuración',
    noSidebar: true,
    component: Settings
  },
  { redirect: true, path: '/', pathRegex: /^\/$/, to: '/login', navbarName: 'Redirect' }
];

export default dashboardRoutes;
