let BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000'

const URLS = {
  API_URL: `${BASE_URL}/api`,
  LOGIN: `${BASE_URL}/api/organization_admin/login`,
  DASHBOARD: `${BASE_URL}/api/organization_admin/dashboard`,
  USERS: `${BASE_URL}/api/organization_admin/users/`,
  ORGANIZATIONS: `${BASE_URL}/api/organization_admin/organizations/`,
  CODES: `${BASE_URL}/api/organization_admin/codes/`,
  INVITATIONS: `/organization_admin/invitations/`,
  BOOKS: `/organization_admin/books/`,
  AUTHORS: `/organization_admin/authors/`,
  CATEGORIES: `/organization_admin/categories/`,
  READERS: `/organization_admin/new_readers/`,
  POSTS: `/organization_admin/news/`,
}

export default URLS
