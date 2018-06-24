import client from './client.js';
import URLS from '../constants/urls.js';
import lscache from 'lscache';

export const login = (params) => {
  return client.post(URLS.LOGIN, params).then((response)=>{
    setAccessToken(response.data.organization_admin.token);
    setOrganization(response.data.organization_admin.organization);
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

// session
export function getSession(){
  return {
    organization_admin: {
      token: getAccessToken(),
      organization: getOrganization()
    }
  }
};

export function clearSession(){
  clearAccessToken();
  clearOrganization();
}

export function loggedIn() {
  return getAccessToken() ? true : false;
}
