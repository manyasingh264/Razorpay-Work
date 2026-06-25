export const API_ENDPOINTS = {
  REGISTER: '/onboardings/register',
  LOGIN: '/onboardings/login',
  LOGOUT: '/onboardings/logout',
  ASSIGN_ROLE: '/roles/assign',
  EMPLOYEES: '/employees',
  ASSIGN_MANAGER: '/employees/assign',
  REMOVE_ASSIGNMENT: '/employees/assign', // Method is DELETE for removal, POST for assignment
  REIMBURSEMENTS: '/reimbursements',      // GET to list, POST to create, PATCH to update
};
