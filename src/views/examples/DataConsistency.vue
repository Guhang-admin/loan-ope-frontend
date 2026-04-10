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
      fromUserId: 1,
      toUserId: 2,
      amount: 100,
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
        
        const response = await api.examples.dataconsistency.transferWithoutTransaction({
          fromUserId: this.fromUserId,
          toUserId: this.toUserId,
          amount: this.amount
        });
        this.result = response;
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
        
        const response = await api.examples.dataconsistency.transferWithTransaction({
          fromUserId: this.fromUserId,
          toUserId: this.toUserId,
          amount: this.amount
        });
        this.result = response;
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
</style>