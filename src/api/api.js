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
  },

  // 案例演示接口
  examples: {
    // 第1期：神秘超时
    timeout: {
      simulateLeak: () => {
        return fetch(`${API_BASE_URL}/examples/timeout/leak`)
          .then(handleResponse);
      },
      fixedLeak: () => {
        return fetch(`${API_BASE_URL}/examples/timeout/fixed`)
          .then(handleResponse);
      },
      reset: () => {
        return fetch(`${API_BASE_URL}/examples/timeout/reset`, {
          method: 'POST'
        }).then(handleResponse);
      }
    },
    
    // 第2期：数据不一致
    dataconsistency: {
      resetAccounts: () => {
        return fetch(`${API_BASE_URL}/examples/dataconsistency/reset`, {
          method: 'POST'
        }).then(handleResponse);
      },
      addBalance: (userId, amount) => {
        return fetch(`${API_BASE_URL}/examples/dataconsistency/add-balance?userId=${userId}&amount=${amount}`, {
          method: 'POST'
        }).then(handleResponse);
      },
      getAccounts: () => {
        return fetch(`${API_BASE_URL}/examples/dataconsistency/accounts`)
          .then(handleResponse);
      },
      transfer: (fromUserId, toUserId, amount) => {
        return fetch(`${API_BASE_URL}/examples/dataconsistency/transfer?fromUserId=${fromUserId}&toUserId=${toUserId}&amount=${amount}`, {
          method: 'POST'
        }).then(handleResponse);
      },
      transferFixed: (fromUserId, toUserId, amount) => {
        return fetch(`${API_BASE_URL}/examples/dataconsistency/transfer-fixed?fromUserId=${fromUserId}&toUserId=${toUserId}&amount=${amount}`, {
          method: 'POST'
        }).then(handleResponse);
      }
    },
    
    // 第3期：内存异常
    memoryleak: {
      addToCache: (id, data) => {
        return fetch(`${API_BASE_URL}/examples/memoryleak/add`, {
          method: 'POST',
          headers: getHeaders(),
          body: JSON.stringify({ id, data })
        }).then(handleResponse);
      },
      addMultipleToCache: (count) => {
        return fetch(`${API_BASE_URL}/examples/memoryleak/add-multiple?count=${count}`, {
          method: 'POST'
        }).then(handleResponse);
      },
      getCacheStatus: () => {
        return fetch(`${API_BASE_URL}/examples/memoryleak/status`)
          .then(handleResponse);
      },
      clearCache: () => {
        return fetch(`${API_BASE_URL}/examples/memoryleak/clear`, {
          method: 'POST'
        }).then(handleResponse);
      }
    },
    
    // 第4期：并发陷阱
    concurrency: {
      processOrder: (quantity) => {
        return fetch(`${API_BASE_URL}/examples/concurrency/order?quantity=${quantity}`, {
          method: 'POST'
        }).then(handleResponse);
      },
      processOrderFixed: (quantity) => {
        return fetch(`${API_BASE_URL}/examples/concurrency/order-fixed?quantity=${quantity}`, {
          method: 'POST'
        }).then(handleResponse);
      },
      getInventory: () => {
        return fetch(`${API_BASE_URL}/examples/concurrency/inventory`)
          .then(handleResponse);
      },
      resetInventory: () => {
        return fetch(`${API_BASE_URL}/examples/concurrency/reset`, {
          method: 'POST'
        }).then(handleResponse);
      },
      simulateDeadlock: () => {
        return fetch(`${API_BASE_URL}/examples/concurrency/deadlock`, {
          method: 'POST'
        }).then(handleResponse);
      }
    }
  }
};

export default api;
