<template>
  <div class="security-container">
    <div class="header">
      <button class="back-btn" @click="goBackToJSExamples">
        <i class="back-icon">🏠</i>
        <span>返回案例列表</span>
      </button>
      <h1>第4期：安全问题</h1>
    </div>

    <div class="case-description">
      <h2>问题描述</h2>
      <p>JavaScript 前端常见的安全问题，包括 XSS、CSRF、敏感数据暴露、开放重定向等。</p>
    </div>

    <div class="case-content">
      <div class="demo-section">
        <h2>演示</h2>

        <div class="demo-buttons">
          <button @click="testXssVulnerability" class="btn danger">
            测试 XSS 漏洞
          </button>
          <button @click="testCsrfVulnerability" class="btn danger">
            测试 CSRF 漏洞
          </button>
          <button @click="testSecureCode" class="btn success">
            测试安全代码
          </button>
        </div>

        <div class="result-section" v-if="result">
          <h3>结果</h3>
          <div class="result-card" :class="result.status">
            <div class="result-item">
              <strong>状态：</strong>{{ result.status }}
            </div>
            <div class="result-item">
              <strong>消息：</strong>{{ result.message }}
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
          <button @click="clearConsole" class="btn secondary">
            清空控制台
          </button>
        </div>
      </div>

      <div class="code-section">
        <h2>代码分析</h2>

        <div class="code-tabs">
          <div class="tab">
            <button
              v-for="tab in ['error', 'fixed']"
              :key="tab"
              @click="activeTab = tab"
              :class="{ active: activeTab === tab }"
            >
              {{ tab === 'error' ? '❌ 问题代码' : '✅ 修复代码' }}
            </button>
          </div>

          <div class="code-content" v-show="activeTab === 'error'">
            <pre><code v-html="highlightCode(errorCode)"></code></pre>
          </div>

          <div class="code-content" v-show="activeTab === 'fixed'">
            <pre><code v-html="highlightCode(fixedCode)"></code></pre>
          </div>
        </div>
      </div>

      <div class="security-tips">
        <h2>安全提示</h2>
        <div class="tips-grid">
          <div class="tip-item">
            <div class="tip-icon">🛡️</div>
            <div class="tip-content">
              <h3>输入验证</h3>
              <p>对所有用户输入进行严格验证，避免恶意代码注入</p>
            </div>
          </div>
          <div class="tip-item">
            <div class="tip-icon">🔒</div>
            <div class="tip-content">
              <h3>数据加密</h3>
              <p>敏感数据传输和存储时使用加密</p>
            </div>
          </div>
          <div class="tip-item">
            <div class="tip-icon">🚫</div>
            <div class="tip-content">
              <h3>XSS 防护</h3>
              <p>使用 HTML 转义，避免直接插入 HTML</p>
            </div>
          </div>
          <div class="tip-item">
            <div class="tip-icon">🔐</div>
            <div class="tip-content">
              <h3>CSRF 防护</h3>
              <p>使用 CSRF Token，验证请求来源</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from '../../api/api'

export default {
  name: 'SecurityExample',
  data() {
    return {
      result: null,
      consoleLogs: [],
      activeTab: 'error',
      errorCode: `// XSS 漏洞示例
function vulnerableXss() {
  const userInput = document.getElementById('userInput').value;
  document.getElementById('output').innerHTML = userInput;
}`,
      fixedCode: `// 修复 XSS 漏洞
function secureXss() {
  const userInput = document.getElementById('userInput').value;
  document.getElementById('output').textContent = userInput;
}`
    }
  },
  methods: {
    goBack() {
      this.$router.push('/')
    },
    log(message, type = 'info') {
      const timestamp = new Date().toLocaleTimeString()
      const logEntry = `[${timestamp}] ${type.toUpperCase()}: ${message}`
      this.consoleLogs.push(logEntry)
      if (this.consoleLogs.length > 50) {
        this.consoleLogs.shift()
      }
    },
    clearConsole() {
      this.consoleLogs = []
    },
    clearResult() {
      this.result = null
    },
    async testXssVulnerability() {
      try {
        this.clearResult()
        this.clearConsole()
        this.log('开始测试 XSS 漏洞...')
        const response = await api.jsExamples.security.testXssVulnerability()
        this.result = response
        this.log('XSS 漏洞测试完成', response.status)
      } catch (error) {
        this.result = { status: 'error', message: error.message }
        this.log('操作失败: ' + error.message, 'error')
      }
    },
    async testCsrfVulnerability() {
      try {
        this.clearResult()
        this.clearConsole()
        this.log('开始测试 CSRF 漏洞...')
        const response = await api.jsExamples.security.testCsrfVulnerability()
        this.result = response
        this.log('CSRF 漏洞测试完成', response.status)
      } catch (error) {
        this.result = { status: 'error', message: error.message }
        this.log('操作失败: ' + error.message, 'error')
      }
    },
    async testSecureCode() {
      try {
        this.clearResult()
        this.clearConsole()
        this.log('开始测试安全代码...')
        const response = await api.jsExamples.security.testSecureCode()
        this.result = response
        this.log('安全代码测试完成', response.status)
      } catch (error) {
        this.result = { status: 'error', message: error.message }
        this.log('操作失败: ' + error.message, 'error')
      }
    }
  }
}
</script>

<style scoped>
/* 只保留组件特有的样式，通用样式已移至 common.css */
.security-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.tip-icon {
  font-size: 24px;
  margin-right: 15px;
  flex-shrink: 0;
}

.tip-content {
  flex: 1;
}

.tip-content h3 {
  margin: 0 0 5px 0;
  color: #333;
}

.tip-content p {
  margin: 0;
  color: #666;
  font-size: 14px;
}
</style>