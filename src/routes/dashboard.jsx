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
import Assessments from 'views/Assessments/Assessments.jsx';
import Notifications from 'views/Notifications/Notifications.jsx';
import Emails from 'views/Emails/Emails.jsx';
import Organizations from 'views/Organizations/Organizations.jsx';
import Questions from 'views/Questions/Questions.jsx';

import {
  Dashboard,
  Person,
  People,
  Fingerprint,
  LibraryBooks,
  Bookmark,
  Email,
  Web,
  List,
  PersonAdd,
  NotificationsActive,
  Work,
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
    path: '/invitations',
    pathRegex: /^\/invitations$/,
    sidebarName: 'Invitaciones',
    navbarName: 'Invitaciones',
    icon: PersonAdd,
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
    pathRegex: /^\/posts$/,
    sidebarName: 'Mensajes',
    navbarName: 'Mensajes',
    icon: Web,
    component: Posts
  },
  {
    path: '/assessments',
    pathRegex: /^\/assessments$/,
    sidebarName: 'Exámenes',
    navbarName: 'Exámenes',
    icon: List,
    component: Assessments
  },
  {
    path: '/emails',
    pathRegex: /^\/emails$/,
    sidebarName: 'Emails Masivos',
    navbarName: 'Emails Masivos',
    icon: Email,
    component: Emails
  },
  {
    path: '/notifications',
    pathRegex: /^\/notifications$/,
    sidebarName: 'Push Notifications',
    navbarName: 'Push Notifications',
    icon: NotificationsActive,
    component: Notifications
  },
  {
    path: '/organizations',
    pathRegex: /^\/organizations$/,
    sidebarName: 'Organizaciones',
    navbarName: 'Organizaciones',
    icon: Work,
    component: Organizations
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
  {
    path: '/questions/:id',
    pathRegex: /^\/questions\/\d*$/,
    navbarName: 'Preguntas',
    noSidebar: true,
    component: Questions
  },
  { redirect: true, path: '/', pathRegex: /^\/$/, to: '/login', navbarName: 'Redirect' }
];

export default dashboardRoutes;
