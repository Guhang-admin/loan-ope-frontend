<template>
  <div class="memoryleak-container">
    <div class="header">
      <button class="back-btn" @click="goBackToExamples">
        <i class="back-icon">🏠</i>
        <span>返回案例列表</span>
      </button>
      <h1>第3期：内存异常 - 内存泄漏问题</h1>
    </div>

    <div class="case-description">
      <h2>问题描述</h2>
      <p>系统运行一段时间后，内存使用量持续增长，最终导致 OOM (Out Of Memory) 错误。</p>
      <div class="error-message">
        <strong>错误信息：</strong>
        <code>java.lang.OutOfMemoryError: Java heap space</code>
      </div>
    </div>

    <div class="case-content">
      <div class="demo-section">
        <h2>演示</h2>

        <div class="demo-buttons">
          <button @click="simulateMemoryLeak" :class="buttonTypes.danger.class">
            模拟内存泄漏（单条）
          </button>
          <button @click="simulateMemoryLeakBatch" :class="buttonTypes.danger.class">
            批量模拟内存泄漏
          </button>
          <button @click="checkMemoryStatus" :class="buttonTypes.success.class">
            检查内存状态
          </button>
          <button @click="showNormalCase" :class="buttonTypes.primary.class">
            展示正常情况
          </button>
          <button @click="clearMemory" :class="buttonTypes.secondary.class">
            清理内存
          </button>
        </div>

        <div class="memory-status-section">
          <h3>内存状态</h3>
          <div class="memory-usage">
            <div class="memory-bar-container">
              <div class="memory-bar" :style="{ width: memoryUsagePercent + '%' }"></div>
            </div>
            <div class="memory-info">
              <span v-if="memoryInfo">{{ memoryInfo }}</span>
              <span v-else>请点击按钮查看内存状态</span>
            </div>
          </div>
          <div class="cache-info">
            <div class="cache-item">
              <strong>缓存对象数量：</strong>
              <span>{{ cacheSize || 0 }}</span>
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
            <div class="result-item" v-if="result.memoryUsage">
              <strong>内存使用：</strong>{{ result.memoryUsage }}
            </div>
            <div class="result-item" v-if="result.objectCount">
              <strong>对象数量：</strong>{{ result.objectCount }}
            </div>
          </div>
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
            <pre><code v-html="highlightCode(errorCode, 'java')"></code></pre>
          </div>

          <div class="code-content" v-show="activeTab === 'fixed'">
            <pre><code v-html="highlightCode(fixedCode, 'java')"></code></pre>
          </div>
        </div>
      </div>

      <div class="solution-section">
        <h2>解决方案</h2>
        <ul>
          <li><strong>正确关闭资源：</strong>使用 try-with-resources 或在 finally 块中关闭资源</li>
          <li><strong>避免内存泄漏：</strong>注意缓存大小、避免循环引用、及时清理监听器</li>
          <li><strong>使用弱引用：</strong>对缓存等使用 WeakHashMap 等弱引用集合</li>
          <li><strong>内存监控：</strong>设置内存使用阈值，配置自动告警</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import api from '../../api/api';
import { exampleMixin, exampleStyles } from '../../utils/exampleMixin';

export default {
  name: 'MemoryLeakExample',
  mixins: [exampleMixin],
  data() {
    return {
      errorCode: `public class MemoryLeakDemo {
    // 静态集合，持有对象引用
    private static List<User> userCache = new ArrayList<>();
    
    public void addUser(User user) {
        userCache.add(user);
        // 问题：对象添加到静态集合后，即使不再使用也不会被垃圾回收
    }
    
    public void processData() {
        // 大对象创建
        byte[] data = new byte[1024 * 1024 * 100]; // 100MB
        // 处理数据...
        // 问题：方法执行完毕后，data 变量作用域结束，但可能被其他引用持有
    }
    
    public void registerListener() {
        EventListener listener = new EventListener() {
            @Override
            public void onEvent(Event event) {
                // 处理事件
            }
        };
        EventBus.register(listener);
        // 问题：注册监听器后没有取消注册，可能导致内存泄漏
    }
}`,
      fixedCode: `public class MemoryLeakFixed {
    // 使用弱引用集合
    private static Map<Long, WeakReference<User>> userCache = new WeakHashMap<>();
    
    public void addUser(User user) {
        userCache.put(user.getId(), new WeakReference<>(user));
        // 解决方案：使用弱引用，当对象不再被其他地方引用时可以被垃圾回收
    }
    
    public void processData() {
        {
            // 大对象创建，限制作用域
            byte[] data = new byte[1024 * 1024 * 100]; // 100MB
            // 处理数据...
        }
        // 解决方案：限制变量作用域，方法执行完毕后对象可以被垃圾回收
        System.gc(); // 提示垃圾回收
    }
    
    private EventListener listener;
    
    public void registerListener() {
        listener = new EventListener() {
            @Override
            public void onEvent(Event event) {
                // 处理事件
            }
        };
        EventBus.register(listener);
    }
    
    public void unregisterListener() {
        if (listener != null) {
            EventBus.unregister(listener);
            listener = null;
        }
        // 解决方案：提供取消注册的方法，在适当的时候调用
    }
    
    @Override
    protected void finalize() throws Throwable {
        unregisterListener();
        super.finalize();
    }
}`,
      buttonTypes: exampleStyles.buttonTypes,
      resultStatus: exampleStyles.resultStatus,
      tabConfigs: {
        error: exampleStyles.tabs.error,
        fixed: exampleStyles.tabs.fixed
      },
      memoryUsagePercent: 0,
      memoryInfo: null,
      cacheSize: 0
    };
  },
  mounted() {
    // 页面加载时自动检查内存状态，展示正常情况
    this.checkMemoryStatus(false);
  },
  methods: {
    updateMemoryStatus(response) {
      if (response.memoryUsage) {
        this.memoryInfo = response.memoryUsage;
        // 提取内存使用百分比
        const match = response.memoryUsage.match(/\(([\d.]+)%\)/);
        if (match) {
          this.memoryUsagePercent = parseFloat(match[1]);
        }
      }
      if (response.cacheSize !== undefined) {
        this.cacheSize = response.cacheSize;
      }
    },

    async simulateMemoryLeak() {
      try {
        this.clearResult();
        this.log('开始模拟内存泄漏...');
        // 生成随机ID和数据
        const id = Date.now();
        const data = '模拟内存泄漏数据'.repeat(1000);
        const response = await api.examples.memoryleak.addToCache(id, data);
        this.result = response;
        this.updateMemoryStatus(response);
        this.log('内存泄漏模拟完成', response.status);
      } catch (error) {
        this.setErrorResult('操作失败', error.message);
        this.log('操作失败: ' + error.message, 'error');
      }
    },

    async simulateMemoryLeakBatch() {
      try {
        this.clearResult();
        this.log('开始批量模拟内存泄漏...');
        // 批量添加100条数据，加速内存泄漏
        const response = await api.examples.memoryleak.addMultipleToCache(100);
        this.result = response;
        this.updateMemoryStatus(response);
        this.log('批量内存泄漏模拟完成', response.status);
      } catch (error) {
        this.setErrorResult('操作失败', error.message);
        this.log('操作失败: ' + error.message, 'error');
      }
    },

    async checkMemoryStatus(showResult = true) {
      try {
        if (showResult) {
          this.clearResult();
          this.log('开始检查内存状态...');
        }
        const response = await api.examples.memoryleak.getCacheStatus();
        if (showResult) {
          this.result = response;
          this.log('内存状态检查完成', response.status);
        }
        this.updateMemoryStatus(response);
      } catch (error) {
        this.setErrorResult('操作失败', error.message);
        this.log('操作失败: ' + error.message, 'error');
      }
    },

    async clearMemory() {
      try {
        this.clearResult();
        this.log('开始清理内存...');
        const response = await api.examples.memoryleak.clearCache();
        this.result = response;
        this.updateMemoryStatus(response);
        this.log('内存清理完成', response.status);
      } catch (error) {
        this.setErrorResult('操作失败', error.message);
        this.log('操作失败: ' + error.message, 'error');
      }
    },

    async showNormalCase() {
      try {
        this.clearResult();
        this.log('展示正常情况...');
        // 先清理内存
        await api.examples.memoryleak.clearCache();
        // 然后检查内存状态
        const response = await api.examples.memoryleak.getCacheStatus();
        this.result = response;
        this.updateMemoryStatus(response);
        this.log('正常情况展示完成', response.status);
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
.memoryleak-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.memory-status-section {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
}

.memory-status-section h3 {
  margin-top: 0;
  margin-bottom: 15px;
  color: #333;
}

.memory-usage {
  margin-bottom: 15px;
}

.memory-bar-container {
  width: 100%;
  height: 20px;
  background: #e9ecef;
  border-radius: 10px;
  overflow: hidden;
  margin-bottom: 10px;
}

.memory-bar {
  height: 100%;
  background: linear-gradient(90deg, #28a745, #ffc107, #dc3545);
  border-radius: 10px;
  transition: width 0.3s ease;
}

.memory-info {
  text-align: center;
  font-weight: bold;
  color: #495057;
}

.cache-info {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-top: 10px;
}

.cache-item {
  background: white;
  padding: 10px 15px;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.demo-buttons {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-bottom: 20px;
}

.demo-buttons button {
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  font-weight: bold;
  transition: all 0.3s ease;
}

.demo-buttons button:hover {
  transform: translateY(-2px);
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

/* 响应式调整 */
@media (max-width: 768px) {
  .memoryleak-container {
    padding: 10px;
  }
  
  .demo-buttons {
    flex-direction: column;
  }
  
  .demo-buttons button {
    width: 100%;
  }
}
</style>