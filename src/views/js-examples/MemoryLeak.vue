<template>
  <div class="js-memoryleak-container">
    <div class="header">
      <button class="back-btn" @click="goBackToJSExamples">
        <i class="back-icon">🏠</i>
        <span>返回案例列表</span>
      </button>
      <h1>第2期：内存泄漏问题</h1>
    </div>

    <div class="case-description">
      <h2>问题描述</h2>
      <p>JavaScript 中常见的内存泄漏问题，包括闭包、事件监听器、定时器、全局变量等导致的内存泄漏。</p>
    </div>

    <div class="case-content">
      <div class="demo-section">
        <h2>演示</h2>

        <div class="demo-buttons">
          <button @click="simulateClosureLeak" :class="buttonTypes.danger.class">
            模拟闭包泄漏
          </button>
          <button @click="simulateListenerLeak" :class="buttonTypes.danger.class">
            模拟监听器泄漏
          </button>
          <button @click="simulateTimerLeak" :class="buttonTypes.danger.class">
            模拟定时器泄漏
          </button>
          <button @click="fixedMemoryLeak" :class="buttonTypes.success.class">
            修复内存泄漏
          </button>
          <button @click="clearMemory" :class="buttonTypes.secondary.class">
            清理内存
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
            <div class="result-item" v-if="result.memoryUsage">
              <strong>内存使用：</strong>{{ result.memoryUsage }}
            </div>
            <div class="result-item" v-if="result.objects">
              <strong>对象数量：</strong>{{ result.objects }}
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
          <li><strong>闭包泄漏：</strong>避免在闭包中引用大对象，及时解除引用</li>
          <li><strong>事件监听器：</strong>组件销毁时移除事件监听器</li>
          <li><strong>定时器：</strong>组件销毁时清除定时器</li>
          <li><strong>全局变量：</strong>避免过多使用全局变量，及时设置为 null</li>
          <li><strong>DOM 引用：</strong>移除 DOM 元素时，同时解除相关引用</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import api from '../../api/api';
import { exampleMixin, exampleStyles, memoryMonitor } from '../../utils/exampleMixin';

export default {
  name: 'JSMemoryLeakExample',
  mixins: [exampleMixin],
  data() {
    return {
      errorCode: `// 1. 闭包泄漏
function createClosureLeak() {
  const largeObject = new Array(1000000).fill('data');
  
  return function() {
    // 闭包持有 largeObject 的引用
    console.log('Closure called');
    // 问题：即使外部不再需要 largeObject，由于闭包引用，它也不会被垃圾回收
  };
}

const leakyFunction = createClosureLeak();

// 2. 事件监听器泄漏
function addListenerLeak() {
  const element = document.getElementById('someElement');
  
  element.addEventListener('click', function() {
    console.log('Element clicked');
  });
  
  // 问题：即使 element 被移除，事件监听器仍然存在，可能导致内存泄漏
  element.remove();
}

// 3. 定时器泄漏
function startTimerLeak() {
  const data = new Array(1000000).fill('timer data');
  
  setInterval(function() {
    console.log('Timer tick', data.length);
    // 问题：定时器持有 data 的引用，即使不再需要，也不会被垃圾回收
  }, 1000);
  
  // 问题：没有清除定时器
}

// 4. 全局变量泄漏
function globalVariableLeak() {
  // 问题：全局变量不会被垃圾回收
  window.largeData = new Array(1000000).fill('global data');
}`,
      fixedCode: `// 1. 修复闭包泄漏
function createClosureFixed() {
  let largeObject = new Array(1000000).fill('data');
  
  return function() {
    console.log('Closure called');
  };
}

const fixedFunction = createClosureFixed();
// 不再需要时，可以解除引用
// fixedFunction = null;

// 2. 修复事件监听器泄漏
function addListenerFixed() {
  const element = document.getElementById('someElement');
  
  function handleClick() {
    console.log('Element clicked');
  }
  
  element.addEventListener('click', handleClick);
  
  // 解决方案：移除元素前先移除事件监听器
  element.removeEventListener('click', handleClick);
  element.remove();
}

// 3. 修复定时器泄漏
function startTimerFixed() {
  let data = new Array(1000000).fill('timer data');
  
  const timerId = setInterval(function() {
    console.log('Timer tick', data.length);
  }, 1000);
  
  // 解决方案：在适当的时候清除定时器
  setTimeout(function() {
    clearInterval(timerId);
    // 解除引用
    data = null;
  }, 5000);
}

// 4. 修复全局变量泄漏
function globalVariableFixed() {
  // 解决方案：使用局部变量
  function processData() {
    const largeData = new Array(1000000).fill('local data');
    // 处理数据...
  }
  
  processData();
  // largeData 会在函数执行完毕后被垃圾回收
  
  // 或者在不再需要时设置为 null
  // window.largeData = null;
}`,
      buttonTypes: exampleStyles.buttonTypes,
      resultStatus: exampleStyles.resultStatus,
      tabConfigs: {
        error: exampleStyles.tabs.error,
        fixed: exampleStyles.tabs.fixed
      },
      timerId: null,
      eventHandlers: {},
      elements: {}
    };
  },
  methods: {
    async simulateClosureLeak() {
      try {
        this.clearResult();
        this.log('开始模拟闭包泄漏...');
        
        // 模拟闭包泄漏
        const result = await new Promise((resolve) => {
          const startTime = Date.now();
          
          // 模拟闭包泄漏
          function createClosureLeak() {
            const largeObject = new Array(1000000).fill('data');
            
            return function() {
              console.log('Closure called');
            };
          }
          
          const leakyFunction = createClosureLeak();
          
          // 模拟一些操作
          for (let i = 0; i < 100; i++) {
            leakyFunction();
          }
          
          // 设置全局变量，用于演示内存清理
          window.largeData = new Array(1000000).fill('global data');
          
          resolve({
            status: 'success',
            message: '闭包泄漏模拟完成',
            time: Date.now() - startTime,
            memoryUsage: '可能增加（闭包持有大对象引用）',
            objects: '1000000+'
          });
        });
        
        this.result = result;
        this.log('闭包泄漏模拟完成', result.status);
        this.log(`内存使用: ${result.memoryUsage}`);
      } catch (error) {
        this.setErrorResult('操作失败', error.message);
        this.log('操作失败: ' + error.message, 'error');
      }
    },

    async simulateListenerLeak() {
      try {
        this.clearResult();
        this.log('开始模拟监听器泄漏...');
        
        // 模拟监听器泄漏
        const result = await new Promise((resolve) => {
          const startTime = Date.now();
          
          // 创建一个临时元素
          const element = document.createElement('div');
          element.id = 'test-element';
          document.body.appendChild(element);
          
          // 保存元素引用
          this.elements['test-element'] = element;
          
          // 创建事件处理器函数
          const clickHandler = function() {
            console.log('Element clicked');
          };
          
          // 保存事件处理器引用
          this.eventHandlers['test-element'] = clickHandler;
          
          // 添加事件监听器
          element.addEventListener('click', clickHandler);
          
          // 移除元素但不移除监听器（模拟泄漏）
          element.remove();
          
          resolve({
            status: 'success',
            message: '监听器泄漏模拟完成',
            time: Date.now() - startTime,
            memoryUsage: '可能增加（事件监听器未移除）',
            objects: '1+'
          });
        });
        
        this.result = result;
        this.log('监听器泄漏模拟完成', result.status);
        this.log(`内存使用: ${result.memoryUsage}`);
      } catch (error) {
        this.setErrorResult('操作失败', error.message);
        this.log('操作失败: ' + error.message, 'error');
      }
    },

    async simulateTimerLeak() {
      try {
        this.clearResult();
        this.log('开始模拟定时器泄漏...');
        
        // 模拟定时器泄漏
        const result = await new Promise((resolve) => {
          const startTime = Date.now();
          
          // 模拟定时器泄漏
          const data = new Array(1000000).fill('timer data');
          
          // 保存定时器ID到组件实例
          this.timerId = setInterval(function() {
            console.log('Timer tick', data.length);
          }, 1000);
          
          // 模拟一段时间后返回结果
          setTimeout(() => {
            resolve({
              status: 'success',
              message: '定时器泄漏模拟完成',
              time: Date.now() - startTime,
              memoryUsage: '可能增加（定时器持有数据引用）',
              objects: '1000000+'
            });
          }, 2000);
        });
        
        this.result = result;
        this.log('定时器泄漏模拟完成', result.status);
        this.log(`内存使用: ${result.memoryUsage}`);
      } catch (error) {
        this.setErrorResult('操作失败', error.message);
        this.log('操作失败: ' + error.message, 'error');
      }
    },

    async fixedMemoryLeak() {
      try {
        this.clearResult();
        this.log('开始修复内存泄漏...');
        
        // 模拟修复内存泄漏
        const result = await new Promise((resolve) => {
          const startTime = Date.now();
          
          // 模拟修复闭包泄漏
          function createClosureFixed() {
            let largeObject = new Array(1000000).fill('data');
            
            return function() {
              console.log('Closure called');
            };
          }
          
          let fixedFunction = createClosureFixed();
          // 解除引用
          fixedFunction = null;
          
          // 模拟修复事件监听器泄漏
          const element = document.createElement('div');
          element.id = 'test-element-2';
          document.body.appendChild(element);
          
          function handleClick() {
            console.log('Element clicked');
          }
          
          element.addEventListener('click', handleClick);
          element.removeEventListener('click', handleClick);
          element.remove();
          
          // 模拟修复定时器泄漏
          let data = new Array(1000000).fill('timer data');
          
          const timerId = setInterval(function() {
            console.log('Timer tick', data.length);
          }, 1000);
          
          clearInterval(timerId);
          data = null;
          
          // 清除之前可能存在的定时器
          if (this.timerId) {
            clearInterval(this.timerId);
            this.timerId = null;
            this.log('已清除之前的定时器');
          }
          
          // 清理事件监听器
          for (const [key, element] of Object.entries(this.elements)) {
            const handler = this.eventHandlers[key];
            if (element && handler) {
              element.removeEventListener('click', handler);
              this.log(`已清除元素 ${key} 的事件监听器`);
            }
          }
          
          // 清空引用
          this.elements = {};
          this.eventHandlers = {};
          
          resolve({
            status: 'success',
            message: '内存泄漏修复完成',
            time: Date.now() - startTime,
            memoryUsage: '已优化',
            objects: '已清理'
          });
        });
        
        this.result = result;
        this.log('内存泄漏修复完成', result.status);
        this.log(`内存使用: ${result.memoryUsage}`);
      } catch (error) {
        this.setErrorResult('操作失败', error.message);
        this.log('操作失败: ' + error.message, 'error');
      }
    },

    async clearMemory() {
      try {
        this.clearResult();
        this.log('开始清理内存...');
        
        // 模拟清理内存
        const result = await new Promise((resolve) => {
          const startTime = Date.now();
          
          // 模拟清理全局变量
          if (window.largeData) {
            window.largeData = null;
          }
          
          // 清除定时器
          if (this.timerId) {
            clearInterval(this.timerId);
            this.timerId = null;
            this.log('已清除定时器');
          }
          
          // 清理事件监听器
          for (const [key, element] of Object.entries(this.elements)) {
            const handler = this.eventHandlers[key];
            if (element && handler) {
              element.removeEventListener('click', handler);
              this.log(`已清除元素 ${key} 的事件监听器`);
            }
          }
          
          // 清空引用
          this.elements = {};
          this.eventHandlers = {};
          
          // 触发垃圾回收（如果可用）
          if (window.gc) {
            window.gc();
          }
          
          resolve({
            status: 'success',
            message: '内存清理完成',
            time: Date.now() - startTime,
            memoryUsage: '已清理',
            objects: '已释放'
          });
        });
        
        this.result = result;
        this.log('内存清理完成', result.status);
        this.log(`内存使用: ${result.memoryUsage}`);
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
.js-memoryleak-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}
</style>