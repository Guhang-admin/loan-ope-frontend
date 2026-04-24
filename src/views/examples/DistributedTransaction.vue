<template>
  <div class="example-container">
    <div class="header">
      <button class="back-btn" @click="goBackToExamples">
        <i class="back-icon">🏠</i>
        <span>返回案例列表</span>
      </button>
      <h1>高级案例：分布式事务问题</h1>
    </div>

    <div class="case-description">
      <h2>问题描述</h2>
      <p>在分布式系统中，如何保证跨多个服务或数据库的数据一致性是一个挑战。本案例演示了分布式事务的各种模式和问题。</p>
      <div class="error-message">
        <strong>常见问题：</strong>
        <code>两阶段提交失败、TCC模式异常、Saga补偿失败、数据不一致</code>
      </div>
    </div>

    <div class="case-content">
      <div class="demo-section">
        <h2>演示</h2>

        <div class="demo-controls">
          <div class="input-group">
            <label>转出账户ID：</label>
            <input type="number" v-model.number="fromAccountId" min="1" max="3" />
          </div>
          <div class="input-group">
            <label>转入账户ID：</label>
            <input type="number" v-model.number="toAccountId" min="1" max="3" />
          </div>
          <div class="input-group">
            <label>转账金额：</label>
            <input type="number" v-model.number="amount" min="100" max="5000" step="100" />
          </div>
        </div>

        <div class="demo-buttons">
          <button 
            @click="testTwoPhaseCommit" 
            :class="[buttonTypes.danger.class, { 'disabled': isLoading }]"
            :disabled="isLoading"
          >
            测试两阶段提交（2PC）
          </button>
          <button 
            @click="testTCCPattern" 
            :class="[buttonTypes.secondary.class, { 'disabled': isLoading }]"
            :disabled="isLoading"
          >
            测试TCC模式
          </button>
          <button 
            @click="testSagaPattern" 
            :class="[buttonTypes.secondary.class, { 'disabled': isLoading }]"
            :disabled="isLoading"
          >
            测试Saga模式
          </button>
          <button 
            @click="resetData" 
            :class="[buttonTypes.secondary.class, { 'disabled': isLoading }]"
            :disabled="isLoading"
          >
            重置数据
          </button>
        </div>

        <div class="result-section" v-if="result || isLoading">
          <h3>结果</h3>
          <div class="result-card result-card-info" v-if="isLoading">
            <div class="result-item">
              <strong>状态：</strong>⏳ 处理中
            </div>
            <div class="result-item">
              <strong>消息：</strong>正在处理，请稍候...
            </div>
          </div>
          <div class="result-card" v-else :class="resultStatus[result.success === true ? 'success' : 'error'].class">
            <div class="result-item">
              <strong>状态：</strong>{{ resultStatus[result.success === true ? 'success' : 'error'].icon }} {{ resultStatus[result.success === true ? 'success' : 'error'].label }}
            </div>
            <div class="result-item">
              <strong>消息：</strong>{{ result.message }}
            </div>
            <div class="result-item" v-if="result.transactionId">
              <strong>事务ID：</strong>{{ result.transactionId }}
            </div>
            <div class="result-item" v-if="result.fromAccountBefore">
              <strong>转出账户（前）：</strong>{{ result.fromAccountBefore }}
            </div>
            <div class="result-item" v-if="result.fromAccountAfter">
              <strong>转出账户（后）：</strong>{{ result.fromAccountAfter }}
            </div>
            <div class="result-item" v-if="result.toAccountBefore">
              <strong>转入账户（前）：</strong>{{ result.toAccountBefore }}
            </div>
            <div class="result-item" v-if="result.toAccountAfter">
              <strong>转入账户（后）：</strong>{{ result.toAccountAfter }}
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

        <div class="account-status">
          <h3>账户状态</h3>
          <div class="account-cards">
            <div class="account-card" v-for="account in accounts" :key="account.id">
              <h4>账户 {{ account.id }}：{{ account.name }}</h4>
              <div class="account-balance">
                <strong>余额：</strong>{{ account.balance }}
              </div>
              <div class="account-frozen" v-if="account.frozenAmount && account.frozenAmount > 0">
                <strong>冻结金额：</strong>{{ account.frozenAmount }}
              </div>
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

          <div class="code-content" v-show="activeTab === 'twoPhase'">
            <pre><code v-html="highlightCode(twoPhaseCommitCode)"></code></pre>
          </div>

          <div class="code-content" v-show="activeTab === 'tcc'">
            <pre><code v-html="highlightCode(tccCode)"></code></pre>
          </div>

          <div class="code-content" v-show="activeTab === 'saga'">
            <pre><code v-html="highlightCode(sagaCode)"></code></pre>
          </div>

          <div class="code-content" v-show="activeTab === 'comparison'">
            <pre><code v-html="highlightCode(comparisonCode)"></code></pre>
          </div>
        </div>
      </div>

      <div class="solution-section">
        <h2>解决方案</h2>
        <ul>
          <li><strong>两阶段提交（2PC）：</strong>适合强一致性要求的场景，但性能较差，容易出现阻塞</li>
          <li><strong>TCC模式：</strong>适合高并发场景，需要实现try、confirm、cancel三个阶段</li>
          <li><strong>Saga模式：</strong>适合长事务场景，使用补偿机制保证最终一致性</li>
          <li><strong>消息队列：</strong>使用可靠消息模式，确保消息的可靠传递和消费</li>
          <li><strong>本地消息表：</strong>结合消息队列，实现最终一致性</li>
          <li><strong>状态机：</strong>使用状态机管理分布式事务的状态流转</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { exampleMixin, exampleStyles } from '../../utils/exampleMixin';
import api from '../../api/api';

export default {
  name: 'DistributedTransactionExample',
  mixins: [exampleMixin],
  data() {
    return {
      fromAccountId: 1,
      toAccountId: 2,
      amount: 1000,
      isLoading: false,
      result: null,
      accounts: [],
      
      twoPhaseCommitCode: `// 两阶段提交（2PC）示例
public DistributedTransactionResult simulateTwoPhaseCommitFailure(Long fromAccountId, Long toAccountId, BigDecimal amount) {
    // 阶段1：准备阶段
    // 1. 检查账户是否存在
    // 2. 检查余额是否足够
    // 3. 锁定资源
    
    // 阶段2：提交阶段
    // 1. 扣减转出账户
    // 2. 增加转入账户
    // 3. 创建交易记录
    // 4. 释放资源
    
    // 问题：
    // 1. 性能较差，需要锁定资源
    // 2. 容易出现单点故障
    // 3. 可能导致长时间阻塞
}`,
      
      tccCode: `// TCC模式示例
public DistributedTransactionResult simulateTCCPattern(Long fromAccountId, Long toAccountId, BigDecimal amount) {
    // Try阶段：资源预留
    // 1. 检查账户是否存在
    // 2. 检查余额是否足够
    // 3. 冻结资金
    
    // Confirm阶段：确认执行
    // 1. 扣减冻结金额
    // 2. 增加转入账户
    // 3. 创建交易记录
    
    // Cancel阶段：取消操作
    // 1. 解除资金冻结
    // 2. 清理临时数据
    
    // 优点：
    // 1. 性能好，不锁定资源
    // 2. 灵活性高
    // 缺点：
    // 1. 实现复杂
    // 2. 需要处理空回滚
}`,
      
      sagaCode: `// Saga模式示例
public DistributedTransactionResult simulateSagaPattern(Long fromAccountId, Long toAccountId, BigDecimal amount) {
    // 步骤1：扣减转出账户
    // 补偿：恢复转出账户
    
    // 步骤2：增加转入账户
    // 补偿：恢复转入账户
    
    // 步骤3：创建交易记录
    // 补偿：删除交易记录
    
    // 优点：
    // 1. 适合长事务
    // 2. 性能好
    // 缺点：
    // 1. 实现复杂
    // 2. 只能保证最终一致性
}`,
      
      comparisonCode: `// 分布式事务模式对比

| 模式 | 一致性 | 性能 | 实现复杂度 | 适用场景 |
|------|--------|------|------------|----------|
| 2PC | 强一致 | 低 | 中 | 金融交易 |
| TCC | 最终一致 | 高 | 高 | 电商支付 |
| Saga | 最终一致 | 高 | 高 | 订单处理 |
| 消息队列 | 最终一致 | 高 | 中 | 异步通知 |
| 本地消息表 | 最终一致 | 中 | 中 | 微服务通信 |`,
      
      buttonTypes: exampleStyles.buttonTypes,
      resultStatus: exampleStyles.resultStatus,
      tabConfigs: {
        twoPhase: { icon: '🔄', label: '两阶段提交' },
        tcc: { icon: '✅', label: 'TCC模式' },
        saga: { icon: '📋', label: 'Saga模式' },
        comparison: { icon: '📊', label: '模式对比' }
      },
      activeTab: 'twoPhase'
    };
  },
  mounted() {
    this.getAccounts();
  },
  methods: {
    async testTwoPhaseCommit() {
      if (!this.validateInputs()) return;
      
      try {
        this.isLoading = true;
        this.result = null;
        
        const response = await api.examples.distributedTransaction.simulateTwoPhaseCommit({
          fromAccountId: this.fromAccountId,
          toAccountId: this.toAccountId,
          amount: this.amount
        });
        
        this.result = response;
        this.getAccounts();
      } catch (error) {
        this.result = {
          success: false,
          message: '操作失败',
          error: error.message || '未知错误'
        };
      } finally {
        this.isLoading = false;
      }
    },
    
    async testTCCPattern() {
      if (!this.validateInputs()) return;
      
      try {
        this.isLoading = true;
        this.result = null;
        
        const response = await api.examples.distributedTransaction.simulateTCCPattern({
          fromAccountId: this.fromAccountId,
          toAccountId: this.toAccountId,
          amount: this.amount
        });
        
        this.result = response;
        this.getAccounts();
      } catch (error) {
        this.result = {
          success: false,
          message: '操作失败',
          error: error.message || '未知错误'
        };
      } finally {
        this.isLoading = false;
      }
    },
    
    async testSagaPattern() {
      if (!this.validateInputs()) return;
      
      try {
        this.isLoading = true;
        this.result = null;
        
        const response = await api.examples.distributedTransaction.simulateSagaPattern({
          fromAccountId: this.fromAccountId,
          toAccountId: this.toAccountId,
          amount: this.amount
        });
        
        this.result = response;
        this.getAccounts();
      } catch (error) {
        this.result = {
          success: false,
          message: '操作失败',
          error: error.message || '未知错误'
        };
      } finally {
        this.isLoading = false;
      }
    },
    
    async resetData() {
      try {
        this.isLoading = true;
        
        await api.examples.distributedTransaction.reset();
        
        this.result = {
          success: true,
          message: '数据已重置',
          info: '所有账户和交易记录已恢复到初始状态'
        };
        
        this.getAccounts();
      } catch (error) {
        this.result = {
          success: false,
          message: '重置失败',
          error: error.message || '未知错误'
        };
      } finally {
        this.isLoading = false;
      }
    },
    
    async getAccounts() {
      try {
        const response = await api.examples.distributedTransaction.getAccounts();
        this.accounts = response;
      } catch (error) {
        console.error('获取账户信息失败:', error);
      }
    },
    
    validateInputs() {
      if (this.fromAccountId === this.toAccountId) {
        this.result = {
          success: false,
          message: '操作失败',
          error: '转出账户和转入账户不能相同'
        };
        return false;
      }
      
      if (this.amount <= 0) {
        this.result = {
          success: false,
          message: '操作失败',
          error: '转账金额必须大于0'
        };
        return false;
      }
      
      return true;
    },
    
    switchTab(tab) {
      this.activeTab = tab;
    },
    
    goBackToExamples() {
      this.$router.push('/examples');
    }
  }
}
</script>

<style scoped>
.example-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.demo-controls {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.input-group {
  display: flex;
  align-items: center;
  gap: 10px;
}

.input-group label {
  font-weight: bold;
  white-space: nowrap;
}

.input-group input {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  width: 120px;
}

.demo-buttons {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.demo-buttons button.disabled {
  background-color: #ccc !important;
  cursor: not-allowed !important;
  transform: none !important;
  box-shadow: none !important;
}

.account-status {
  margin-top: 30px;
}

.account-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-top: 15px;
}

.account-card {
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.account-card h4 {
  margin-top: 0;
  margin-bottom: 10px;
  color: #333;
}

.account-balance {
  font-size: 18px;
  margin-bottom: 10px;
}

.account-frozen {
  font-size: 14px;
  color: #666;
}

@media (max-width: 768px) {
  .demo-controls {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .demo-buttons {
    flex-direction: column;
    width: 100%;
  }
  
  .demo-buttons button {
    width: 100%;
  }
}
</style>