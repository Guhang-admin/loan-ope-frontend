// API service for centralized API calls

const API_BASE_URL = 'http://localhost:8081/api';

// Helper function to handle API responses
const handleResponse = async (response) => {
  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }
  return response.json();
};

// Common headers
const getHeaders = () => {
  return {
    'Content-Type': 'application/json'
  };
};

// API methods
const api = {
  // Authentication
  login: (credentials) => {
    return fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(credentials)
    }).then(handleResponse);
  },

  // Files
  uploadFile: (formData) => {
    return fetch(`${API_BASE_URL}/upload`, {
      method: 'POST',
      body: formData
    }).then(handleResponse);
  },

  // Statistics
  getStats: () => {
    return fetch(`${API_BASE_URL}/stats`)
      .then(handleResponse);
  },

  // Users
  getUsers: () => {
    return fetch(`${API_BASE_URL}/users`)
      .then(handleResponse);
  },
  
  updateCreditScore: (userId, score) => {
    return fetch(`${API_BASE_URL}/users/${userId}/credit-score?creditScore=${score}`, {
      method: 'PUT'
    }).then(handleResponse);
  },

  // Loans
  getLoans: () => {
    return fetch(`${API_BASE_URL}/loans`)
      .then(handleResponse);
  },

  applyLoan: (loanData) => {
    return fetch(`${API_BASE_URL}/loans`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(loanData)
    }).then(handleResponse);
  },
  
  getUserLoans: (userId) => {
    return fetch(`${API_BASE_URL}/loans/user/${userId}`)
      .then(handleResponse);
  },

  // Repayment plans
  getRepaymentPlans: () => {
    return fetch(`${API_BASE_URL}/repayment-plans`)
      .then(handleResponse);
  },
  
  getLoanRepaymentPlans: (loanId) => {
    return fetch(`${API_BASE_URL}/repayment-plans/loan/${loanId}`)
      .then(handleResponse);
  },
  
  makePayment: (planId) => {
    return fetch(`${API_BASE_URL}/repayment-plans/${planId}/pay`, {
      method: 'PUT'
    }).then(handleResponse);
  },

  // Repayment records
  getRepaymentRecords: () => {
    return fetch(`${API_BASE_URL}/repayment-records`)
      .then(handleResponse);
  },
  
  getLoanRepaymentRecords: (loanId) => {
    return fetch(`${API_BASE_URL}/repayment-records/loan/${loanId}`)
      .then(handleResponse);
  }
};

export default api;
