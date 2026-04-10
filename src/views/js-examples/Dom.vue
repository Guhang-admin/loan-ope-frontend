<template>
  <div class="dom-container">
    <div class="header">
      <button class="back-btn" @click="goBack">
        <i class="back-icon">🏠</i>
        <span>返回主页面</span>
      </button>
      <h1>第3期：DOM 操作性能 - 频繁操作 DOM 导致的性能问题</h1>
    </div>
    
    <div class="case-description">
      <h2>问题描述</h2>
      <p>频繁的 DOM 操作会导致重排和重绘，影响页面性能。常见问题包括频繁操作 DOM、频繁读取布局属性、未使用事件委托、直接修改 style 等。</p>
    </div>
    
    <div class="case-content">
      <div class="demo-section">
        <h2>演示</h2>
        
        <div class="demo-buttons">
          <button @click="testFrequentDomOperations" class="btn btn-danger">
            测试频繁 DOM 操作
          </button>
          <button @click="testFrequentLayoutReads" class="btn btn-danger">
            测试频繁布局读取
          </button>
          <button @click="testNoEventDelegation" class="btn btn-danger">
            测试无事件委托
          </button>
          <button @click="testDirectStyleModification" class="btn btn-danger">
            测试直接修改样式
          </button>
          <button @click="testUseDocumentFragment" class="btn btn-success">
            测试文档片段
          </button>
          <button @click="testBatchLayoutOperations" class="btn btn-success">
            测试批量布局操作
          </button>
          <button @click="testUseEventDelegation" class="btn btn-success">
            测试事件委托
          </button>
          <button @click="testUseCssClasses" class="btn btn-success">
            测试 CSS 类
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
            <div class="result-item" v-if="result.detail">
              <strong>详情：</strong>{{ result.detail }}
            </div>
            <div class="result-item" v-if="result.error">
              <strong>错误：</strong>{{ result.error }}
            </div>
          </div>
        </div>
        
        <div class="console-section">
          <h3>控制台</h3>
          <div class="console-content">
            <div v-for="(log, index) in consoleLogs" :key="index" class="console-log">
              {{ log }}
            </div>
          </div>
          <button @click="clearConsole" class="btn btn-default">
            清空控制台
          </button>
        </div>
      </div>
      
      <div class="code-section">
        <h2>代码分析</h2>
        <div class="tabs">
          <button 
            @click="activeTab = 'error'" 
            class="tab-btn" 
            :class="activeTab === 'error' ? 'active' : ''"
          >
            错误代码
          </button>
          <button 
            @click="activeTab = 'fixed'" 
            class="tab-btn" 
            :class="activeTab === 'fixed' ? 'active' : ''"
          >
            正确代码
          </button>
        </div>
        <div class="code-content">
          <pre v-if="activeTab === 'error'">{{ errorCode }}</pre>
          <pre v-else-if="activeTab === 'fixed'">{{ fixedCode }}</pre>
        </div>
      </div>
      
      <div class="performance-section">
        <h2>性能统计</h2>
        <div class="stats-grid">
          <div class="stat-item">
            <strong>渲染时间：</strong>{{ performanceStats.renderTime }}ms
          </div>
          <div class="stat-item">
            <strong>布局时间：</strong>{{ performanceStats.layoutTime }}ms
          </div>
          <div class="stat-item">
            <strong>绘制时间：</strong>{{ performanceStats.paintTime }}ms
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { badDomExample, goodDomExample } from '../../examples/DomPerformanceExample';

export default {
  name: 'DomExample',
  data() {
    return {
      result: null,
      consoleLogs: [],
      performanceStats: {
        renderTime: 0,
        layoutTime: 0,
        paintTime: 0
      },
      activeTab: 'error',
      errorCode: `// 频繁操作 DOM
function frequentDomOperations() {
  const start = performance.now();
  
  const container = document.createElement('div');
  container.id = 'bad-container';
  document.body.appendChild(container);
  
  // 错误：每次循环都操作 DOM
  for (let i = 0; i < 1000; i++) {
    const element = document.createElement('div');
    element.textContent = \`Item \${i}\`;
    container.appendChild(element); // 每次都触发重排
  }
  
  const end = performance.now();
  console.log('Frequent DOM operations time:', end - start);
}

// 频繁读取布局属性
function frequentLayoutReads() {
  const start = performance.now();
  
  const container = document.createElement('div');
  container.id = 'layout-container';
  document.body.appendChild(container);
  
  for (let i = 0; i < 1000; i++) {
    const element = document.createElement('div');
    element.textContent = \`Item \${i}\`;
    container.appendChild(element);
    
    // 错误：每次都读取布局属性，触发强制同步布局
    const height = element.offsetHeight;
    console.log('Element height:', height);
  }
  
  const end = performance.now();
  console.log('Frequent layout reads time:', end - start);
}

// 未使用事件委托
function noEventDelegation() {
  const container = document.createElement('ul');
  container.id = 'no-delegation';
  document.body.appendChild(container);
  
  // 错误：为每个元素添加事件监听器
  for (let i = 0; i < 100; i++) {
    const li = document.createElement('li');
    li.textContent = \`Item \${i}\`;
    li.addEventListener('click', function() {
      console.log('Item clicked:', i);
    });
    container.appendChild(li);
  }
}

// 直接修改 style
function directStyleModification() {
  const start = performance.now();
  
  const container = document.createElement('div');
  container.id = 'style-container';
  document.body.appendChild(container);
  
  for (let i = 0; i < 1000; i++) {
    const element = document.createElement('div');
    // 错误：直接修改 style，触发重绘
    element.style.width = '100px';
    element.style.height = '100px';
    element.style.backgroundColor = 'red';
    element.style.margin = '10px';
    element.textContent = \`Item \${i}\`;
    container.appendChild(element);
  }
  
  const end = performance.now();
  console.log('Direct style modification time:', end - start);
}`,
      fixedCode: `// 使用文档片段
function useDocumentFragment() {
  const start = performance.now();
  
  const container = document.createElement('div');
  container.id = 'good-container';
  document.body.appendChild(container);
  
  // 正确：使用文档片段，减少 DOM 操作次数
  const fragment = document.createDocumentFragment();
  for (let i = 0; i < 1000; i++) {
    const element = document.createElement('div');
    element.textContent = \`Item \${i}\`;
    fragment.appendChild(element); // 先添加到片段
  }
  
  container.appendChild(fragment); // 一次性添加到 DOM
  
  const end = performance.now();
  console.log('Document fragment time:', end - start);
}

// 批量读写布局属性
function batchLayoutOperations() {
  const start = performance.now();
  
  const container = document.createElement('div');
  container.id = 'batch-container';
  document.body.appendChild(container);
  
  // 正确：先批量写入
  for (let i = 0; i < 1000; i++) {
    const element = document.createElement('div');
    element.textContent = \`Item \${i}\`;
    container.appendChild(element);
  }
  
  // 再批量读取
  const elements = container.querySelectorAll('div');
  elements.forEach((element, index) => {
    const height = element.offsetHeight;
    console.log('Element', index, 'height:', height);
  });
  
  const end = performance.now();
  console.log('Batch layout operations time:', end - start);
}

// 使用事件委托
function useEventDelegation() {
  const container = document.createElement('ul');
  container.id = 'with-delegation';
  document.body.appendChild(container);
  
  // 正确：使用事件委托，只添加一个监听器
  for (let i = 0; i < 100; i++) {
    const li = document.createElement('li');
    li.textContent = \`Item \${i}\`;
    li.dataset.index = i;
    container.appendChild(li);
  }
  
  container.addEventListener('click', function(event) {
    if (event.target.tagName === 'LI') {
      const index = event.target.dataset.index;
      console.log('Item clicked:', index);
    }
  });
}

// 使用 CSS 类
function useCssClasses() {
  const start = performance.now();
  
  // 先添加样式
  const style = document.createElement('style');
  style.textContent = \`
    .item {
      width: 100px;
      height: 100px;
      background-color: blue;
      margin: 10px;
    }
  \`;
  document.head.appendChild(style);
  
  const container = document.createElement('div');
  container.id = 'css-container';
  document.body.appendChild(container);
  
  // 正确：使用 CSS 类，减少样式操作
  for (let i = 0; i < 1000; i++) {
    const element = document.createElement('div');
    element.className = 'item'; // 使用 CSS 类
    element.textContent = \`Item \${i}\`;
    container.appendChild(element);
  }
  
  const end = performance.now();
  console.log('CSS classes time:', end - start);
}

// 使用 requestAnimationFrame
function useRequestAnimationFrame() {
  let count = 0;
  const maxCount = 100;
  
  function update() {
    if (count < maxCount) {
      const element = document.createElement('div');
      element.textContent = \`Animated item \${count}\`;
      document.body.appendChild(element);
      count++;
      requestAnimationFrame(update);
    }
  }
  
  requestAnimationFrame(update);
}`
    };
  },
  mounted() {
    this.updatePerformanceStats();
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
    updatePerformanceStats() {
      // 模拟性能统计数据
      this.performanceStats = {
        renderTime: (Math.random() * 100).toFixed(2),
        layoutTime: (Math.random() * 50).toFixed(2),
        paintTime: (Math.random() * 30).toFixed(2)
      };
    },
    async testFrequentDomOperations() {
      this.log('开始测试频繁 DOM 操作...');
      const start = performance.now();
      try {
        const result = badDomExample.frequentDomOperations();
        const end = performance.now();
        this.result = {
          status: 'error',
          message: '频繁 DOM 操作测试完成，执行时间较长',
          time: end - start,
          detail: '每次循环都操作 DOM，触发多次重排'
        };
        this.log('频繁 DOM 操作测试完成，时间:', end - start);
      } catch (error) {
        this.result = {
          status: 'error',
          message: '执行失败',
          error: error.message
        };
        this.log('执行失败:', error.message);
      }
    },
    async testFrequentLayoutReads() {
      this.log('开始测试频繁布局读取...');
      const start = performance.now();
      try {
        const result = badDomExample.frequentLayoutReads();
        const end = performance.now();
        this.result = {
          status: 'error',
          message: '频繁布局读取测试完成，执行时间较长',
          time: end - start,
          detail: '每次都读取布局属性，触发强制同步布局'
        };
        this.log('频繁布局读取测试完成，时间:', end - start);
      } catch (error) {
        this.result = {
          status: 'error',
          message: '执行失败',
          error: error.message
        };
        this.log('执行失败:', error.message);
      }
    },
    testNoEventDelegation() {
      this.log('开始测试无事件委托...');
      try {
        const result = badDomExample.noEventDelegation();
        this.result = {
          status: 'error',
          message: '无事件委托测试完成',
          detail: '为每个元素添加了事件监听器，共 100 个'
        };
        this.log('无事件委托测试完成');
      } catch (error) {
        this.result = {
          status: 'error',
          message: '执行失败',
          error: error.message
        };
        this.log('执行失败:', error.message);
      }
    },
    async testDirectStyleModification() {
      this.log('开始测试直接修改样式...');
      const start = performance.now();
      try {
        const result = badDomExample.directStyleModification();
        const end = performance.now();
        this.result = {
          status: 'error',
          message: '直接修改样式测试完成，执行时间较长',
          time: end - start,
          detail: '每次都直接修改 style，触发多次重绘'
        };
        this.log('直接修改样式测试完成，时间:', end - start);
      } catch (error) {
        this.result = {
          status: 'error',
          message: '执行失败',
          error: error.message
        };
        this.log('执行失败:', error.message);
      }
    },
    async testUseDocumentFragment() {
      this.log('开始测试文档片段...');
      const start = performance.now();
      try {
        const result = goodDomExample.useDocumentFragment();
        const end = performance.now();
        this.result = {
          status: 'success',
          message: '文档片段测试完成，执行时间较短',
          time: end - start,
          detail: '使用文档片段，减少 DOM 操作次数'
        };
        this.log('文档片段测试完成，时间:', end - start);
      } catch (error) {
        this.result = {
          status: 'error',
          message: '执行失败',
          error: error.message
        };
        this.log('执行失败:', error.message);
      }
    },
    async testBatchLayoutOperations() {
      this.log('开始测试批量布局操作...');
      const start = performance.now();
      try {
        const result = goodDomExample.batchLayoutOperations();
        const end = performance.now();
        this.result = {
          status: 'success',
          message: '批量布局操作测试完成，执行时间较短',
          time: end - start,
          detail: '先批量写入，再批量读取，避免布局抖动'
        };
        this.log('批量布局操作测试完成，时间:', end - start);
      } catch (error) {
        this.result = {
          status: 'error',
          message: '执行失败',
          error: error.message
        };
        this.log('执行失败:', error.message);
      }
    },
    testUseEventDelegation() {
      this.log('开始测试事件委托...');
      try {
        const result = goodDomExample.useEventDelegation();
        this.result = {
          status: 'success',
          message: '事件委托测试完成',
          detail: '只添加了一个事件监听器，提高性能'
        };
        this.log('事件委托测试完成');
      } catch (error) {
        this.result = {
          status: 'error',
          message: '执行失败',
          error: error.message
        };
        this.log('执行失败:', error.message);
      }
    },
    async testUseCssClasses() {
      this.log('开始测试 CSS 类...');
      const start = performance.now();
      try {
        const result = goodDomExample.useCssClasses();
        const end = performance.now();
        this.result = {
          status: 'success',
          message: 'CSS 类测试完成，执行时间较短',
          time: end - start,
          detail: '使用 CSS 类，减少样式操作次数'
        };
        this.log('CSS 类测试完成，时间:', end - start);
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
};
</script>

<style scoped>
.dom-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
  line-height: 1.6;
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
  color: #333;
  text-align: center;
  margin: 0;
  flex: 1;
}

.case-description {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 30px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.case-content {
  background: white;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.demo-section {
  margin-bottom: 40px;
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
  transition: background-color 0.3s;
}

.btn-danger {
  background-color: #dc3545;
  color: white;
}

.btn-danger:hover {
  background-color: #c82333;
}

.btn-success {
  background-color: #28a745;
  color: white;
}

.btn-success:hover {
  background-color: #218838;
}

.btn-default {
  background-color: #6c757d;
  color: white;
}

.btn-default:hover {
  background-color: #5a6268;
}

.result-section {
  margin: 20px 0;
}

.result-card {
  padding: 20px;
  border-radius: 8px;
  margin-top: 10px;
}

.result-card.success {
  background-color: #d4edda;
  border: 1px solid #c3e6cb;
  color: #155724;
}

.result-card.error {
  background-color: #f8d7da;
  border: 1px solid #f5c6cb;
  color: #721c24;
}

.result-item {
  margin-bottom: 10px;
}

.console-section {
  margin-top: 30px;
}

.console-content {
  background: #f8f9fa;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 15px;
  max-height: 300px;
  overflow-y: auto;
  margin-bottom: 10px;
}

.console-log {
  margin-bottom: 5px;
  font-family: 'Courier New', Courier, monospace;
  font-size: 14px;
}

.code-section {
  margin: 40px 0;
}

.tabs {
  display: flex;
  margin-bottom: 10px;
}

.tab-btn {
  padding: 10px 20px;
  border: 1px solid #ddd;
  background: #f8f9fa;
  cursor: pointer;
  border-radius: 4px 4px 0 0;
  margin-right: 5px;
  transition: background-color 0.3s;
}

.tab-btn.active {
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

.performance-section {
  margin-top: 40px;
  background: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-top: 10px;
}

.stat-item {
  background: white;
  padding: 15px;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
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