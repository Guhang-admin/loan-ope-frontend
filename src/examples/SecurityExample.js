/**
 * 第4期：安全问题 - XSS 和 CSRF 等前端安全漏洞
 * 问题：前端常见的安全漏洞和防护措施
 */

// 错误代码
export const badSecurityExample = {
  // XSS 攻击 - 未转义用户输入
  xssVulnerability: function() {
    const userInput = '<script>alert("XSS Attack!")</script>';
    
    // 错误：直接插入 HTML，允许执行恶意脚本
    const container = document.createElement('div');
    container.innerHTML = `User input: ${userInput}`; // 危险！
    document.body.appendChild(container);
    
    return 'XSS vulnerability demonstrated';
  },

  // 敏感数据暴露
  sensitiveDataExposure: function() {
    // 错误：在前端存储敏感信息
    localStorage.setItem('apiKey', 'secret_api_key_12345');
    sessionStorage.setItem('userToken', 'bearer_token_67890');
    
    // 错误：在 URL 中传递敏感信息
    const userId = 12345;
    const url = `https://example.com/api/user/${userId}?token=secret_token`;
    console.log('Sensitive URL:', url);
    
    return 'Sensitive data exposed';
  },

  // CSRF 漏洞
  csrfVulnerability: function() {
    // 错误：直接发起 POST 请求，没有 CSRF 保护
    function submitForm() {
      fetch('https://example.com/api/transfer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          amount: 1000,
          toAccount: 'attacker_account'
        })
      });
    }
    
    return 'CSRF vulnerability demonstrated';
  },

  // 不安全的直接对象引用
  insecureDirectObjectReference: function() {
    // 错误：直接使用用户输入的 ID
    function getUserData(userId) {
      // 假设这是一个 API 调用
      return fetch(`https://example.com/api/users/${userId}`)
        .then(response => response.json());
    }
    
    // 攻击者可以尝试访问其他用户的数据
    const userInputId = '123'; // 攻击者输入的 ID
    getUserData(userInputId);
    
    return 'Insecure direct object reference demonstrated';
  },

  // 未验证的重定向
  openRedirect: function() {
    // 错误：直接重定向到用户提供的 URL
    function redirectTo(url) {
      window.location.href = url; // 危险！
    }
    
    // 攻击者可以构造恶意 URL
    const userInputUrl = 'https://malicious.com';
    // redirectTo(userInputUrl); // 取消注释以测试
    
    return 'Open redirect vulnerability demonstrated';
  }
};

// 正确代码
export const goodSecurityExample = {
  // 防止 XSS - 转义用户输入
  preventXSS: function() {
    const userInput = '<script>alert("XSS Attack!")</script>';
    
    // 正确：转义 HTML 字符
    const container = document.createElement('div');
    const textNode = document.createTextNode(`User input: ${userInput}`);
    container.appendChild(textNode);
    document.body.appendChild(container);
    
    // 或者使用 innerText
    const container2 = document.createElement('div');
    container2.innerText = `User input (innerText): ${userInput}`;
    document.body.appendChild(container2);
    
    return 'XSS prevented with proper escaping';
  },

  // 安全存储敏感信息
  secureDataStorage: function() {
    // 正确：不存储敏感信息在前端
    // 可以使用 HttpOnly cookie 存储会话信息
    
    // 对于需要在前端存储的数据，使用加密
    function encryptData(data) {
      // 简单的加密示例（实际应用中应使用更安全的方法）
      return btoa(JSON.stringify(data));
    }
    
    function decryptData(encrypted) {
      return JSON.parse(atob(encrypted));
    }
    
    const userData = { userId: 123, role: 'user' };
    const encrypted = encryptData(userData);
    localStorage.setItem('userData', encrypted);
    
    return 'Sensitive data securely stored';
  },

  // 防止 CSRF
  preventCSRF: function() {
    // 正确：使用 CSRF token
    function getCSRFToken() {
      // 从 cookie 或 meta 标签获取
      return document.querySelector('meta[name="csrf-token"]')?.content || '';
    }
    
    function submitForm() {
      fetch('https://example.com/api/transfer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': getCSRFToken() // 添加 CSRF token
        },
        credentials: 'same-origin', // 包含 cookie
        body: JSON.stringify({
          amount: 1000,
          toAccount: 'recipient_account'
        })
      });
    }
    
    return 'CSRF prevented with token';
  },

  // 安全的对象引用
  secureObjectReference: function() {
    // 正确：验证用户权限
    function getUserData(userId) {
      // 首先验证用户是否有权限访问该用户数据
      return fetch(`https://example.com/api/users/${userId}`, {
        headers: {
          'Authorization': 'Bearer ' + getAuthToken()
        }
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Unauthorized');
        }
        return response.json();
      });
    }
    
    function getAuthToken() {
      // 从安全的存储中获取 token
      return sessionStorage.getItem('authToken') || '';
    }
    
    return 'Secure object reference implemented';
  },

  // 防止开放重定向
  preventOpenRedirect: function() {
    // 正确：验证重定向 URL
    function safeRedirect(url) {
      const allowedDomains = ['example.com', 'trusted-domain.com'];
      
      try {
        const urlObj = new URL(url);
        const domain = urlObj.hostname;
        
        if (allowedDomains.includes(domain)) {
          window.location.href = url;
        } else {
          console.error('Unauthorized redirect domain');
          // 重定向到默认页面
          window.location.href = '/';
        }
      } catch (error) {
        console.error('Invalid URL:', error);
        window.location.href = '/';
      }
    }
    
    return 'Open redirect prevented with domain validation';
  },

  // 内容安全策略 (CSP)
  contentSecurityPolicy: function() {
    // 正确：使用 CSP 防止 XSS
    const cspHeader = "default-src 'self'; script-src 'self' 'nonce-random123'; style-src 'self' 'unsafe-inline';";
    
    // 在服务器端设置 CSP 头部
    // response.setHeader('Content-Security-Policy', cspHeader);
    
    console.log('Content Security Policy:', cspHeader);
    return 'Content Security Policy implemented';
  }
};