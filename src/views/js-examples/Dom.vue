<template>
  <div class="dom-container">
    <div class="header">
      <button class="back-btn" @click="goBackToJSExamples">
        <i class="back-icon">🏠</i>
        <span>返回案例列表</span>
      </button>
      <h1>第3期：DOM 操作性能问题</h1>
    </div>

    <div class="case-description">
      <h2>问题描述</h2>
      <p>频繁 DOM 操作导致的性能问题，包括布局抖动、重排重绘、事件委托不当等。</p>
    </div>

    <div class="case-content">
      <div class="demo-section">
        <h2>演示</h2>

        <div class="demo-buttons">
          <button @click="testBadDomOperation" :class="buttonTypes.danger.class">
            测试不良 DOM 操作
          </button>
          <button @click="testGoodDomOperation" :class="buttonTypes.success.class">
            测试优化 DOM 操作
          </button>
          <button @click="testEventDelegation" :class="buttonTypes.success.class">
            测试事件委托
          </button>
        </div>

        <div class="result-section" v-if="result">
          <h3>结果</h3>
          <div class="result-card" :class="resultStatus[result.status].class">
            <div class="result-item">
              <strong>状态：</strong>{{ resultStatus[result.status].icon }} {{ resultStatus[result.status].label }}
            </div>
            <div class="result-item">
              <strong>消息：</strong>{{ result.message }}
            </div>
            <div class="result-item" v-if="result.time">
              <strong>执行时间：</strong>{{ result.time }}ms
            </div>
            <div class="result-item" v-if="result.operations">
              <strong>操作次数：</strong>{{ result.operations }}
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
          <button @click="clearConsole" :class="buttonTypes.secondary.class">
            清空控制台
          </button>
        </div>
      </div>

      <div class="code-section">
        <h2>代码分析</h2>

        <div class="code-tabs">
          <div class="tab">
            <button
              v-for="(config, key) in tabConfigs"
              :key="key"
              @click="switchTab(key)"
              :class="{ active: activeTab === key }"
            >
              {{ config.icon }} {{ config.label }}
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

      <div class="solution-section">
        <h2>解决方案</h2>
        <ul>
          <li><strong>批量 DOM 操作：</strong>使用 DocumentFragment 或 innerHTML 批量更新</li>
          <li><strong>减少重排重绘：</strong>使用 CSS transforms、避免频繁修改样式</li>
          <li><strong>事件委托：</strong>利用事件冒泡，减少事件监听器数量</li>
          <li><strong>虚拟列表：</strong>处理大量数据时使用虚拟滚动</li>
          <li><strong>防抖和节流：</strong>对频繁触发的事件进行优化</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import api from '../../api/api';
import { exampleMixin, exampleStyles, performanceMonitor } from '../../utils/exampleMixin';

export default {
  name: 'DomExample',
  mixins: [exampleMixin],
  data() {
    return {
      errorCode: `// 1. 频繁 DOM 操作
function badDomOperation() {
  const container = document.getElementById('container');
  
  // 问题：每次循环都触发重排重绘
  for (let i = 0; i < 1000; i++) {
    const div = document.createElement('div');
    div.textContent = 'Item ' + i;
    container.appendChild(div);
  }
}

// 2. 频繁样式修改
function badStyleOperation() {
  const element = document.getElementById('element');
  
  // 问题：每次修改都可能触发重排
  element.style.width = '100px';
  element.style.height = '100px';
  element.style.backgroundColor = 'red';
  element.style.border = '1px solid black';
}

// 3. 事件监听器过多
function badEventListeners() {
  const items = document.querySelectorAll('.item');
  
  // 问题：为每个元素添加监听器
  items.forEach(item => {
    item.addEventListener('click', function() {
      console.log('Item clicked:', this.textContent);
    });
  });
}`,
      fixedCode: `// 1. 批量 DOM 操作
function goodDomOperation() {
  const container = document.getElementById('container');
  const fragment = document.createDocumentFragment();
  
  // 解决方案：使用 DocumentFragment 批量操作
  for (let i = 0; i < 1000; i++) {
    const div = document.createElement('div');
    div.textContent = 'Item ' + i;
    fragment.appendChild(div);
  }
  
  container.appendChild(fragment);
}

// 2. 批量样式修改
function goodStyleOperation() {
  const element = document.getElementById('element');
  
  // 解决方案：使用 class 或一次性修改
  element.className = 'styled-element';
  
  // 或使用 CSSText
  element.style.cssText = 'width: 100px; height: 100px; background-color: red; border: 1px solid black;';
}

// 3. 事件委托
function goodEventDelegation() {
  const container = document.getElementById('container');
  
  // 解决方案：使用事件委托
  container.addEventListener('click', function(event) {
    if (event.target.classList.contains('item')) {
      console.log('Item clicked:', event.target.textContent);
    }
  });
}

// 4. 防抖和节流
function debounce(func, wait) {
  let timeout;
  return function() {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, arguments), wait);
  };
}

function throttle(func, limit) {
  let inThrottle;
  return function() {
    if (!inThrottle) {
      func.apply(this, arguments);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}`,
      buttonTypes: exampleStyles.buttonTypes,
      resultStatus: exampleStyles.resultStatus,
      tabConfigs: {
        error: exampleStyles.tabs.error,
        fixed: exampleStyles.tabs.fixed
      }
    };
  },
  methods: {
    async testBadDomOperation() {
      try {
        this.clearResult();
        this.clearConsole();
        this.log('开始测试不良 DOM 操作...');
        
        performanceMonitor.start('badDom');
        
        // 模拟不良 DOM 操作
        const result = await new Promise((resolve) => {
          const startTime = Date.now();
          
          // 创建一个临时容器
          const container = document.createElement('div');
          container.id = 'test-container';
          document.body.appendChild(container);
          
          // 频繁 DOM 操作
          for (let i = 0; i < 1000; i++) {
            const div = document.createElement('div');
            div.textContent = 'Item ' + i;
            container.appendChild(div);
          }
          
          // 清理
          document.body.removeChild(container);
          
          resolve({
            status: 'success',
            message: '不良 DOM 操作测试完成',
            time: Date.now() - startTime,
            operations: 1000
          });
        });
        
        const duration = performanceMonitor.end('badDom');
        
        this.result = {
          ...result,
          time: Math.round(duration)
        };
        this.log('不良 DOM 操作测试完成', result.status);
        this.log(`执行时间: ${duration.toFixed(2)}ms`);
        this.log(`操作次数: ${result.operations}`);
      } catch (error) {
        this.setErrorResult('操作失败', error.message);
        this.log('操作失败: ' + error.message, 'error');
      }
    },

    async testGoodDomOperation() {
      try {
        this.clearResult();
        this.clearConsole();
        this.log('开始测试优化 DOM 操作...');
        
        performanceMonitor.start('goodDom');
        
        // 模拟优化 DOM 操作
        const result = await new Promise((resolve) => {
          const startTime = Date.now();
          
          // 创建一个临时容器
          const container = document.createElement('div');
          container.id = 'test-container';
          document.body.appendChild(container);
          
          // 使用 DocumentFragment 批量操作
          const fragment = document.createDocumentFragment();
          for (let i = 0; i < 1000; i++) {
            const div = document.createElement('div');
            div.textContent = 'Item ' + i;
            fragment.appendChild(div);
          }
          container.appendChild(fragment);
          
          // 清理
          document.body.removeChild(container);
          
          resolve({
            status: 'success',
            message: '优化 DOM 操作测试完成',
            time: Date.now() - startTime,
            operations: 1000
          });
        });
        
        const duration = performanceMonitor.end('goodDom');
        
        this.result = {
          ...result,
          time: Math.round(duration)
        };
        this.log('优化 DOM 操作测试完成', result.status);
        this.log(`执行时间: ${duration.toFixed(2)}ms`);
        this.log(`操作次数: ${result.operations}`);
      } catch (error) {
        this.setErrorResult('操作失败', error.message);
        this.log('操作失败: ' + error.message, 'error');
      }
    },

    async testEventDelegation() {
      try {
        this.clearResult();
        this.clearConsole();
        this.log('开始测试事件委托...');
        
        performanceMonitor.start('eventDelegation');
        
        // 模拟事件委托
        const result = await new Promise((resolve) => {
          const startTime = Date.now();
          
          // 创建一个临时容器
          const container = document.createElement('div');
          container.id = 'test-container';
          document.body.appendChild(container);
          
          // 添加多个子元素
          for (let i = 0; i < 100; i++) {
            const div = document.createElement('div');
            div.className = 'item';
            div.textContent = 'Item ' + i;
            container.appendChild(div);
          }
          
          // 事件委托
          let clickCount = 0;
          container.addEventListener('click', function(event) {
            if (event.target.classList.contains('item')) {
              clickCount++;
              // 模拟点击事件
              if (clickCount === 1) {
                this.log('Item clicked:', event.target.textContent);
              }
            }
          }.bind(this));
          
          // 模拟点击
          const items = container.querySelectorAll('.item');
          if (items.length > 0) {
            items[0].click();
          }
          
          // 清理
          document.body.removeChild(container);
          
          resolve({
            status: 'success',
            message: '事件委托测试完成',
            time: Date.now() - startTime,
            operations: 100
          });
        });
        
        const duration = performanceMonitor.end('eventDelegation');
        
        this.result = {
          ...result,
          time: Math.round(duration)
        };
        this.log('事件委托测试完成', result.status);
        this.log(`执行时间: ${duration.toFixed(2)}ms`);
        this.log(`操作次数: ${result.operations}`);
      } catch (error) {
        this.setErrorResult('操作失败', error.message);
        this.log('操作失败: ' + error.message, 'error');
      }
    }
  }
}
</script>

<style scoped>
/* 只保留组件特有的样式，通用样式已移至 common.css */
.dom-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}
</style>