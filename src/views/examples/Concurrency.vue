<template>
  <div class="concurrency-container">
    <div class="header">
      <button class="back-btn" @click="goBack">
        <i class="back-icon">🏠</i>
        <span>返回主页面</span>
      </button>
      <h1>第4期：并发陷阱 - 线程安全和锁竞争问题</h1>
    </div>
    
    <div class="case-description">
      <h2>问题描述</h2>
      <p>在高并发场景下，系统出现数据不一致、死锁、线程阻塞等问题，如订单重复处理、库存数量错误等。</p>
    </div>
    
    <div class="case-content">
      <div class="demo-section">
        <h2>演示</h2>
        
        <div class="order-form">
          <div class="form-group">
            <label>订单数量：</label>
            <input type="number" v-model="orderQuantity" placeholder="请输入数量">
          </div>
          <div class="form-actions">
            <button @click="processOrder" class="btn btn-danger">
              处理订单（竞态条件）
            </button>
            <button @click="processOrderFixed" class="btn btn-success">
              处理订单（原子操作）
            </button>
            <button @click="getInventory" class="btn btn-info">
              查看库存
            </button>
            <button @click="resetInventory" class="btn btn-warning">
              重置库存
            </button>
          </div>
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
            <div class="result-item" v-if="result.inventory">
              <strong>库存：</strong>{{ result.inventory }}
            </div>
            <div class="result-item" v-if="result.warning">
              <strong>警告：</strong>{{ result.warning }}
            </div>
            <div class="result-item" v-if="result.info">
              <strong>提示：</strong>{{ result.info }}
            </div>
            <div class="result-item" v-if="result.error">
              <strong>错误：</strong>{{ result.error }}
            </div>
          </div>
        </div>
        
        <div class="concurrency-test">
          <h3>并发测试</h3>
          <p>模拟多个用户同时下单的场景</p>
          <button @click="testConcurrency" class="btn btn-primary">
            开始并发测试
          </button>
          <div class="test-results" v-if="testResults.length > 0">
            <h4>测试结果</h4>
            <ul>
              <li v-for="(result, index) in testResults" :key="index">
                {{ result }}
              </li>
            </ul>
          </div>
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
          <li><strong>使用原子类：</strong>对于简单的计数器，使用 AtomicInteger 等原子类</li>
          <li><strong>合理使用锁：</strong>使用 synchronized 或 Lock 机制</li>
          <li><strong>避免死锁：</strong>固定锁顺序，减少锁的范围</li>
          <li><strong>使用并发工具：</strong>如 CountDownLatch、CyclicBarrier 等</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import api from '../../api/api';

export default {
  name: 'ConcurrencyExample',
  data() {
    return {
      orderQuantity: 10,
      result: null,
      testResults: [],
      activeTab: 'error',
      errorCode: `public void processOrder(int quantity) {
    // 问题：竞态条件
    if (inventory >= quantity) {
        // 模拟处理时间
        try {
            Thread.sleep(100);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
        inventory -= quantity;
        System.out.println("Order processed, remaining inventory: " + inventory);
    } else {
        System.out.println("Insufficient inventory");
    }
}`,
      fixedCode: `public void processOrderAtomic(int quantity) {
    while (true) {
        int current = inventory.get();
        if (current < quantity) {
            System.out.println("Insufficient inventory");
            return;
        }
        if (inventory.compareAndSet(current, current - quantity)) {
            System.out.println("Order processed, remaining inventory: " + inventory.get());
            return;
        }
        // 竞争失败，重试
    }
}`
    };
  },
  methods: {
    goBack() {
      this.$router.push('/');
    },
    async processOrder() {
      try {
        this.result = await api.examples.concurrency.processOrder(this.orderQuantity);
      } catch (error) {
        this.result = {
          status: 'error',
          message: '操作失败',
          error: error.message
        };
      }
    },
    async processOrderFixed() {
      try {
        this.result = await api.examples.concurrency.processOrderFixed(this.orderQuantity);
      } catch (error) {
        this.result = {
          status: 'error',
          message: '操作失败',
          error: error.message
        };
      }
    },
    async getInventory() {
      try {
        this.result = await api.examples.concurrency.getInventory();
      } catch (error) {
        this.result = {
          status: 'error',
          message: '操作失败',
          error: error.message
        };
      }
    },
    async resetInventory() {
      try {
        this.result = await api.examples.concurrency.resetInventory();
      } catch (error) {
        this.result = {
          status: 'error',
          message: '操作失败',
          error: error.message
        };
      }
    },
    async testConcurrency() {
      this.testResults = [];
      const testCount = 5;
      
      for (let i = 0; i < testCount; i++) {
        try {
          const result = await api.examples.concurrency.processOrder(10);
          this.testResults.push(`测试 ${i+1}: ${result.message}, 库存: ${result.inventory}`);
        } catch (error) {
          this.testResults.push(`测试 ${i+1}: 失败 - ${error.message}`);
        }
        // 等待一下，模拟并发
        await new Promise(resolve => setTimeout(resolve, 50));
      }
    }
  }
}
</script>

<style scoped>
.concurrency-container {
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

.order-form {
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: inline-block;
  width: 100px;
  font-weight: 500;
}

.form-group input {
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  width: 200px;
}

.form-actions {
  margin-top: 20px;
}

.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  margin-right: 10px;
  margin-bottom: 10px;
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

.btn-warning {
  background: #ffc107;
  color: #212529;
}

.btn-primary {
  background: #007bff;
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

.concurrency-test {
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #eee;
}

.test-results {
  margin-top: 20px;
  padding: 10px;
  background: #f8f9fa;
  border-radius: 4px;
}

.test-results ul {
  padding-left: 20px;
  margin: 0;
}

.test-results li {
  margin-bottom: 5px;
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
</style>