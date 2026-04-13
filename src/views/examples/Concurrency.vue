<template>
  <div class="concurrency-container">
    <div class="header">
      <button class="back-btn" @click="goBackToExamples">
        <i class="back-icon">🏠</i>
        <span>返回案例列表</span>
      </button>
      <h1>第4期：并发陷阱 - 竞态条件与死锁问题</h1>
    </div>

    <div class="case-description">
      <h2>问题描述</h2>
      <p>在多线程环境下，由于并发操作导致的数据不一致、竞态条件和死锁问题。</p>
      <div class="error-message">
        <strong>错误信息：</strong>
        <code>java.lang.Thread.State: BLOCKED (on object monitor)</code>
      </div>
    </div>

    <div class="case-content">
      <div class="demo-section">
        <h2>演示</h2>

        <div class="demo-buttons">
          <button @click="simulateRaceCondition" :class="buttonTypes.danger.class">
            模拟竞态条件
          </button>
          <button @click="simulateDeadlock" :class="buttonTypes.danger.class">
            模拟死锁
          </button>
          <button @click="fixedConcurrency" :class="buttonTypes.success.class">
            修复并发问题
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
            <div class="result-item" v-if="result.counter">
              <strong>计数器值：</strong>{{ result.counter }}
            </div>
            <div class="result-item" v-if="result.expected">
              <strong>预期值：</strong>{{ result.expected }}
            </div>
            <div class="result-item" v-if="result.threads">
              <strong>线程状态：</strong>{{ result.threads }}
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
          <li><strong>使用 synchronized 关键字：</strong>确保同一时间只有一个线程访问共享资源</li>
          <li><strong>使用 Lock 接口：</strong>提供更灵活的锁定机制</li>
          <li><strong>使用线程安全集合：</strong>如 ConcurrentHashMap、CopyOnWriteArrayList 等</li>
          <li><strong>避免死锁：</strong>按顺序获取锁、使用超时机制、避免嵌套锁</li>
          <li><strong>使用原子类：</strong>如 AtomicInteger、AtomicLong 等</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import api from '../../api/api';
import { exampleMixin, exampleStyles } from '../../utils/exampleMixin';

export default {
  name: 'ConcurrencyExample',
  mixins: [exampleMixin],
  data() {
    return {
      errorCode: `// 1. 竞态条件问题
public class RaceConditionDemo {
    private int counter = 0;
    
    public void increment() {
        // 问题：非原子操作，可能导致竞态条件
        counter++;
        // 实际上是三个操作：读取、增加、写入
    }
    
    public int getCounter() {
        return counter;
    }
}

// 2. 死锁问题
public class DeadlockDemo {
    private final Object lock1 = new Object();
    private final Object lock2 = new Object();
    
    public void method1() {
        synchronized (lock1) {
            System.out.println("获得 lock1");
            try {
                Thread.sleep(100);
            } catch (InterruptedException e) {}
            synchronized (lock2) {
                System.out.println("获得 lock2");
                // 执行业务逻辑
            }
        }
    }
    
    public void method2() {
        synchronized (lock2) {
            System.out.println("获得 lock2");
            try {
                Thread.sleep(100);
            } catch (InterruptedException e) {}
            synchronized (lock1) {
                System.out.println("获得 lock1");
                // 执行业务逻辑
            }
        }
    }
}`,
      fixedCode: `// 1. 修复竞态条件
public class RaceConditionFixed {
    // 使用原子类
    private AtomicInteger counter = new AtomicInteger(0);
    
    public void increment() {
        // 原子操作，避免竞态条件
        counter.incrementAndGet();
    }
    
    // 或使用 synchronized
    public synchronized void incrementSync() {
        counter++;
    }
    
    public int getCounter() {
        return counter.get();
    }
}

// 2. 修复死锁
public class DeadlockFixed {
    private final Object lock1 = new Object();
    private final Object lock2 = new Object();
    
    // 按固定顺序获取锁
    public void method1() {
        synchronized (lock1) {
            System.out.println("获得 lock1");
            try {
                Thread.sleep(100);
            } catch (InterruptedException e) {}
            synchronized (lock2) {
                System.out.println("获得 lock2");
                // 执行业务逻辑
            }
        }
    }
    
    // 同样按固定顺序获取锁
    public void method2() {
        synchronized (lock1) { // 先获取 lock1
            System.out.println("获得 lock1");
            try {
                Thread.sleep(100);
            } catch (InterruptedException e) {}
            synchronized (lock2) { // 再获取 lock2
                System.out.println("获得 lock2");
                // 执行业务逻辑
            }
        }
    }
    
    // 或使用 Lock 接口
    private final ReentrantLock lockA = new ReentrantLock();
    private final ReentrantLock lockB = new ReentrantLock();
    
    public void methodWithLock() {
        boolean lockAObtained = false;
        boolean lockBObtained = false;
        
        try {
            // 使用 tryLock 避免死锁
            lockAObtained = lockA.tryLock(1, TimeUnit.SECONDS);
            if (lockAObtained) {
                lockBObtained = lockB.tryLock(1, TimeUnit.SECONDS);
                if (lockBObtained) {
                    // 执行业务逻辑
                }
            }
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        } finally {
            if (lockBObtained) lockB.unlock();
            if (lockAObtained) lockA.unlock();
        }
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
    async simulateRaceCondition() {
      try {
        this.clearResult();
        this.log('开始模拟竞态条件...');
        // 模拟订单处理，使用1作为数量
        const response = await api.examples.concurrency.processOrder(1);
        this.result = response;
        this.log('竞态条件模拟完成', response.status);
      } catch (error) {
        this.setErrorResult('操作失败', error.message);
        this.log('操作失败: ' + error.message, 'error');
      }
    },

    async simulateDeadlock() {
      try {
        this.clearResult();
        this.log('开始检查库存状态...');
        const response = await api.examples.concurrency.getInventory();
        this.result = response;
        this.log('库存状态检查完成', response.status);
      } catch (error) {
        this.setErrorResult('操作失败', error.message);
        this.log('操作失败: ' + error.message, 'error');
      }
    },

    async fixedConcurrency() {
      try {
        this.clearResult();
        this.log('开始修复并发问题...');
        // 模拟使用原子操作处理订单
        const response = await api.examples.concurrency.processOrderFixed(1);
        this.result = response;
        this.log('并发问题修复完成', response.status);
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
.concurrency-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}
</style>