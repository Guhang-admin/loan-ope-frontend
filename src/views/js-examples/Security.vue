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
          <button @click="testXssVulnerability" class="btn btn-danger">
            测试 XSS 漏洞
          </button>
          <button @click="testCsrfVulnerability" class="btn btn-danger">
            测试 CSRF 漏洞
          </button>
          <button @click="testSecureCode" class="btn btn-success">
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
import { exampleMixin } from '../../utils/exampleMixin'

export default {
  name: 'SecurityExample',
  mixins: [exampleMixin],
  data() {
    return {
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
    async testXssVulnerability() {
      try {
        this.clearResult()
        this.clearConsole()
        this.log('开始测试 XSS 漏洞...')
        
        // 模拟 XSS 漏洞测试
        const result = await new Promise((resolve) => {
          const startTime = Date.now()
          
          // 模拟 XSS 攻击
          const maliciousInput = '<script>alert("XSS Attack!")<\/script>'
          
          // 模拟不安全的处理
          function vulnerableXss(input) {
            // 这里模拟直接插入 HTML 的危险行为
            return { 
              vulnerable: true, 
              input: input, 
              message: 'XSS 漏洞存在：输入未经过滤直接插入 HTML'
            }
          }
          
          const testResult = vulnerableXss(maliciousInput)
          
          setTimeout(() => {
            resolve({
              status: 'warning',
              message: testResult.message,
              time: Date.now() - startTime,
              details: testResult
            })
          }, 500)
        })
        
        this.result = result
        this.log('XSS 漏洞测试完成', result.status)
        this.log(`详情: ${result.details.message}`)
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
        
        // 模拟 CSRF 漏洞测试
        const result = await new Promise((resolve) => {
          const startTime = Date.now()
          
          // 模拟 CSRF 攻击场景
          function vulnerableCsrf() {
            // 这里模拟没有 CSRF Token 保护的请求
            return { 
              vulnerable: true, 
              message: 'CSRF 漏洞存在：请求未验证来源'
            }
          }
          
          const testResult = vulnerableCsrf()
          
          setTimeout(() => {
            resolve({
              status: 'warning',
              message: testResult.message,
              time: Date.now() - startTime,
              details: testResult
            })
          }, 500)
        })
        
        this.result = result
        this.log('CSRF 漏洞测试完成', result.status)
        this.log(`详情: ${result.details.message}`)
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
        
        // 模拟安全代码测试
        const result = await new Promise((resolve) => {
          const startTime = Date.now()
          
          // 模拟安全的处理方式
          function secureXss(input) {
            // 这里模拟安全的处理方式
            return { 
              secure: true, 
              message: 'XSS 防护：使用 textContent 替代 innerHTML'
            }
          }
          
          function secureCsrf() {
            // 这里模拟带有 CSRF Token 保护的请求
            return { 
              secure: true, 
              message: 'CSRF 防护：使用 CSRF Token 验证请求'
            }
          }
          
          const xssResult = secureXss('<script>alert("XSS Attack!")<\/script>')
          const csrfResult = secureCsrf()
          
          setTimeout(() => {
            resolve({
              status: 'success',
              message: '安全代码测试通过',
              time: Date.now() - startTime,
              details: {
                xss: xssResult,
                csrf: csrfResult
              }
            })
          }, 500)
        })
        
        this.result = result
        this.log('安全代码测试完成', result.status)
        this.log(`XSS 防护: ${result.details.xss.message}`)
        this.log(`CSRF 防护: ${result.details.csrf.message}`)
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