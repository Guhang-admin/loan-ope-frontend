<template>
  <div class="dataconsistency-container">
    <div class="header">
      <button class="back-btn" @click="goBackToExamples">
        <i class="back-icon">🏠</i>
        <span>返回案例列表</span>
      </button>
      <h1>第2期：数据不一致 - 分布式事务和缓存一致性问题</h1>
    </div>

    <div class="case-description">
      <h2>问题描述</h2>
      <p>用户在进行金融操作时，出现账户余额与交易记录不一致的情况，如账户余额减少了但交易记录未生成，或交易记录生成了但账户余额未更新。</p>
    </div>

    <div class="case-content">
      <div class="demo-section">
        <h2>演示</h2>

        <div class="transfer-form">
          <div class="form-group">
            <label>转出用户ID：</label>
            <input type="number" v-model="fromUserId" placeholder="请输入用户ID">
          </div>
          <div class="form-group">
            <label>转入用户ID：</label>
            <input type="number" v-model="toUserId" placeholder="请输入用户ID">
          </div>
          <div class="form-group">
            <label>转账金额：</label>
            <input type="number" v-model="amount" placeholder="请输入金额" step="0.01">
          </div>
          <div class="form-actions">
            <button @click="transferWithoutTransaction" :class="buttonTypes.danger.class">
              无事务转账
            </button>
            <button @click="transferWithTransaction" :class="buttonTypes.success.class">
              有事务转账
            </button>
            <button @click="resetAccounts" class="btn-secondary">
              重置账户
            </button>
          </div>
        </div>

        <div class="balance-section">
          <h3>账户余额</h3>
          <div class="balance-display">
            <div class="balance-item">
              <span class="balance-label">用户1001：</span>
              <span class="balance-value">{{ currentBalances['1001'] || 0 }}</span>
              <button @click="addBalance(1001)" class="btn-small">+ 增加</button>
            </div>
            <div class="balance-item">
              <span class="balance-label">用户1002：</span>
              <span class="balance-value">{{ currentBalances['1002'] || 0 }}</span>
              <button @click="addBalance(1002)" class="btn-small">+ 增加</button>
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
            <div class="result-item" v-if="result.warning">
              <strong>警告：</strong>{{ result.warning }}
            </div>
            <div class="result-item" v-if="result.info">
              <strong>提示：</strong>{{ result.info }}
            </div>
            <div class="result-item" v-if="result.error">
              <strong>错误：</strong>{{ result.error }}
            </div>
            
            <!-- 数据变更详情 -->
            <div v-if="result.balanceChanges" class="balance-changes">
              <h4>数据变更详情</h4>
              <table class="balance-table">
                <tr>
                  <th>账户</th>
                  <th>操作前余额</th>
                  <th>操作后余额</th>
                  <th>变更</th>
                </tr>
                <tr>
                  <td>用户{{ result.balanceChanges.fromUserId }}（转出）</td>
                  <td>{{ result.balanceChanges.fromBalanceBefore }}</td>
                  <td>{{ result.balanceChanges.fromBalanceAfter }}</td>
                  <td :class="getBalanceChangeClass(result.balanceChanges.fromBalanceBefore, result.balanceChanges.fromBalanceAfter)">
                    {{ formatBalanceChange(result.balanceChanges.fromBalanceBefore, result.balanceChanges.fromBalanceAfter) }}
                  </td>
                </tr>
                <tr>
                  <td>用户{{ result.balanceChanges.toUserId }}（转入）</td>
                  <td>{{ result.balanceChanges.toBalanceBefore }}</td>
                  <td>{{ result.balanceChanges.toBalanceAfter }}</td>
                  <td :class="getBalanceChangeClass(result.balanceChanges.toBalanceBefore, result.balanceChanges.toBalanceAfter)">
                    {{ formatBalanceChange(result.balanceChanges.toBalanceBefore, result.balanceChanges.toBalanceAfter) }}
                  </td>
                </tr>
              </table>
              <div v-if="result.balanceChanges.inconsistent" class="inconsistent-warning">
                ⚠️ 数据不一致！转入账户余额未增加，但转出账户已扣款。
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
          <li><strong>使用 @Transactional 注解：</strong>确保操作的原子性，要么全部成功，要么全部失败</li>
          <li><strong>完善异常处理：</strong>确保异常时能正确回滚事务</li>
          <li><strong>添加业务校验：</strong>如余额检查，避免无效操作</li>
          <li><strong>幂等性设计：</strong>确保重复操作不会产生副作用</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import api from '../../api/api';
import { exampleMixin, exampleStyles, validators } from '../../utils/exampleMixin';

export default {
  name: 'DataConsistencyExample',
  mixins: [exampleMixin],
  data() {
    return {
      fromUserId: 1001,
      toUserId: 1002,
      amount: 100,
      currentBalances: {},
      errorCode: `@Service
public class TransferService {
    @Autowired
    private AccountDao accountDao;
    @Autowired
    private TransactionDao transactionDao;

    // 问题：没有事务管理
    public void transfer(Long fromUserId, Long toUserId, BigDecimal amount) {
        // 扣除转出账户余额
        accountDao.decreaseBalance(fromUserId, amount);
        
        // 模拟异常
        if (Math.random() > 0.5) {
            throw new RuntimeException("模拟转账过程中的异常");
        }
        
        // 增加转入账户余额
        accountDao.increaseBalance(toUserId, amount);
        
        // 记录交易
        transactionDao.createTransaction(fromUserId, toUserId, amount);
    }
}`,
      fixedCode: `@Service
public class TransferService {
    @Autowired
    private AccountDao accountDao;
    @Autowired
    private TransactionDao transactionDao;

    // 解决方案：使用事务管理
    @Transactional(rollbackFor = Exception.class)
    public void transfer(Long fromUserId, Long toUserId, BigDecimal amount) {
        // 业务校验
        if (amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("转账金额必须大于0");
        }
        
        // 检查余额
        BigDecimal balance = accountDao.getBalance(fromUserId);
        if (balance.compareTo(amount) < 0) {
            throw new IllegalArgumentException("余额不足");
        }
        
        // 扣除转出账户余额
        accountDao.decreaseBalance(fromUserId, amount);
        
        // 模拟异常
        if (Math.random() > 0.5) {
            throw new RuntimeException("模拟转账过程中的异常");
        }
        
        // 增加转入账户余额
        accountDao.increaseBalance(toUserId, amount);
        
        // 记录交易
        transactionDao.createTransaction(fromUserId, toUserId, amount);
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
    async resetAccounts() {
      try {
        this.clearResult();
        this.log('重置账户余额...');
        
        const response = await api.examples.dataconsistency.resetAccounts();
        this.result = response;
        this.currentBalances = response.accounts || {};
        this.log('账户余额已重置', response.status);
      } catch (error) {
        this.setErrorResult('重置失败', error.message);
        this.log('重置失败: ' + error.message, 'error');
      }
    },
    
    async addBalance(userId) {
      try {
        this.clearResult();
        this.log('为用户' + userId + '增加余额...');
        
        const response = await api.examples.dataconsistency.addBalance(userId, 1000);
        this.result = response;
        this.currentBalances = response.currentBalances || {};
        this.log('余额增加成功', response.status);
      } catch (error) {
        this.setErrorResult('增加余额失败', error.message);
        this.log('增加余额失败: ' + error.message, 'error');
      }
    },
    
    formatBalanceChange(before, after) {
      if (before === undefined || after === undefined) return '-';
      const change = Number(after) - Number(before);
      if (change > 0) {
        return '+' + change.toFixed(2);
      } else if (change < 0) {
        return change.toFixed(2);
      }
      return '0.00';
    },
    
    getBalanceChangeClass(before, after) {
      if (before === undefined || after === undefined) return '';
      const change = Number(after) - Number(before);
      if (change > 0) {
        return 'balance-increase';
      } else if (change < 0) {
        return 'balance-decrease';
      }
      return '';
    },
    
    async transferWithoutTransaction() {
      try {
        this.clearResult();
        this.log('开始无事务转账...');
        
        // 验证输入
        const validationErrors = [];
        validationErrors.push(validators.required(this.fromUserId, '转出用户ID'));
        validationErrors.push(validators.required(this.toUserId, '转入用户ID'));
        validationErrors.push(validators.required(this.amount, '转账金额'));
        validationErrors.push(validators.isPositive(this.amount, '转账金额'));
        
        const errors = validationErrors.filter(Boolean);
        if (errors.length > 0) {
          this.setErrorResult('验证失败', errors.join('\n'));
          return;
        }
        
        const response = await api.examples.dataconsistency.transfer(
          this.fromUserId,
          this.toUserId,
          this.amount
        );
        this.result = response;
        this.currentBalances = response.currentBalances || {};
        this.log('无事务转账完成', response.status);
      } catch (error) {
        this.setErrorResult('操作失败', error.message);
        this.log('操作失败: ' + error.message, 'error');
      }
    },

    async transferWithTransaction() {
      try {
        this.clearResult();
        this.log('开始有事务转账...');
        
        // 验证输入
        const validationErrors = [];
        validationErrors.push(validators.required(this.fromUserId, '转出用户ID'));
        validationErrors.push(validators.required(this.toUserId, '转入用户ID'));
        validationErrors.push(validators.required(this.amount, '转账金额'));
        validationErrors.push(validators.isPositive(this.amount, '转账金额'));
        
        const errors = validationErrors.filter(Boolean);
        if (errors.length > 0) {
          this.setErrorResult('验证失败', errors.join('\n'));
          return;
        }
        
        const response = await api.examples.dataconsistency.transferFixed(
          this.fromUserId,
          this.toUserId,
          this.amount
        );
        this.result = response;
        this.currentBalances = response.currentBalances || {};
        this.log('有事务转账完成', response.status);
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
.dataconsistency-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.transfer-form {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
}

.balance-section {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
}

.balance-section h3 {
  margin-top: 0;
  margin-bottom: 15px;
  color: #333;
}

.balance-display {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

.balance-item {
  display: flex;
  align-items: center;
  gap: 10px;
  background: white;
  padding: 10px 15px;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.balance-label {
  font-weight: bold;
  color: #555;
}

.balance-value {
  font-size: 18px;
  color: #28a745;
  font-weight: bold;
}

.btn-small {
  padding: 5px 10px;
  font-size: 12px;
  background-color: #17a2b8;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.btn-small:hover {
  background-color: #138496;
}

.balance-changes {
  margin-top: 15px;
  padding: 15px;
  background: #fff;
  border-radius: 4px;
}

.balance-changes h4 {
  margin: 0 0 10px 0;
  color: #333;
}

.balance-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 10px;
}

.balance-table th,
.balance-table td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}

.balance-table th {
  background-color: #f0f0f0;
}

.balance-increase {
  color: #28a745;
  font-weight: bold;
}

.balance-decrease {
  color: #dc3545;
  font-weight: bold;
}

.inconsistent-warning {
  padding: 10px;
  background: #fff3cd;
  border: 1px solid #ffc107;
  border-radius: 4px;
  color: #856404;
  font-weight: bold;
}
</style>