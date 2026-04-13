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
          <button @click="testSecureXss" class="btn btn-success">
            测试 XSS 安全代码
          </button>
          <button @click="testSecureCsrf" class="btn btn-success">
            测试 CSRF 安全代码
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
}

// CSRF 漏洞示例
function vulnerableCsrfTransfer() {
  // 没有 CSRF Token 保护的转账请求
  fetch('/api/transfer', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
      // 缺少 X-CSRF-Token 头
    },
    body: JSON.stringify({
      toAccount: 'attacker123',
      amount: 5000
    })
  });
}`,
      fixedCode: `// 修复 XSS 漏洞
function secureXss() {
  const userInput = document.getElementById('userInput').value;
  document.getElementById('output').textContent = userInput;
}

// 修复 CSRF 漏洞
function secureCsrfTransfer() {
  // 使用 CSRF Token 保护的转账请求
  fetch('/api/transfer', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRF-Token': getCsrfToken() // 添加 CSRF Token
    },
    body: JSON.stringify({
      toAccount: 'recipient123',
      amount: 5000
    })
  });
}

// 获取 CSRF Token 的函数
function getCsrfToken() {
  return document.querySelector('meta[name="csrf-token"]').getAttribute('content');
}`
    }
  },
  methods: {
    async testXssVulnerability() {
      try {
        this.clearResult()
        this.clearConsole()
        this.log('开始测试 XSS 漏洞...')
        
        // 模拟 XSS 攻击
        const result = await new Promise((resolve) => {
          const startTime = Date.now()
          
          // 模拟 XSS 攻击
          function vulnerableXss() {
            // 这里模拟直接插入 HTML 的危险行为
            // 实际执行 XSS 攻击
            
            // 1. 会话劫持：窃取Cookie
            const cookie = document.cookie || '无'
            
            // 2. 钓鱼攻击：显示虚假登录表单
            const phishingForm = document.createElement('div')
            phishingForm.style.position = 'fixed'
            phishingForm.style.top = '50%'
            phishingForm.style.left = '50%'
            phishingForm.style.transform = 'translate(-50%, -50%)'
            phishingForm.style.background = '#fff'
            phishingForm.style.border = '2px solid #3498db'
            phishingForm.style.borderRadius = '10px'
            phishingForm.style.padding = '30px'
            phishingForm.style.boxShadow = '0 4px 30px rgba(0,0,0,0.3)'
            phishingForm.style.zIndex = '9999'
            phishingForm.style.width = '400px'
            
            phishingForm.innerHTML = `
              <div style="text-align: center;">
                <h3 style="color: #3498db; margin-top: 0;">🔒 账号安全验证</h3>
                <p style="margin: 15px 0; color: #666;">您的账号存在异常登录，需要验证身份</p>
                <form style="text-align: left; margin-top: 20px;">
                  <div style="margin-bottom: 15px;">
                    <label style="display: block; margin-bottom: 5px; font-weight: bold;">用户名</label>
                    <input type="text" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                  </div>
                  <div style="margin-bottom: 20px;">
                    <label style="display: block; margin-bottom: 5px; font-weight: bold;">密码</label>
                    <input type="password" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                  </div>
                  <button type="button" style="background: #3498db; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; width: 100%;">
                    立即验证
                  </button>
                </form>
                <div style="margin-top: 20px; font-size: 12px; color: #999;">
                  <p>⚠️ 此为 XSS 攻击演示，输入的信息会被攻击者窃取</p>
                </div>
                <button style="background: #95a5a6; color: white; border: none; padding: 8px 16px; border-radius: 5px; cursor: pointer; margin-top: 15px;">
                  关闭演示
                </button>
              </div>
            `
            
            document.body.appendChild(phishingForm)
            
            // 3. 网站污损：修改页面标题
            const originalTitle = document.title
            document.title = '⚠️ 网站已被黑客攻击！'
            
            // 4. 恶意重定向：模拟尝试重定向
            const redirectAttempt = setTimeout(() => {
              // 这里只是模拟重定向尝试，不会真的重定向
              console.log('XSS 攻击：尝试重定向到恶意网站')
            }, 3000)
            
            // 5. 键盘记录：模拟记录键盘输入
            let keystrokes = ''
            const keyLogger = (e) => {
              keystrokes += e.key
              console.log('XSS 攻击：记录键盘输入:', keystrokes)
            }
            document.addEventListener('keydown', keyLogger)
            
            // 添加关闭按钮事件
            const buttons = phishingForm.querySelectorAll('button')
            const closeButton = buttons[buttons.length - 1] // 选择最后一个按钮作为关闭按钮
            closeButton.addEventListener('click', function() {
              document.body.removeChild(phishingForm)
              document.title = originalTitle
              clearTimeout(redirectAttempt)
              document.removeEventListener('keydown', keyLogger)
            })
            
            // 模拟提交按钮点击
            phishingForm.querySelector('button[type="button"]').addEventListener('click', function() {
              const username = phishingForm.querySelector('input[type="text"]').value
              const password = phishingForm.querySelector('input[type="password"]').value
              
              // 模拟窃取信息
              alert(`XSS 攻击成功！\n窃取到的信息：\n用户名: ${username}\n密码: ${password}\nCookie: ${cookie}`)
            })
            
            return { 
              vulnerable: true, 
              message: 'XSS 漏洞存在：输入未经过滤直接插入 HTML',
              effects: [
                '会话劫持：窃取用户Cookie',
                '钓鱼攻击：显示虚假登录表单',
                '网站污损：修改页面标题',
                '恶意重定向：尝试重定向到恶意网站',
                '键盘记录：记录用户键盘输入'
              ]
            }
          }
          
          const testResult = vulnerableXss()
          
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
        this.log('实际效果:')
        result.details.effects.forEach(effect => {
          this.log(`- ${effect}`)
        })
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
          
          // 模拟用户账户余额
          let accountBalance = 10000
          const originalBalance = accountBalance
          const userId = 'user123'
          
          // 模拟后台服务器
          function simulateBackendServer(endpoint, data, headers) {
            // 模拟服务器处理请求
            return new Promise((resolve) => {
              setTimeout(() => {
                // 检查是否有 CSRF Token 验证
                if (!headers['X-CSRF-Token']) {
                  // 没有 CSRF Token 保护，执行操作
                  if (endpoint === '/api/transfer') {
                    accountBalance -= data.amount
                    resolve({
                      success: true,
                      message: '转账成功',
                      newBalance: accountBalance
                    })
                  }
                } else {
                  // 有 CSRF Token 保护，拒绝请求
                  resolve({
                    success: false,
                    message: 'CSRF Token 验证失败'
                  })
                }
              }, 300)
            })
          }
          
          // 模拟攻击者服务器
          function simulateAttackerServer(data) {
            // 模拟攻击者接收窃取的数据
            return new Promise((resolve) => {
              setTimeout(() => {
                resolve({
                  success: true,
                  message: '攻击数据已接收',
                  data: data
                })
              }, 200)
            })
          }
          
          // 模拟 CSRF 攻击场景
          async function vulnerableCsrf() {
            // 1. 模拟用户已登录，浏览器中存在认证 Cookie
            document.cookie = 'sessionId=abc123; path=/; domain=example.com'
            
            // 2. 创建模拟的恶意网站
            const maliciousSite = document.createElement('div')
            maliciousSite.style.position = 'fixed'
            maliciousSite.style.top = '50%'
            maliciousSite.style.left = '50%'
            maliciousSite.style.transform = 'translate(-50%, -50%)'
            maliciousSite.style.background = '#fff'
            maliciousSite.style.border = '2px solid #ff4757'
            maliciousSite.style.borderRadius = '10px'
            maliciousSite.style.padding = '30px'
            maliciousSite.style.boxShadow = '0 4px 30px rgba(0,0,0,0.3)'
            maliciousSite.style.zIndex = '9999'
            maliciousSite.style.width = '500px'
            
            maliciousSite.innerHTML = `
              <div style="text-align: center;">
                <h3 style="color: #ff4757; margin-top: 0;">🎁 恭喜您中奖了！</h3>
                <p style="margin: 15px 0; color: #666;">您是我们网站的幸运用户，点击下方按钮领取奖品！</p>
                <button id="claimBtn" style="background: #3498db; color: white; border: none; padding: 12px 24px; border-radius: 5px; cursor: pointer; font-size: 16px; margin: 20px 0;">
                  立即领取奖品
                </button>
                <div id="loading" style="display: none; margin: 20px 0;">
                  <div style="font-size: 14px; color: #3498db;">正在处理中...</div>
                </div>
                <div id="success" style="display: none; margin: 20px 0;">
                  <div style="font-size: 14px; color: #27ae60;">奖品领取成功！</div>
                </div>
                <div style="margin-top: 20px; font-size: 12px; color: #999;">
                  <p>⚠️ 此为 CSRF 攻击演示，点击按钮会触发未授权转账</p>
                </div>
                <button id="closeBtn" style="background: #95a5a6; color: white; border: none; padding: 8px 16px; border-radius: 5px; cursor: pointer; margin-top: 15px;">
                  关闭演示
                </button>
              </div>
            `
            
            document.body.appendChild(maliciousSite)
            
            // 3. 模拟点击领取按钮触发 CSRF 攻击
            const claimBtn = maliciousSite.querySelector('#claimBtn')
            const loading = maliciousSite.querySelector('#loading')
            const success = maliciousSite.querySelector('#success')
            
            return new Promise((resolve) => {
              claimBtn.addEventListener('click', async () => {
                loading.style.display = 'block'
                
                // 4. 发送 CSRF 攻击请求（模拟转账）
                const transferData = {
                  toAccount: 'attacker123',
                  amount: 5000,
                  userId: userId
                }
                
                // 模拟后台请求（无 CSRF Token）
                const backendResponse = await simulateBackendServer('/api/transfer', transferData, {})
                
                if (backendResponse.success) {
                  // 5. 模拟攻击者服务器接收攻击结果
                  const attackerResponse = await simulateAttackerServer({
                    victimId: userId,
                    amount: transferData.amount,
                    toAccount: transferData.toAccount,
                    timestamp: new Date().toISOString()
                  })
                  
                  loading.style.display = 'none'
                  success.style.display = 'block'
                  
                  // 6. 显示攻击成功提示
                  setTimeout(() => {
                    const attackSuccessPopup = document.createElement('div')
                    attackSuccessPopup.style.position = 'fixed'
                    attackSuccessPopup.style.top = '50%'
                    attackSuccessPopup.style.left = '50%'
                    attackSuccessPopup.style.transform = 'translate(-50%, -50%)'
                    attackSuccessPopup.style.background = '#fff'
                    attackSuccessPopup.style.border = '2px solid #ff4757'
                    attackSuccessPopup.style.borderRadius = '10px'
                    attackSuccessPopup.style.padding = '20px'
                    attackSuccessPopup.style.boxShadow = '0 4px 20px rgba(0,0,0,0.2)'
                    attackSuccessPopup.style.zIndex = '10000'
                    attackSuccessPopup.style.width = '450px'
                    
                    attackSuccessPopup.innerHTML = `
                      <div style="text-align: center;">
                        <h3 style="color: #ff4757; margin-top: 0;">⚠️ CSRF 攻击成功！</h3>
                        <p style="margin: 15px 0;">您的账户余额已被篡改！</p>
                        <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 10px 0; text-align: left;">
                          <div style="margin: 5px 0;"><strong>原始余额：</strong><span style="color: #27ae60;">${originalBalance} 元</span></div>
                          <div style="margin: 5px 0;"><strong>当前余额：</strong><span style="color: #e74c3c;">${accountBalance} 元</span></div>
                          <div style="margin: 5px 0;"><strong>被盗金额：</strong><span style="color: #e74c3c;">5000 元</span></div>
                          <div style="margin: 5px 0;"><strong>转入账户：</strong><span style="color: #e74c3c;">attacker123</span></div>
                        </div>
                        <div style="background: #ffeaa7; padding: 10px; border-radius: 5px; margin: 10px 0; font-size: 14px;">
                          <strong>后台呼出信息：</strong>攻击者服务器已接收到攻击数据
                        </div>
                        <button style="background: #ff4757; color: white; border: none; padding: 8px 16px; border-radius: 5px; cursor: pointer; margin-top: 10px;">
                          关闭
                        </button>
                      </div>
                    `
                    
                    document.body.appendChild(attackSuccessPopup)
                    
                    // 添加关闭按钮事件
                    attackSuccessPopup.querySelector('button').addEventListener('click', function() {
                      document.body.removeChild(attackSuccessPopup)
                    })
                    
                    resolve({ 
                      vulnerable: true, 
                      message: 'CSRF 漏洞存在：请求未验证来源',
                      originalBalance: originalBalance,
                      currentBalance: accountBalance,
                      amountStolen: 5000,
                      toAccount: 'attacker123',
                      effect: `账户余额从 ${originalBalance} 元被篡改为 ${accountBalance} 元`,
                      backendCalled: true,
                      attackerNotified: true
                    })
                  }, 1000)
                }
              })
              
              // 添加关闭按钮事件
              maliciousSite.querySelector('#closeBtn').addEventListener('click', function() {
                document.body.removeChild(maliciousSite)
                resolve({ 
                  vulnerable: false, 
                  message: 'CSRF 攻击演示已关闭'
                })
              })
            })
          }
          
          vulnerableCsrf().then(testResult => {
            setTimeout(() => {
              resolve({
                status: testResult.vulnerable ? 'warning' : 'info',
                message: testResult.message,
                time: Date.now() - startTime,
                details: testResult
              })
            }, 500)
          })
        })
        
        this.result = result
        this.log('CSRF 漏洞测试完成', result.status)
        this.log(`详情: ${result.details.message}`)
        
        if (result.details.vulnerable) {
          this.log(`原始余额: ${result.details.originalBalance} 元`)
          this.log(`当前余额: ${result.details.currentBalance} 元`)
          this.log(`被盗金额: ${result.details.amountStolen} 元`)
          this.log(`转入账户: ${result.details.toAccount}`)
          this.log(`后台呼出: ${result.details.backendCalled ? '成功' : '失败'}`)
          this.log(`攻击者通知: ${result.details.attackerNotified ? '成功' : '失败'}`)
        }
      } catch (error) {
        this.result = { status: 'error', message: error.message }
        this.log('操作失败: ' + error.message, 'error')
      }
    },
    async testSecureXss() {
      try {
        this.clearResult()
        this.clearConsole()
        this.log('开始测试 XSS 安全代码...')
        
        // 模拟 XSS 安全代码测试
        const result = await new Promise((resolve) => {
          const startTime = Date.now()
          
          // 模拟安全的处理方式
          function secureXss(input) {
            // 这里模拟安全的处理方式
            const testDiv = document.createElement('div')
            testDiv.textContent = input // 使用 textContent 而不是 innerHTML
            document.body.appendChild(testDiv)
            
            setTimeout(() => {
              document.body.removeChild(testDiv)
            }, 3000)
            
            return { 
              secure: true, 
              message: 'XSS 防护：使用 textContent 替代 innerHTML',
              effect: '恶意脚本被转义，不会执行'
            }
          }
          
          const xssResult = secureXss('<script>alert("XSS Attack!")<\/script>')
          
          setTimeout(() => {
            resolve({
              status: 'success',
              message: 'XSS 安全代码测试通过',
              time: Date.now() - startTime,
              details: xssResult
            })
          }, 500)
        })
        
        this.result = result
        this.log('XSS 安全代码测试完成', result.status)
        this.log(`XSS 防护: ${result.details.message}`)
        this.log(`XSS 效果: ${result.details.effect}`)
      } catch (error) {
        this.result = { status: 'error', message: error.message }
        this.log('操作失败: ' + error.message, 'error')
      }
    },
    async testSecureCsrf() {
      try {
        this.clearResult()
        this.clearConsole()
        this.log('开始测试 CSRF 安全代码...')
        
        // 模拟 CSRF 安全代码测试
        const result = await new Promise((resolve) => {
          const startTime = Date.now()
          
          function secureCsrf() {
            // 这里模拟带有 CSRF Token 保护的请求
            // 模拟验证 CSRF Token
            const csrfToken = 'random-token-' + Math.random().toString(36).substr(2)
            
            // 模拟后台服务器验证 CSRF Token
            function simulateBackendServer(endpoint, data, headers) {
              return new Promise((resolve) => {
                setTimeout(() => {
                  if (headers['X-CSRF-Token']) {
                    // 有 CSRF Token 保护，允许请求
                    resolve({
                      success: true,
                      message: 'CSRF Token 验证通过',
                      data: data
                    })
                  } else {
                    // 没有 CSRF Token 保护，拒绝请求
                    resolve({
                      success: false,
                      message: 'CSRF Token 验证失败'
                    })
                  }
                }, 300)
              })
            }
            
            // 测试带有 CSRF Token 的请求
            simulateBackendServer('/api/transfer', {
              toAccount: 'recipient123',
              amount: 5000
            }, {
              'X-CSRF-Token': csrfToken
            }).then(response => {
              console.log('CSRF 安全测试结果:', response)
            })
            
            return { 
              secure: true, 
              message: 'CSRF 防护：使用 CSRF Token 验证请求',
              effect: 'CSRF Token 验证通过，请求被允许'
            }
          }
          
          const csrfResult = secureCsrf()
          
          setTimeout(() => {
            resolve({
              status: 'success',
              message: 'CSRF 安全代码测试通过',
              time: Date.now() - startTime,
              details: csrfResult
            })
          }, 500)
        })
        
        this.result = result
        this.log('CSRF 安全代码测试完成', result.status)
        this.log(`CSRF 防护: ${result.details.message}`)
        this.log(`CSRF 效果: ${result.details.effect}`)
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