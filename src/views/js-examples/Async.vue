<template>
  <div class="async-container">
    <div class="header">
      <button class="back-btn" @click="goBack">
        <i class="back-icon">🏠</i>
        <span>返回主页面</span>
      </button>
      <h1>第1期：异步操作陷阱</h1>
    </div>
    
    <div class="case-description">
      <h2>问题描述</h2>
      <p>在处理多个异步操作时，容易出现回调地狱、Promise 链使用不当、并行操作串行化等问题，导致代码难以维护和性能下降。</p>
    </div>
    
    <div class="case-content">
      <div class="demo-section">
        <h2>演示</h2>
        
        <div class="demo-buttons">
          <button @click="testCallbackHell" class="btn btn-danger">
            测试回调地狱
          </button>
          <button @click="testBadPromiseChain" class="btn btn-danger">
            测试 Promise 链错误
          </button>
          <button @click="testSequentialParallel" class="btn btn-danger">
            测试串行并行
          </button>
          <button @click="testPromiseChain" class="btn btn-success">
            测试 Promise 链正确
          </button>
          <button @click="testAsyncAwait" class="btn btn-success">
            测试 Async/Await
          </button>
          <button @click="testParallelOperation" class="btn btn-success">
            测试并行操作
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
            <div class="result-item" v-if="result.time">
              <strong>执行时间：</strong>{{ result.time }}ms
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
          <li><strong>使用 Promise 链：</strong>替代嵌套回调</li>
          <li><strong>使用 async/await：</strong>使异步代码更简洁</li>
          <li><strong>并行操作：</strong>使用 Promise.all 提高性能</li>
          <li><strong>正确处理错误：</strong>使用 try/catch 或 Promise.catch</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { badAsyncExample, goodAsyncExample } from '../../examples/AsyncExample';

export default {
  name: 'AsyncExample',
  data() {
    return {
      result: null,
      consoleLogs: [],
      activeTab: 'error',
      errorCode: `// 回调地狱
function callbackHell() {
  setTimeout(() => {
    console.log('Step 1');
    setTimeout(() => {
      console.log('Step 2');
      setTimeout(() => {
        console.log('Step 3');
        setTimeout(() => {
          console.log('Step 4');
        }, 1000);
      }, 1000);
    }, 1000);
  }, 1000);
}

// Promise 链使用不当
function badPromiseChain() {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve('Result 1');
    }, 1000);
  })
  .then(result => {
    console.log('Result 1:', result);
    // 错误：没有 return Promise
    setTimeout(() => {
      return 'Result 2'; // 这个返回值不会被传递
    }, 1000);
  })
  .then(result => {
    console.log('Result 2:', result); // 这里会是 undefined
  });
}

// 并行操作串行化
function sequentialParallel() {
  const promises = [
    new Promise(resolve => setTimeout(() => resolve('A'), 1000)),
    new Promise(resolve => setTimeout(() => resolve('B'), 1000)),
    new Promise(resolve => setTimeout(() => resolve('C'), 1000))
  ];

  // 错误：串行执行，总时间 3 秒
  return promises[0]
    .then(result => {
      console.log('Result A:', result);
      return promises[1];
    })
    .then(result => {
      console.log('Result B:', result);
      return promises[2];
    });
}`,
      fixedCode: `// 使用 Promise 链
function promiseChain() {
  return new Promise(resolve => {
    setTimeout(() => {
      console.log('Step 1');
      resolve('Step 1 completed');
    }, 1000);
  })
  .then(result => {
    console.log('Result 1:', result);
    return new Promise(resolve => {
      setTimeout(() => {
        console.log('Step 2');
        resolve('Step 2 completed');
      }, 1000);
    });
  })
  .then(result => {
    console.log('Result 2:', result);
    return 'Promise chain completed';
  });
}

// 使用 async/await
async function asyncAwait() {
  await new Promise(resolve => setTimeout(() => {
    console.log('Step 1');
    resolve();
  }, 1000));
  
  await new Promise(resolve => setTimeout(() => {
    console.log('Step 2');
    resolve();
  }, 1000));
  
  console.log('Async/await completed');
  return 'Async/await completed';
}

// 并行操作
function parallelOperation() {
  const promises = [
    new Promise(resolve => setTimeout(() => resolve('A'), 1000)),
    new Promise(resolve => setTimeout(() => resolve('B'), 1000)),
    new Promise(resolve => setTimeout(() => resolve('C'), 1000))
  ];

  // 正确：并行执行，总时间 1 秒
  return Promise.all(promises)
    .then(results => {
      console.log('All results:', results);
      return 'Parallel completed';
    });
}`
    };
  },
  methods: {
    goBack() {
      this.$router.push('/');
    },
    log(message) {
      this.consoleLogs.push(message);
      // 限制日志数量
      if (this.consoleLogs.length > 50) {
        this.consoleLogs.shift();
      }
    },
    clearConsole() {
      this.consoleLogs = [];
    },
    async testCallbackHell() {
      this.log('开始测试回调地狱...');
      const start = performance.now();
      try {
        await badAsyncExample.callbackHell();
        const end = performance.now();
        this.result = {
          status: 'success',
          message: '回调地狱执行完成',
          time: end - start
        };
        this.log('回调地狱执行完成');
      } catch (error) {
        this.result = {
          status: 'error',
          message: '执行失败',
          error: error.message
        };
        this.log('执行失败:', error.message);
      }
    },
    async testBadPromiseChain() {
      this.log('开始测试 Promise 链错误...');
      const start = performance.now();
      try {
        const result = await badAsyncExample.badPromiseChain();
        const end = performance.now();
        this.result = {
          status: 'success',
          message: 'Promise 链执行完成，注意查看控制台输出',
          time: end - start
        };
        this.log('Promise 链执行完成');
      } catch (error) {
        this.result = {
          status: 'error',
          message: '执行失败',
          error: error.message
        };
        this.log('执行失败:', error.message);
      }
    },
    async testSequentialParallel() {
      this.log('开始测试串行并行...');
      const start = performance.now();
      try {
        const result = await badAsyncExample.sequentialParallel();
        const end = performance.now();
        this.result = {
          status: 'success',
          message: '串行执行完成，总时间较长',
          time: end - start
        };
        this.log('串行执行完成，时间:', end - start);
      } catch (error) {
        this.result = {
          status: 'error',
          message: '执行失败',
          error: error.message
        };
        this.log('执行失败:', error.message);
      }
    },
    async testPromiseChain() {
      this.log('开始测试 Promise 链正确...');
      const start = performance.now();
      try {
        const result = await goodAsyncExample.promiseChain();
        const end = performance.now();
        this.result = {
          status: 'success',
          message: 'Promise 链执行完成',
          time: end - start
        };
        this.log('Promise 链执行完成');
      } catch (error) {
        this.result = {
          status: 'error',
          message: '执行失败',
          error: error.message
        };
        this.log('执行失败:', error.message);
      }
    },
    async testAsyncAwait() {
      this.log('开始测试 Async/Await...');
      const start = performance.now();
      try {
        const result = await goodAsyncExample.asyncAwait();
        const end = performance.now();
        this.result = {
          status: 'success',
          message: 'Async/Await 执行完成',
          time: end - start
        };
        this.log('Async/Await 执行完成');
      } catch (error) {
        this.result = {
          status: 'error',
          message: '执行失败',
          error: error.message
        };
        this.log('执行失败:', error.message);
      }
    },
    async testParallelOperation() {
      this.log('开始测试并行操作...');
      const start = performance.now();
      try {
        const result = await goodAsyncExample.parallelOperation();
        const end = performance.now();
        this.result = {
          status: 'success',
          message: '并行执行完成，时间较短',
          time: end - start
        };
        this.log('并行执行完成，时间:', end - start);
      } catch (error) {
        this.result = {
          status: 'error',
          message: '执行失败',
          error: error.message
        };
        this.log('执行失败:', error.message);
      }
    }
  }
}
</script>

<style scoped>
.async-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 30px;
}

.back-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  background-color: #667eea;
  color: white;
  border: none;
  padding: 10px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s;
}

.back-btn:hover {
  background-color: #5568d3;
}

.back-icon {
  font-size: 16px;
}

h1 {
  text-align: center;
  color: #333;
  margin: 0;
  flex: 1;
}

.case-description {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 30px;
}

.demo-section {
  background: white;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 30px;
}

.demo-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 20px;
}

.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  white-space: nowrap;
}

.btn-danger {
  background: #dc3545;
  color: white;
}

.btn-success {
  background: #28a745;
  color: white;
}

.btn-secondary {
  background: #6c757d;
  color: white;
}

.result-section {
  margin-top: 20px;
  margin-bottom: 30px;
}

.result-card {
  padding: 20px;
  border-radius: 4px;
  margin-top: 10px;
}

.result-card.success {
  background: #d4edda;
  border: 1px solid #c3e6cb;
}

.result-card.error {
  background: #f8d7da;
  border: 1px solid #f5c6cb;
}

.result-item {
  margin-bottom: 10px;
}

.console-section {
  margin-top: 30px;
}

.console {
  background: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  padding: 15px;
  max-height: 300px;
  overflow-y: auto;
  margin-bottom: 10px;
}

.log-item {
  margin-bottom: 5px;
  font-family: 'Courier New', Courier, monospace;
  font-size: 14px;
}

.code-section {
  background: white;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 30px;
}

.code-tabs {
  margin-top: 20px;
}

.tab {
  display: flex;
  margin-bottom: 10px;
}

.tab button {
  padding: 10px 20px;
  border: 1px solid #ddd;
  background: #f8f9fa;
  cursor: pointer;
  border-radius: 4px 4px 0 0;
  margin-right: 5px;
}

.tab button.active {
  background: white;
  border-bottom: 1px solid white;
  font-weight: bold;
}

.code-content {
  border: 1px solid #ddd;
  border-radius: 0 4px 4px 4px;
  overflow: auto;
}

.code-content pre {
  margin: 0;
  padding: 20px;
  background: #f8f9fa;
  font-family: 'Courier New', Courier, monospace;
  font-size: 14px;
  line-height: 1.5;
}

.solution-section {
  background: white;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.solution-section ul {
  margin-top: 10px;
  padding-left: 20px;
}

.solution-section li {
  margin-bottom: 10px;
}

@media (max-width: 768px) {
  .demo-buttons {
    flex-direction: column;
  }
  
  .btn {
    width: 100%;
  }
}
</style>