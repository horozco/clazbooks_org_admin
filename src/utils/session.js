import client from './client.js';
import URLS from '../constants/urls.js';
import lscache from 'lscache';

export const login = (params) => {
  return client.post(URLS.LOGIN, params).then((response)=>{
    setAccessToken(response.data.organization_admin.token);
    setSuperAdminInfo(response.data)
    setOrganization(response.data.organization_admin.organization);
    setManagedOrganization(response.data.organization_admin.organization.id);
    return Promise.resolve(response);
  });
}

// Token
export function setAccessToken(authToken, rememberMe=false) {
  const expireIn = rememberMe ? 10080 : 720
  lscache.set('AUTH_TOKEN_KEY', authToken, expireIn);
}

export function getAccessToken() {
  return lscache.get('AUTH_TOKEN_KEY'); //localStorage.getItem('lscache-AUTH_TOKEN_KEY');
}

export function clearAccessToken() {
  lscache.remove('AUTH_TOKEN_KEY');
}

// Organization
export function setOrganization(organizationData) {
  lscache.set('CURRENT_ORGANIZATION', organizationData);
}

export function getOrganization() {
  return lscache.get('CURRENT_ORGANIZATION') || {name: ''};
}

export function clearOrganization() {
  lscache.remove('CURRENT_ORGANIZATION');
}

// SuperAdmin

export function setSuperAdminInfo(data) {
  var organizations = [data.organization_admin.organization];
  organizations = organizations.concat(data.organization_admin.organizations);
  if (data.organization_admin.super_admin) {
    lscache.set('MANAGED_ORGANIZATIONS', organizations);
    lscache.set('SUPER_ADMIN', true);
  }
}

export function setManagedOrganization(organization_id) {
  lscache.set('MANAGED_ORGANIZATION', organization_id);
}

export function isSuperAdmin() {
  return lscache.get('SUPER_ADMIN') || false;
}

export function managedOrganizations() {
  return lscache.get('MANAGED_ORGANIZATIONS') || [];
}

export function managedOrganization() {
  return lscache.get('MANAGED_ORGANIZATION') || '';
}

export function clearSuperAdmin() {
  lscache.remove('MANAGED_ORGANIZATIONS');
  lscache.remove('SUPER_ADMIN');
  lscache.remove('MANAGED_ORGANIZATION');
}


// session
export function getSession(){
  return {
    organization_admin: {
      token: getAccessToken(),
      organization: getOrganization()
    },
    isSuperAdmin: isSuperAdmin(),
    managedOrganizations: managedOrganizations(),
  }
};

export function clearSession(){
  clearAccessToken();
  clearOrganization();
  clearSuperAdmin();
}

export function loggedIn() {
  return getAccessToken() ? true : false;
}
