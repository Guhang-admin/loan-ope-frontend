<template>
  <div class="memoryleak-container">
    <div class="header">
      <button class="back-btn" @click="goBack">
        <i class="back-icon">🏠</i>
        <span>返回主页面</span>
      </button>
      <h1>第2期：内存泄漏问题 - 闭包和事件监听器导致的内存泄漏</h1>
    </div>
    
    <div class="case-description">
      <h2>问题描述</h2>
      <p>JavaScript 中常见的内存泄漏原因包括闭包、事件监听器未清理、定时器未清理、全局变量累积等，这些问题会导致页面性能下降、浏览器崩溃。</p>
    </div>
    
    <div class="case-content">
      <div class="demo-section">
        <h2>演示</h2>
        
        <div class="demo-buttons">
          <button @click="testClosureLeak" class="btn btn-danger">
            测试闭包泄漏
          </button>
          <button @click="testEventListenerLeak" class="btn btn-danger">
            测试事件监听器泄漏
          </button>
          <button @click="testTimerLeak" class="btn btn-danger">
            测试定时器泄漏
          </button>
          <button @click="testGlobalVariableLeak" class="btn btn-danger">
            测试全局变量泄漏
          </button>
          <button @click="testAvoidClosureLeak" class="btn btn-success">
            测试避免闭包泄漏
          </button>
          <button @click="testProperEventListener" class="btn btn-success">
            测试正确事件监听器
          </button>
          <button @click="testProperTimer" class="btn btn-success">
            测试正确定时器
          </button>
          <button @click="testWeakMap" class="btn btn-success">
            测试 WeakMap
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
        
        <div class="memory-stats">
          <h3>内存使用情况</h3>
          <div class="stats-grid">
            <div class="stat-item">
              <strong>总内存：</strong>{{ memoryStats.totalJSHeapSize }} MB
            </div>
            <div class="stat-item">
              <strong>已使用内存：</strong>{{ memoryStats.usedJSHeapSize }} MB
            </div>
            <div class="stat-item">
              <strong>内存限制：</strong>{{ memoryStats.jsHeapSizeLimit }} MB
            </div>
          </div>
          <button @click="updateMemoryStats" class="btn btn-info">
            更新内存统计
          </button>
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
          <li><strong>闭包管理：</strong>避免不必要的闭包，及时释放引用</li>
          <li><strong>事件监听器：</strong>添加后要记得移除</li>
          <li><strong>定时器：</strong>使用后要清除</li>
          <li><strong>全局变量：</strong>避免使用全局变量存储大量数据</li>
          <li><strong>WeakMap/WeakSet：</strong>使用弱引用存储临时数据</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { badMemoryLeakExample, goodMemoryLeakExample } from '../../examples/MemoryLeakExample';

export default {
  name: 'MemoryLeakExample',
  data() {
    return {
      result: null,
      consoleLogs: [],
      memoryStats: {
        totalJSHeapSize: 0,
        usedJSHeapSize: 0,
        jsHeapSizeLimit: 0
      },
      activeTab: 'error',
      errorCode: `// 闭包导致的内存泄漏
function closureLeak() {
  const largeData = new Array(1000000).fill('data'); // 大数组
  
  // 错误：内部函数引用了外部变量
  function innerFunction() {
    console.log('Inner function called');
  }
  
  return innerFunction;
}

// 事件监听器未清理
function eventListenerLeak() {
  const element = document.createElement('div');
  document.body.appendChild(element);
  
  // 错误：添加监听器但未移除
  element.addEventListener('click', function() {
    console.log('Element clicked');
  });
  
  // 即使移除元素，监听器仍然存在
  document.body.removeChild(element);
}

// 定时器未清理
function timerLeak() {
  let count = 0;
  
  // 错误：设置定时器但未清除
  setInterval(function() {
    count++;
    console.log('Timer tick:', count);
  }, 1000);
}

// 全局变量累积
function globalVariableLeak() {
  // 错误：全局变量无限增长
  if (!window.leakArray) {
    window.leakArray = [];
  }
  
  for (let i = 0; i < 1000; i++) {
    window.leakArray.push(new Array(1000).fill('leak'));
  }
}`,
      fixedCode: `// 避免闭包泄漏
function avoidClosureLeak() {
  {
    const largeData = new Array(1000000).fill('data');
    console.log('Large data created');
  } // largeData 超出作用域
  
  function innerFunction() {
    console.log('Inner function called');
  }
  
  return innerFunction;
}

// 正确管理事件监听器
function properEventListener() {
  const element = document.createElement('div');
  document.body.appendChild(element);
  
  function handleClick() {
    console.log('Element clicked');
  }
  
  element.addEventListener('click', handleClick);
  
  // 正确：移除监听器
  element.removeEventListener('click', handleClick);
  document.body.removeChild(element);
}

// 正确管理定时器
function properTimer() {
  let count = 0;
  const timerId = setInterval(function() {
    count++;
    console.log('Timer tick:', count);
    
    if (count >= 5) {
      clearInterval(timerId); // 正确：清除定时器
      console.log('Timer cleared');
    }
  }, 1000);
}

// 使用 WeakMap 避免内存泄漏
function weakMapExample() {
  const weakMap = new WeakMap();
  const element = document.createElement('div');
  
  // 存储弱引用
  weakMap.set(element, { data: 'some data' });
  
  console.log('WeakMap size:', weakMap.has(element));
  
  // 当 element 被垃圾回收时，WeakMap 中的条目也会被自动清理
  element = null;
}

// 避免全局变量泄漏
function avoidGlobalLeak() {
  // 正确：使用局部变量
  let localArray = [];
  for (let i = 0; i < 1000; i++) {
    localArray.push(new Array(1000).fill('temp'));
  }
  
  // 手动释放
  localArray = null;
}`
    };
  },
  mounted() {
    this.updateMemoryStats();
  },
  methods: {
    goBack() {
      this.$router.push('/');
    },
    log(message) {
      this.consoleLogs.push(message);
      if (this.consoleLogs.length > 50) {
        this.consoleLogs.shift();
      }
    },
    clearConsole() {
      this.consoleLogs = [];
    },
    updateMemoryStats() {
      if (performance && performance.memory) {
        const memory = performance.memory;
        this.memoryStats = {
          totalJSHeapSize: (memory.totalJSHeapSize / 1024 / 1024).toFixed(2),
          usedJSHeapSize: (memory.usedJSHeapSize / 1024 / 1024).toFixed(2),
          jsHeapSizeLimit: (memory.jsHeapSizeLimit / 1024 / 1024).toFixed(2)
        };
      }
    },
    testClosureLeak() {
      this.log('开始测试闭包泄漏...');
      try {
        const innerFunc = badMemoryLeakExample.closureLeak();
        innerFunc();
        this.result = {
          status: 'error',
          message: '闭包泄漏测试完成，largeData 被闭包引用无法回收',
          detail: '即使 innerFunction 不使用 largeData，闭包仍然会持有引用'
        };
        this.log('闭包泄漏测试完成');
      } catch (error) {
        this.result = {
          status: 'error',
          message: '执行失败',
          error: error.message
        };
        this.log('执行失败:', error.message);
      }
    },
    testEventListenerLeak() {
      this.log('开始测试事件监听器泄漏...');
      try {
        const result = badMemoryLeakExample.eventListenerLeak();
        this.result = {
          status: 'error',
          message: '事件监听器泄漏测试完成',
          detail: '监听器未移除，即使元素被移除'
        };
        this.log('事件监听器泄漏测试完成');
      } catch (error) {
        this.result = {
          status: 'error',
          message: '执行失败',
          error: error.message
        };
        this.log('执行失败:', error.message);
      }
    },
    testTimerLeak() {
      this.log('开始测试定时器泄漏...');
      try {
        const result = badMemoryLeakExample.timerLeak();
        this.result = {
          status: 'error',
          message: '定时器泄漏测试完成',
          detail: '定时器未清除，会持续运行'
        };
        this.log('定时器泄漏测试完成');
      } catch (error) {
        this.result = {
          status: 'error',
          message: '执行失败',
          error: error.message
        };
        this.log('执行失败:', error.message);
      }
    },
    testGlobalVariableLeak() {
      this.log('开始测试全局变量泄漏...');
      try {
        const result = badMemoryLeakExample.globalVariableLeak();
        this.result = {
          status: 'error',
          message: '全局变量泄漏测试完成',
          detail: result
        };
        this.log('全局变量泄漏测试完成:', result);
      } catch (error) {
        this.result = {
          status: 'error',
          message: '执行失败',
          error: error.message
        };
        this.log('执行失败:', error.message);
      }
    },
    testAvoidClosureLeak() {
      this.log('开始测试避免闭包泄漏...');
      try {
        const innerFunc = goodMemoryLeakExample.avoidClosureLeak();
        innerFunc();
        this.result = {
          status: 'success',
          message: '避免闭包泄漏测试完成',
          detail: 'largeData 超出作用域，可以被垃圾回收'
        };
        this.log('避免闭包泄漏测试完成');
      } catch (error) {
        this.result = {
          status: 'error',
          message: '执行失败',
          error: error.message
        };
        this.log('执行失败:', error.message);
      }
    },
    testProperEventListener() {
      this.log('开始测试正确事件监听器...');
      try {
        const result = goodMemoryLeakExample.properEventListener();
        this.result = {
          status: 'success',
          message: '正确事件监听器测试完成',
          detail: '监听器已正确移除'
        };
        this.log('正确事件监听器测试完成');
      } catch (error) {
        this.result = {
          status: 'error',
          message: '执行失败',
          error: error.message
        };
        this.log('执行失败:', error.message);
      }
    },
    testProperTimer() {
      this.log('开始测试正确定时器...');
      try {
        const result = goodMemoryLeakExample.properTimer();
        this.result = {
          status: 'success',
          message: '正确定时器测试完成',
          detail: '定时器会在 5 次后自动清除'
        };
        this.log('正确定时器测试完成');
      } catch (error) {
        this.result = {
          status: 'error',
          message: '执行失败',
          error: error.message
        };
        this.log('执行失败:', error.message);
      }
    },
    testWeakMap() {
      this.log('开始测试 WeakMap...');
      try {
        const result = goodMemoryLeakExample.weakMapExample();
        this.result = {
          status: 'success',
          message: 'WeakMap 测试完成',
          detail: '使用 WeakMap 存储弱引用，避免内存泄漏'
        };
        this.log('WeakMap 测试完成');
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
.memoryleak-container {
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

.btn-info {
  background: #17a2b8;
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

.memory-stats {
  margin-top: 30px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
}

.stat-item {
  background: white;
  padding: 15px;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
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
  
  .stats-grid {
    grid-template-columns: 1fr;
  }
}
</style>