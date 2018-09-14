import React from 'react';
import DashboardPage from 'views/Dashboard/Dashboard.jsx';
import Users from 'views/Users/Users.jsx';
import UserShow from 'views/Users/UserShow.jsx';
import Settings from 'views/Settings/Settings.jsx';
import Invitations from 'views/Invitations/Invitations.jsx';
import Authors from 'views/Authors/Authors.jsx';
import Books from 'views/Books/Books.jsx';
import Readers from 'views/Readers/Readers.jsx';
import Categories from 'views/Categories/Categories.jsx';
import Posts from 'views/Posts/Posts.jsx';

import {
  Dashboard,
  Person,
  People,
  Fingerprint,
  LibraryBooks,
  Bookmark,
  Email,
  Web,
} from '@material-ui/icons';

const dashboardRoutes = [
  {
    path: '/dashboard',
    pathRegex: /^\/dashboard$/,
    sidebarName: 'Inicio',
    navbarName: 'Inicio',
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
    path: '/emails',
    pathRegex: /^\/emails$/,
    sidebarName: 'Invitaciones',
    navbarName: 'Invitaciones',
    icon: Email,
    component: Invitations
  },
  {
    path: '/authors',
    pathRegex: /^\/authors$/,
    sidebarName: 'Autores',
    navbarName: 'Autores',
    icon: People,
    component: Authors
  },
  {
    path: '/categories',
    pathRegex: /^\/categories$/,
    sidebarName: 'Categorías',
    navbarName: 'Categorías',
    icon: Bookmark,
    component: Categories
  },
  {
    path: '/books',
    pathRegex: /^\/books$/,
    sidebarName: 'Libros',
    navbarName: 'Libros',
    icon: LibraryBooks,
    component: Books
  },
  {
    path: '/posts',
    pathRegex: /^\/news$/,
    sidebarName: 'Mensajes',
    navbarName: 'Mensajes',
    icon: Web,
    component: Posts
  },
  {
    path: '/settings',
    pathRegex: /^\/settings\/\d*$/,
    navbarName: 'Configuración',
    noSidebar: true,
    component: Settings
  },
  {
    path: '/readers/:id',
    pathRegex: /^\/readers\/\d*$/,
    navbarName: 'Contenido',
    noSidebar: true,
    component: Readers
  },
  { redirect: true, path: '/', pathRegex: /^\/$/, to: '/login', navbarName: 'Redirect' }
];

export default dashboardRoutes;
