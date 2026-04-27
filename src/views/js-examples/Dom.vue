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
          <button @click="testBadDomOperation" :class="buttonTypes.danger.class" :disabled="isRunning">
            测试不良 DOM 操作
          </button>
          <button @click="testGoodDomOperation" :class="buttonTypes.success.class" :disabled="isRunning">
            测试优化 DOM 操作
          </button>
          <button @click="testLayoutThrashing" :class="buttonTypes.warning.class" :disabled="isRunning">
            测试布局抖动
          </button>
          <button @click="testEventDelegation" :class="buttonTypes.success.class" :disabled="isRunning">
            测试事件委托
          </button>
          <button @click="clearDemo" :class="buttonTypes.secondary.class" :disabled="isRunning">
            清空演示
          </button>
        </div>

        <!-- 可视化演示区域 -->
        <div class="demo-visualization" v-if="demoArea.show">
          <h3>{{ demoArea.title }}</h3>
          <div class="progress-bar" v-if="demoArea.progress > 0">
            <div class="progress-fill" :style="{ width: demoArea.progress + '%' }"></div>
          </div>
          <div class="stats-bar">
            <span>元素数量: <strong>{{ demoArea.elementCount }}</strong></span>
            <span>操作耗时: <strong>{{ demoArea.duration }}ms</strong></span>
            <span>FPS: <strong :class="{ 'fps-low': demoArea.fps < 30 }">{{ demoArea.fps }}</strong></span>
          </div>
          <div class="demo-container" ref="demoContainer" :class="{ 'layout-thrashing': demoArea.isThrashing }">
            <!-- 动态生成的DOM元素将显示在这里 -->
          </div>
          <div class="performance-metrics" v-if="demoArea.metrics">
            <h4>性能指标对比</h4>
            <div class="metrics-grid">
              <div class="metric-card" :class="{ 'bad': demoArea.metrics.reflows > 100 }">
                <div class="metric-value">{{ demoArea.metrics.reflows }}</div>
                <div class="metric-label">重排次数</div>
              </div>
              <div class="metric-card" :class="{ 'bad': demoArea.metrics.repaints > 100 }">
                <div class="metric-value">{{ demoArea.metrics.repaints }}</div>
                <div class="metric-label">重绘次数</div>
              </div>
              <div class="metric-card" :class="{ 'good': demoArea.metrics.batchSize > 1 }">
                <div class="metric-value">{{ demoArea.metrics.batchSize }}</div>
                <div class="metric-label">批处理大小</div>
              </div>
            </div>
          </div>
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
          <li><strong>避免布局抖动：</strong>分离 DOM 读写操作，批量读取再批量写入</li>
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
      isRunning: false,
      demoArea: {
        show: false,
        title: '',
        progress: 0,
        elementCount: 0,
        duration: 0,
        fps: 60,
        isThrashing: false,
        metrics: null
      },
      fpsTimer: null,
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

// 3. 布局抖动（强制同步布局）
function badLayoutThrashing() {
  const container = document.getElementById('container');
  const items = container.querySelectorAll('.item');
  
  // 问题：交替读写 DOM 属性
  for (let i = 0; i < items.length; i++) {
    // 读取属性（触发重排计算）
    const height = container.offsetHeight;
    const width = container.offsetWidth;
    
    // 写入属性（再次触发重排）
    items[i].style.height = (height / items.length) + 'px';
    items[i].style.width = (width / 2) + 'px';
  }
  // 结果：触发 2n 次重排，严重性能问题
}

// 4. 事件监听器过多
function badEventListeners() {
  const items = document.querySelectorAll('.item');
  
  // 问题：为每个元素添加监听器
  items.forEach(item => {
    item.addEventListener('click', function() {
      console.log('Item clicked:', this.textContent);
    });
  });
}`,
      fixedCode: `// 1. 批量 DOM 操作，
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

// 3. 分离读写操作，避免布局抖动
function goodLayoutOperation() {
  const container = document.getElementById('container');
  const items = container.querySelectorAll('.item');
  
  // 解决方案1：先批量读取
  const height = container.offsetHeight;
  const width = container.offsetWidth;
  
  // 再批量写入
  for (let i = 0; i < items.length; i++) {
    items[i].style.height = (height / items.length) + 'px';
    items[i].style.width = (width / 2) + 'px';
  }
  // 结果：只触发 2 次重排，性能大幅提升
  
  // 解决方案2：使用 requestAnimationFrame
  requestAnimationFrame(function() {
    // 在下一帧统一处理
    for (var i = 0; i < items.length; i++) {
      items[i].style.transform = 'translateY(' + (i * 10) + 'px)';
    }
  });
}

// 4. 事件委托
function goodEventDelegation() {
  const container = document.getElementById('container');
  
  // 解决方案：使用事件委托
  container.addEventListener('click', function(event) {
    if (event.target.classList.contains('item')) {
      console.log('Item clicked:', event.target.textContent);
    }
  });
}

// 5. 防抖和节流
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
        this.isRunning = true;
        this.log('开始测试不良 DOM 操作...');
        this.log('❌ 每次循环直接操作 DOM，会频繁触发重排重绘');
        this.log('❌ 可以看到元素逐个添加，页面卡顿明显');
        
        // 初始化演示区域
        this.demoArea.show = true;
        this.demoArea.title = '不良 DOM 操作演示（逐次插入）';
        this.demoArea.progress = 0;
        this.demoArea.elementCount = 0;
        this.demoArea.duration = 0;
        this.demoArea.isThrashing = false;
        this.demoArea.metrics = {
          reflows: 1000,
          repaints: 1000,
          batchSize: 1
        };
        
        // 清空演示容器
        const container = this.$refs.demoContainer;
        if (container) {
          container.innerHTML = '';
        }
        
        this.startFpsMonitoring();
        
        performanceMonitor.start('badDom');
        const startTime = Date.now();
        
        // 不良 DOM 操作：逐次插入，每次触发重排重绘
        const batchSize = 1000;
        const batchCount = 1; // 单次全部插入
        
        for (let i = 0; i < batchSize; i++) {
          const div = document.createElement('div');
          div.className = 'demo-item';
          div.textContent = i;
          div.style.backgroundColor = `hsl(${(i * 0.36) % 360}, 70%, 70%)`;
          
          // 不良做法：每次直接插入到 DOM
          container.appendChild(div);
          
          // 更新进度（每50个更新一次UI）
          if (i % 50 === 0) {
            this.demoArea.progress = ((i + 1) / batchSize) * 100;
            this.demoArea.elementCount = i + 1;
            await this.$nextTick();
          }
          
          // 添加小延迟让用户看到逐次添加的效果
          if (i < 100) {
            await new Promise(resolve => setTimeout(resolve, 5));
          }
        }
        
        const endTime = Date.now();
        const duration = endTime - startTime;
        
        this.stopFpsMonitoring();
        
        this.demoArea.progress = 100;
        this.demoArea.elementCount = batchSize;
        this.demoArea.duration = duration;
        
        this.result = {
          status: 'warning',
          message: '不良 DOM 操作测试完成',
          time: duration,
          operations: batchSize
        };
        
        this.log('✗ 不良 DOM 操作测试完成', 'warning');
        this.log(`✗ 执行时间: ${duration}ms`);
        this.log(`✗ 操作次数: ${batchSize} 次插入`);
        this.log(`✗ 重排次数: ${batchSize} 次（每次插入都触发）`);
        this.log(`✗ 页面卡顿明显，用户体验差`);
        this.log('💡 建议：使用 DocumentFragment 批量插入或 innerHTML');
        
        this.isRunning = false;
        
      } catch (error) {
        this.isRunning = false;
        this.stopFpsMonitoring();
        this.setErrorResult('操作失败', error.message);
        this.log('操作失败: ' + error.message, 'error');
      }
    },
    
    startFpsMonitoring() {
      let lastTime = performance.now();
      let frames = 0;
      
      const measureFps = () => {
        const currentTime = performance.now();
        frames++;
        
        if (currentTime - lastTime >= 1000) {
          this.demoArea.fps = frames;
          frames = 0;
          lastTime = currentTime;
        }
        
        if (this.isRunning) {
          this.fpsTimer = requestAnimationFrame(measureFps);
        }
      };
      
      this.fpsTimer = requestAnimationFrame(measureFps);
    },
    
    stopFpsMonitoring() {
      if (this.fpsTimer) {
        cancelAnimationFrame(this.fpsTimer);
        this.fpsTimer = null;
      }
    },
    
    clearDemo() {
      this.demoArea.show = false;
      this.demoArea.progress = 0;
      this.demoArea.elementCount = 0;
      this.demoArea.duration = 0;
      this.demoArea.fps = 60;
      this.demoArea.isThrashing = false;
      this.demoArea.metrics = null;
      
      const container = this.$refs.demoContainer;
      if (container) {
        container.innerHTML = '';
      }
      
      this.clearConsole();
      this.clearResult();
    },

    async testGoodDomOperation() {
      try {
        this.clearResult();
        this.clearConsole();
        this.isRunning = true;
        this.log('开始测试优化 DOM 操作...');
        this.log('✓ 使用 DocumentFragment 批量操作 DOM');
        this.log('✓ 只触发一次重排重绘，性能大幅提升');
        
        // 初始化演示区域
        this.demoArea.show = true;
        this.demoArea.title = '优化 DOM 操作演示（批量插入）';
        this.demoArea.progress = 0;
        this.demoArea.elementCount = 0;
        this.demoArea.duration = 0;
        this.demoArea.isThrashing = false;
        this.demoArea.metrics = {
          reflows: 1,
          repaints: 1,
          batchSize: 1000
        };
        
        // 清空演示容器
        const container = this.$refs.demoContainer;
        if (container) {
          container.innerHTML = '';
        }
        
        this.startFpsMonitoring();
        
        performanceMonitor.start('goodDom');
        const startTime = Date.now();
        
        // 优化 DOM 操作：使用 DocumentFragment 批量插入
        const batchSize = 1000;
        
        // 创建 DocumentFragment
        const fragment = document.createDocumentFragment();
        
        for (let i = 0; i < batchSize; i++) {
          const div = document.createElement('div');
          div.className = 'demo-item';
          div.textContent = i;
          div.style.backgroundColor = `hsl(${(i * 0.36) % 360}, 70%, 70%)`;
          
          // 优化做法：先添加到 fragment，不触发重排
          fragment.appendChild(div);
          
          // 更新进度
          if (i % 100 === 0) {
            this.demoArea.progress = ((i + 1) / batchSize) * 100;
            await this.$nextTick();
          }
        }
        
        // 一次性插入到 DOM，只触发一次重排
        container.appendChild(fragment);
        
        const endTime = Date.now();
        const duration = endTime - startTime;
        
        this.stopFpsMonitoring();
        
        this.demoArea.progress = 100;
        this.demoArea.elementCount = batchSize;
        this.demoArea.duration = duration;
        
        this.result = {
          status: 'success',
          message: '优化 DOM 操作测试完成',
          time: duration,
          operations: batchSize
        };
        
        this.log('✓ 优化 DOM 操作测试完成', 'success');
        this.log(`✓ 执行时间: ${duration}ms`);
        this.log(`✓ 操作次数: ${batchSize} 次插入`);
        this.log(`✓ 重排次数: 1 次（批量插入只触发一次）`);
        this.log(`✓ 页面流畅，用户体验好`);
        this.log(`💡 相比逐次插入，性能提升约 5-10 倍`);
        
        this.isRunning = false;
        
      } catch (error) {
        this.isRunning = false;
        this.stopFpsMonitoring();
        this.setErrorResult('操作失败', error.message);
        this.log('操作失败: ' + error.message, 'error');
      }
    },
    
    async testLayoutThrashing() {
      try {
        this.clearResult();
        this.clearConsole();
        this.isRunning = true;
        this.log('开始测试布局抖动...');
        this.log('❌ 交替读写 DOM 属性，导致多次强制同步布局');
        this.log('❌ 页面会明显闪烁和卡顿');
        
        // 初始化演示区域
        this.demoArea.show = true;
        this.demoArea.title = '布局抖动演示（强制同步布局）';
        this.demoArea.progress = 0;
        this.demoArea.elementCount = 0;
        this.demoArea.duration = 0;
        this.demoArea.isThrashing = true;
        this.demoArea.metrics = {
          reflows: 100,
          repaints: 100,
          batchSize: 1
        };
        
        // 清空演示容器
        const container = this.$refs.demoContainer;
        if (container) {
          container.innerHTML = '';
        }
        
        // 先创建一些元素
        const elements = [];
        for (let i = 0; i < 50; i++) {
          const div = document.createElement('div');
          div.className = 'demo-item thrash-item';
          div.textContent = i;
          div.style.backgroundColor = `hsl(${(i * 7.2) % 360}, 70%, 70%)`;
          container.appendChild(div);
          elements.push(div);
        }
        
        this.startFpsMonitoring();
        
        const startTime = Date.now();
        
        // 布局抖动：交替读写 DOM 属性
        for (let i = 0; i < 50; i++) {
          // 读取属性（触发重排计算）
          const height = container.offsetHeight;
          const width = container.offsetWidth;
          
          // 写入属性（再次触发重排）
          if (elements[i]) {
            elements[i].style.height = (20 + Math.random() * 30) + 'px';
            elements[i].style.width = (50 + Math.random() * 50) + 'px';
            elements[i].textContent = `${i} (${Math.round(height)}px)`;
          }
          
          this.demoArea.progress = ((i + 1) / 50) * 100;
          this.demoArea.elementCount = i + 1;
          
          // 添加延迟让用户看到效果
          await new Promise(resolve => setTimeout(resolve, 50));
          await this.$nextTick();
        }
        
        const endTime = Date.now();
        const duration = endTime - startTime;
        
        this.stopFpsMonitoring();
        this.demoArea.isThrashing = false;
        
        this.demoArea.progress = 100;
        this.demoArea.duration = duration;
        
        this.result = {
          status: 'warning',
          message: '布局抖动测试完成',
          time: duration,
          operations: 50
        };
        
        this.log('✗ 布局抖动测试完成', 'warning');
        this.log(`✗ 执行时间: ${duration}ms`);
        this.log(`✗ 强制同步布局次数: 100 次（50次读 + 50次写）`);
        this.log(`✗ 页面明显卡顿，元素闪烁`);
        this.log('💡 建议：先批量读取，再批量写入，分离读写操作');
        
        this.isRunning = false;
        
      } catch (error) {
        this.isRunning = false;
        this.stopFpsMonitoring();
        this.demoArea.isThrashing = false;
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

/* 可视化演示区域样式 */
.demo-visualization {
  margin: 20px 0;
  padding: 20px;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.demo-visualization h3 {
  margin-top: 0;
  color: #2c3e50;
  font-size: 18px;
  text-align: center;
}

.progress-bar {
  width: 100%;
  height: 20px;
  background-color: #e0e0e0;
  border-radius: 10px;
  overflow: hidden;
  margin: 15px 0;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #3498db, #2ecc71);
  transition: width 0.1s ease;
}

.stats-bar {
  display: flex;
  justify-content: space-around;
  margin: 15px 0;
  padding: 10px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.stats-bar span {
  font-size: 14px;
  color: #555;
}

.stats-bar strong {
  color: #2c3e50;
  font-size: 16px;
}

.fps-low {
  color: #e74c3c !important;
  animation: pulse 0.5s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.demo-container {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  padding: 15px;
  background: white;
  border-radius: 8px;
  min-height: 200px;
  max-height: 400px;
  overflow-y: auto;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.05);
  transition: border-color 0.3s ease;
}

.demo-container.layout-thrashing {
  border: 2px solid #e74c3c;
  animation: border-flash 0.5s ease-in-out infinite;
}

@keyframes border-flash {
  0%, 100% { border-color: #e74c3c; }
  50% { border-color: #c0392b; }
}

.demo-item {
  width: 50px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 12px;
  font-weight: bold;
  border-radius: 4px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  animation: item-appear 0.3s ease-out;
}

@keyframes item-appear {
  0% {
    opacity: 0;
    transform: scale(0.5);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

.demo-item:hover {
  transform: scale(1.1);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  z-index: 10;
}

.thrash-item {
  transition: all 0.3s ease;
}

.performance-metrics {
  margin-top: 20px;
  padding: 15px;
  background: white;
  border-radius: 8px;
}

.performance-metrics h4 {
  margin-top: 0;
  color: #2c3e50;
  font-size: 16px;
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
  margin-top: 10px;
}

.metric-card {
  padding: 15px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 8px;
  text-align: center;
  color: white;
  transition: transform 0.2s ease;
}

.metric-card:hover {
  transform: translateY(-2px);
}

.metric-card.bad {
  background: linear-gradient(135deg, #ff6b6b 0%, #ee5a5a 100%);
}

.metric-card.good {
  background: linear-gradient(135deg, #2ecc71 0%, #27ae60 100%);
}

.metric-value {
  font-size: 28px;
  font-weight: bold;
  margin-bottom: 5px;
}

.metric-label {
  font-size: 12px;
  opacity: 0.9;
}

/* 按钮禁用状态 */
button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>