<template>
  <div class="performance-container">
    <div class="header">
      <button class="back-btn" @click="goBackToJSExamples">
        <i class="back-icon">🏠</i>
        <span>返回案例列表</span>
      </button>
      <h1>高级案例：前端性能优化</h1>
    </div>

    <div class="case-description">
      <h2>问题描述</h2>
      <p>前端应用在处理大量数据或复杂交互时，容易出现性能问题，包括渲染性能、内存占用、用户体验等方面的挑战。</p>
      <div class="error-message">
        <strong>常见问题：</strong>
        <code>页面卡顿、内存占用过高、首次加载时间长、交互响应慢</code>
      </div>
    </div>

    <div class="case-content">
      <div class="demo-section">
        <h2>演示</h2>

        <div class="demo-buttons">
          <button @click="testBadRendering" :class="buttonTypes.danger.class">
            测试糟糕的渲染性能
          </button>
          <button @click="testGoodRendering" :class="buttonTypes.success.class">
            测试优化的渲染性能
          </button>
          <button @click="testMemoryLeak" :class="buttonTypes.danger.class">
            测试内存泄漏
          </button>
          <button @click="testMemoryOptimization" :class="buttonTypes.success.class">
            测试内存优化
          </button>
          <button @click="testLazyLoading" :class="buttonTypes.success.class">
            测试懒加载
          </button>
          <button @click="clearData" :class="buttonTypes.secondary.class">
            清空数据
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
            <div class="result-item" v-if="result.renderTime">
              <strong>渲染时间：</strong>{{ result.renderTime }}ms
            </div>
            <div class="result-item" v-if="result.memoryUsage">
              <strong>内存使用：</strong>{{ result.memoryUsage }}
            </div>
            <div class="result-item" v-if="result.itemCount">
              <strong>项目数量：</strong>{{ result.itemCount }}
            </div>
            <div class="result-item" v-if="result.warning">
              <strong>警告：</strong>{{ result.warning }}
            </div>
            <div class="result-item" v-if="result.info">
              <strong>提示：</strong>{{ result.info }}
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

          <div class="code-content" v-show="activeTab === 'rendering'">
            <pre><code v-html="highlightCode(renderingCode)"></code></pre>
          </div>

          <div class="code-content" v-show="activeTab === 'memory'">
            <pre><code v-html="highlightCode(memoryCode)"></code></pre>
          </div>

          <div class="code-content" v-show="activeTab === 'lazy'">
            <pre><code v-html="highlightCode(lazyCode)"></code></pre>
          </div>

          <div class="code-content" v-show="activeTab === 'optimized'">
            <pre><code v-html="highlightCode(optimizedCode)"></code></pre>
          </div>
        </div>
      </div>

      <div class="solution-section">
        <h2>解决方案</h2>
        <ul>
          <li><strong>虚拟DOM优化：</strong>使用key属性、避免不必要的重新渲染</li>
          <li><strong>懒加载：</strong>按需加载组件和资源</li>
          <li><strong>防抖和节流：</strong>优化频繁触发的事件</li>
          <li><strong>内存管理：</strong>及时清理不再使用的对象和事件监听器</li>
          <li><strong>代码分割：</strong>使用动态import减少初始加载时间</li>
          <li><strong>缓存策略：</strong>合理使用本地缓存和CDN</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { exampleMixin, exampleStyles } from '../../utils/exampleMixin';

export default {
  name: 'PerformanceOptimizationExample',
  mixins: [exampleMixin],
  data() {
    return {
      items: [],
      largeData: [],
      
      renderingCode: `// 糟糕的渲染性能示例
&lt;template&gt;
  &lt;div v-for="item in items" :key="item.id"&gt;
    &lt;div&gt;{{ item.name }}&lt;/div&gt;
    &lt;div&gt;{{ item.description }}&lt;/div&gt;
    &lt;div v-if="item.expensive"&gt;
      {{ heavyComputation(item) }}
    &lt;/div&gt;
  &lt;/div&gt;
&lt;/template&gt;

&lt;script&gt;
export default {
  data() {
    return {
      items: Array(10000).fill().map((_, i) => ({
        id: i,
        name: \`Item \${i}\`,
        description: 'Description',
        expensive: true
      }))
    };
  },
  methods: {
    heavyComputation(item) {
      // 每次渲染都执行复杂计算
      let result = 0;
      for (let i = 0; i < 10000; i++) {
        result += Math.sqrt(i);
      }
      return result;
    }
  }
};
&lt;/script&gt;`,
      
      memoryCode: `// 内存泄漏示例
export default {
  data() {
    return {
      largeObjects: [],
      eventListeners: []
    };
  },
  mounted() {
    // 创建大量对象
    for (let i = 0; i < 1000; i++) {
      this.largeObjects.push({
        data: new Array(1000000).fill('memory leak'),
        id: i
      });
    }
    
    // 添加事件监听器但从未移除
    window.addEventListener('resize', this.handleResize);
    window.addEventListener('scroll', this.handleScroll);
  },
  methods: {
    handleResize() {
      console.log('Resize');
    },
    handleScroll() {
      console.log('Scroll');
    }
    // 组件销毁时没有移除事件监听器
  }
};`,
      
      lazyCode: `// 懒加载示例
// 传统方式：一次性加载所有组件
import ComponentA from './ComponentA.vue';
import ComponentB from './ComponentB.vue';
import ComponentC from './ComponentC.vue';

export default {
  components: {
    ComponentA,
    ComponentB,
    ComponentC
  }
  // 所有组件都会在初始加载时打包
};`,
      
      optimizedCode: `// 优化后的代码示例

// 1. 渲染优化
&lt;template&gt;
  &lt;div v-for="item in items" :key="item.id"&gt;
    &lt;div&gt;{{ item.name }}&lt;/div&gt;
    &lt;div&gt;{{ item.description }}&lt;/div&gt;
    &lt;div v-if="item.expensive"&gt;
      {{ computedValues[item.id] }}
    &lt;/div&gt;
  &lt;/div&gt;
&lt;/template&gt;

&lt;script&gt;
export default {
  data() {
    return {
      items: Array(10000).fill().map((_, i) => ({
        id: i,
        name: \`Item \${i}\`,
        description: 'Description',
        expensive: true
      })),
      computedValues: {}
    };
  },
  computed: {
    filteredItems() {
      return this.items.filter(item => item.expensive);
    }
  },
  methods: {
    preCompute() {
      // 预先计算，避免重复计算
      this.computedValues = {};
      this.filteredItems.forEach(item => {
        let result = 0;
        for (let i = 0; i < 10000; i++) {
          result += Math.sqrt(i);
        }
        this.computedValues[item.id] = result;
      });
    }
  },
  mounted() {
    this.preCompute();
  }
};
&lt;/script&gt;

// 2. 内存优化
export default {
  data() {
    return {
      largeObjects: []
    };
  },
  mounted() {
    window.addEventListener('resize', this.handleResize);
    window.addEventListener('scroll', this.handleScroll);
  },
  beforeDestroy() {
    // 组件销毁时清理资源
    window.removeEventListener('resize', this.handleResize);
    window.removeEventListener('scroll', this.handleScroll);
    this.largeObjects = [];
  }
};

// 3. 懒加载优化
export default {
  components: {
    ComponentA: () => import('./ComponentA.vue'),
    ComponentB: () => import('./ComponentB.vue'),
    ComponentC: () => import('./ComponentC.vue')
  }
  // 组件按需加载，减少初始包大小
};`,
      
      buttonTypes: exampleStyles.buttonTypes,
      resultStatus: exampleStyles.resultStatus,
      tabConfigs: {
        rendering: { icon: '🎨', label: '渲染性能' },
        memory: { icon: '💾', label: '内存管理' },
        lazy: { icon: '⏳', label: '懒加载' },
        optimized: { icon: '✅', label: '优化方案' }
      },
      activeTab: 'rendering',
      result: null,
      consoleLogs: []
    };
  },
  methods: {
    async testBadRendering() {
      try {
        this.clearResult();
        this.log('开始测试糟糕的渲染性能...');
        
        const startTime = performance.now();
        
        // 创建大量数据
        this.items = Array(10000).fill().map((_, i) => ({
          id: i,
          name: `Item ${i}`,
          description: 'This is a test item',
          expensive: true
        }));
        
        // 强制重新渲染
        await this.$nextTick();
        
        const renderTime = performance.now() - startTime;
        
        this.result = {
          status: 'success',
          message: '糟糕的渲染性能测试完成',
          renderTime: renderTime.toFixed(2),
          itemCount: this.items.length,
          warning: '渲染时间过长，可能导致页面卡顿',
          details: '创建了10000个项目，每个项目都包含复杂计算'
        };
        
        this.log(`渲染完成，耗时: ${renderTime.toFixed(2)}ms`);
      } catch (error) {
        this.setErrorResult('操作失败', error.message);
        this.log('操作失败: ' + error.message, 'error');
      }
    },
    
    async testGoodRendering() {
      try {
        this.clearResult();
        this.log('开始测试优化的渲染性能...');
        
        const startTime = performance.now();
        
        // 创建大量数据但使用虚拟滚动
        this.items = Array(10000).fill().map((_, i) => ({
          id: i,
          name: `Item ${i}`,
          description: 'This is a test item',
          expensive: false
        }));
        
        // 只渲染可见区域
        const visibleItems = this.items.slice(0, 50);
        
        // 强制重新渲染
        await this.$nextTick();
        
        const renderTime = performance.now() - startTime;
        
        this.result = {
          status: 'success',
          message: '优化的渲染性能测试完成',
          renderTime: renderTime.toFixed(2),
          itemCount: this.items.length,
          info: '使用虚拟滚动优化，只渲染可见项目',
          details: `创建了${this.items.length}个项目，但只渲染${visibleItems.length}个可见项目`
        };
        
        this.log(`渲染完成，耗时: ${renderTime.toFixed(2)}ms`);
      } catch (error) {
        this.setErrorResult('操作失败', error.message);
        this.log('操作失败: ' + error.message, 'error');
      }
    },
    
    async testMemoryLeak() {
      try {
        this.clearResult();
        this.log('开始测试内存泄漏...');
        
        // 创建大量对象
        this.largeData = [];
        for (let i = 0; i < 1000; i++) {
          this.largeData.push({
            data: new Array(1000000).fill('memory leak'),
            id: i
          });
        }
        
        // 获取内存使用情况
        const memoryUsage = await this.getMemoryUsage();
        
        this.result = {
          status: 'success',
          message: '内存泄漏测试完成',
          memoryUsage: memoryUsage,
          itemCount: this.largeData.length,
          warning: '大量对象占用内存，可能导致内存泄漏',
          details: '创建了1000个大对象，每个对象包含100万个元素'
        };
        
        this.log(`内存泄漏测试完成，创建了${this.largeData.length}个大对象`);
      } catch (error) {
        this.setErrorResult('操作失败', error.message);
        this.log('操作失败: ' + error.message, 'error');
      }
    },
    
    async testMemoryOptimization() {
      try {
        this.clearResult();
        this.log('开始测试内存优化...');
        
        // 使用弱引用或及时清理
        this.largeData = [];
        
        // 触发垃圾回收
        if (typeof window.gc === 'function') {
          window.gc();
        }
        
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // 获取内存使用情况
        const memoryUsage = await this.getMemoryUsage();
        
        this.result = {
          status: 'success',
          message: '内存优化测试完成',
          memoryUsage: memoryUsage,
          info: '已清理大对象并触发垃圾回收',
          details: '通过及时清理和垃圾回收优化内存使用'
        };
        
        this.log('内存优化测试完成');
      } catch (error) {
        this.setErrorResult('操作失败', error.message);
        this.log('操作失败: ' + error.message, 'error');
      }
    },
    
    async testLazyLoading() {
      try {
        this.clearResult();
        this.log('开始测试懒加载...');
        
        const startTime = performance.now();
        
        // 模拟懒加载
        const loadChunk = async (chunkId) => {
          return new Promise(resolve => {
            setTimeout(() => {
              resolve({
                id: chunkId,
                data: new Array(1000).fill('chunk data')
              });
            }, 100);
          });
        };
        
        // 按需加载
        const chunks = [];
        for (let i = 0; i < 10; i++) {
          const chunk = await loadChunk(i);
          chunks.push(chunk);
          this.log(`已加载块 ${i + 1}/10`);
        }
        
        const loadTime = performance.now() - startTime;
        
        this.result = {
          status: 'success',
          message: '懒加载测试完成',
          renderTime: loadTime.toFixed(2),
          itemCount: chunks.length,
          info: '使用懒加载，按需加载数据块',
          details: '按需加载10个数据块，减少初始加载时间'
        };
        
        this.log(`懒加载完成，总耗时: ${loadTime.toFixed(2)}ms`);
      } catch (error) {
        this.setErrorResult('操作失败', error.message);
        this.log('操作失败: ' + error.message, 'error');
      }
    },
    
    clearData() {
      this.items = [];
      this.largeData = [];
      this.clearResult();
      this.log('数据已清空');
    },
    
    async getMemoryUsage() {
      if (performance && performance.memory) {
        const memory = performance.memory;
        const used = (memory.usedJSHeapSize / 1024 / 1024).toFixed(2);
        const total = (memory.totalJSHeapSize / 1024 / 1024).toFixed(2);
        const limit = (memory.jsHeapSizeLimit / 1024 / 1024).toFixed(2);
        return `${used} MB / ${total} MB (上限: ${limit} MB)`;
      }
      return '无法获取内存使用情况';
    },
    
    switchTab(tab) {
      this.activeTab = tab;
    },
    
    clearConsole() {
      this.consoleLogs = [];
    },
    
    log(message) {
      this.consoleLogs.push(`[${new Date().toLocaleTimeString()}] ${message}`);
    },
    
    clearResult() {
      this.result = null;
    },
    
    setErrorResult(message, error) {
      this.result = {
        status: 'error',
        message: message,
        error: error
      };
    },
    
    goBackToJSExamples() {
      this.$router.push('/js-examples');
    }
  }
}
</script>

<style scoped>
/* 只保留组件特有的样式，通用样式已移至 common.css */
.performance-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.demo-buttons button.disabled {
  background-color: #ccc !important;
  cursor: not-allowed !important;
  transform: none !important;
  box-shadow: none !important;
}

.console {
  background-color: #1e1e1e;
  color: #d4d4d4;
  padding: 15px;
  border-radius: 4px;
  font-family: 'Courier New', monospace;
  font-size: 14px;
  max-height: 300px;
  overflow-y: auto;
}

.log-item {
  margin: 5px 0;
  padding: 2px 0;
  border-bottom: 1px solid #333;
}
</style>