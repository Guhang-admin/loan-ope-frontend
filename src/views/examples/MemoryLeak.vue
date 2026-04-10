<template>
  <div class="memoryleak-container">
    <div class="header">
      <button class="back-btn" @click="goBack">
        <i class="back-icon">🏠</i>
        <span>返回主页面</span>
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
            模拟内存泄漏
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
      }
    };
  },
  methods: {
    async simulateMemoryLeak() {
      try {
        this.clearResult();
        this.log('开始模拟内存泄漏...');
        const response = await api.examples.memoryleak.simulateLeak();
        this.result = response;
        this.log('内存泄漏模拟完成', response.status);
      } catch (error) {
        this.setErrorResult('操作失败', error.message);
        this.log('操作失败: ' + error.message, 'error');
      }
    },

    async fixedMemoryLeak() {
      try {
        this.clearResult();
        this.log('开始修复内存泄漏...');
        const response = await api.examples.memoryleak.fixedLeak();
        this.result = response;
        this.log('内存泄漏修复完成', response.status);
      } catch (error) {
        this.setErrorResult('操作失败', error.message);
        this.log('操作失败: ' + error.message, 'error');
      }
    },

    async clearMemory() {
      try {
        this.clearResult();
        this.log('开始清理内存...');
        const response = await api.examples.memoryleak.clearMemory();
        this.result = response;
        this.log('内存清理完成', response.status);
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
</style>