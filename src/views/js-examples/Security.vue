<template>
  <div class="security-container">
    <h1>第4期：安全问题 - XSS 和 CSRF 等前端安全漏洞</h1>
    
    <div class="case-description">
      <h2>问题描述</h2>
      <p>前端常见的安全漏洞包括 XSS（跨站脚本攻击）、CSRF（跨站请求伪造）、敏感数据暴露、开放重定向等，这些问题可能导致用户数据泄露、账户被盗等严重后果。</p>
    </div>
    
    <div class="case-content">
      <div class="demo-section">
        <h2>演示</h2>
        
        <div class="demo-buttons">
          <button @click="testXssVulnerability" class="btn btn-danger">
            测试 XSS 漏洞
          </button>
          <button @click="testSensitiveDataExposure" class="btn btn-danger">
            测试敏感数据暴露
          </button>
          <button @click="testCsrfVulnerability" class="btn btn-danger">
            测试 CSRF 漏洞
          </button>
          <button @click="testOpenRedirect" class="btn btn-danger">
            测试开放重定向
          </button>
          <button @click="testPreventXSS" class="btn btn-success">
            测试防止 XSS
          </button>
          <button @click="testSecureDataStorage" class="btn btn-success">
            测试安全数据存储
          </button>
          <button @click="testPreventCSRF" class="btn btn-success">
            测试防止 CSRF
          </button>
          <button @click="testPreventOpenRedirect" class="btn btn-success">
            测试防止开放重定向
          </button>
        </div>
        
        <div class="result-section" v-if="result">
          <h3>结果</h3>
          <div class="result-card" :class="result.status === 'success' ? 'success' : 'error'">
            <div class="result-item">
              <strong>状态：</strong>{{ result.status === 'success' ? '成功' : '失败' }}
            </div>
            <div class="result-item">
              <strong>消息：</strong>{{ result.message }}
            </div>
            <div class="result-item" v-if="result.detail">
              <strong>详情：</strong>{{ result.detail }}
            </div>
          </div>
        </div>
        
        <div class="security-tips">
          <h3>安全提示</h3>
          <div class="tips-grid">
            <div class="tip-item">
              <i class="fas fa-shield-alt"></i>
              <p>永远不要信任用户输入</p>
            </div>
            <div class="tip-item">
              <i class="fas fa-lock"></i>
              <p>使用 HTTPS 保护数据传输</p>
            </div>
            <div class="tip-item">
              <i class="fas fa-user-shield"></i>
              <p>实施内容安全策略 (CSP)</p>
            </div>
            <div class="tip-item">
              <i class="fas fa-key"></i>
              <p>使用 CSRF token 保护表单</p>
            </div>
          </div>
        </div>
        
        <div class="console-section">
          <h3>控制台输出</h3>
          <div class="console">
            <div v-for="(log, index) in consoleLogs" :key="index" class="log-item">
              {{ log }}
            </div>
          </div>
          <button @click="clearConsole" class="btn btn-secondary">
            清空控制台
          </button>
        </div>
      </div>
      
      <div class="code-section">
        <h2>代码分析</h2>
        
        <div class="code-tabs">
          <div class="tab">
            <button @click="activeTab = 'error'" :class="{ active: activeTab === 'error' }">
              错误代码
            </button>
            <button @click="activeTab = 'fixed'" :class="{ active: activeTab === 'fixed' }">
              正确代码
            </button>
          </div>
          
          <div class="code-content" v-show="activeTab === 'error'">
            <pre><code>{{ errorCode }}</code></pre>
          </div>
          
          <div class="code-content" v-show="activeTab === 'fixed'">
            <pre><code>{{ fixedCode }}</code></pre>
          </div>
        </div>
      </div>
      
      <div class="solution-section">
        <h2>解决方案</h2>
        <ul>
          <li><strong>防止 XSS：</strong>转义用户输入，使用 innerText 或 createTextNode</li>
          <li><strong>防止 CSRF：</strong>使用 CSRF token，验证来源</li>
          <li><strong>敏感数据：</strong>不存储敏感信息在前端，使用加密</li>
          <li><strong>开放重定向：</strong>验证重定向 URL，限制域名</li>
          <li><strong>内容安全策略：</strong>设置 CSP 头部</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { badSecurityExample, goodSecurityExample } from '../../examples/SecurityExample';

export default {
  name: 'SecurityExample',
  data() {
    return {
      result: null,
      consoleLogs: [],
      activeTab: 'error',
      errorCode: `// XSS 攻击 - 未转义用户输入
function xssVulnerability() {
  const userInput = '<script>alert("XSS Attack!")</script>';
  
  // 错误：直接插入 HTML，允许执行恶意脚本
  const container = document.createElement('div');
  container.innerHTML = `User input: ${userInput}`; // 危险！
  document.body.appendChild(container);
}

// 敏感数据暴露
function sensitiveDataExposure() {
  // 错误：在前端存储敏感信息
  localStorage.setItem('apiKey', 'secret_api_key_12345');
  sessionStorage.setItem('userToken', 'bearer_token_67890');
  
  // 错误：在 URL 中传递敏感信息
  const userId = 12345;
  const url = `https://example.com/api/user/${userId}?token=secret_token`;
  console.log('Sensitive URL:', url);
}

// CSRF 漏洞
function csrfVulnerability() {
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
}

// 未验证的重定向
function openRedirect() {
  // 错误：直接重定向到用户提供的 URL
  function redirectTo(url) {
    window.location.href = url; // 危险！
  }
  
  // 攻击者可以构造恶意 URL
  const userInputUrl = 'https://malicious.com';
  // redirectTo(userInputUrl); // 取消注释以测试
}

// 不安全的直接对象引用
function insecureDirectObjectReference() {
  // 错误：直接使用用户输入的 ID
  function getUserData(userId) {
    // 假设这是一个 API 调用
    return fetch(`https://example.com/api/users/${userId}`)
      .then(response => response.json());
  }
  
  // 攻击者可以尝试访问其他用户的数据
  const userInputId = '123'; // 攻击者输入的 ID
  getUserData(userInputId);
}`,
      fixedCode: `// 防止 XSS - 转义用户输入
function preventXSS() {
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
}

// 安全存储敏感信息
function secureDataStorage() {
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
}

// 防止 CSRF
function preventCSRF() {
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
}

// 安全的对象引用
function secureObjectReference() {
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
}

// 防止开放重定向
function preventOpenRedirect() {
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
}

// 内容安全策略 (CSP)
function contentSecurityPolicy() {
  // 正确：使用 CSP 防止 XSS
  const cspHeader = "default-src 'self'; script-src 'self' 'nonce-random123'; style-src 'self' 'unsafe-inline';";
  
  // 在服务器端设置 CSP 头部
  // response.setHeader('Content-Security-Policy', cspHeader);
  
  console.log('Content Security Policy:', cspHeader);
}