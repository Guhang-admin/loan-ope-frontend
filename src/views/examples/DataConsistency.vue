<template>
  <div class="dataconsistency-container">
    <div class="header">
      <button class="back-btn" @click="goBack">
        <i class="back-icon">🏠</i>
        <span>返回主页面</span>
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
            <button @click="transferWithoutTransaction" class="btn btn-danger">
              无事务转账
            </button>
            <button @click="transferWithTransaction" class="btn btn-success">
              有事务转账
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

export default {
  name: 'DataConsistencyExample',
  data() {
    return {
      fromUserId: 1,
      toUserId: 2,
      amount: 100,
      result: null,
      activeTab: 'error',
      errorCode: `public void transfer(Long fromUserId, Long toUserId, BigDecimal amount) {
    try {
        // 1. 扣减转出账户余额
        User fromUser = userRepository.findById(fromUserId);
        fromUser.setBalance(fromUser.getBalance().subtract(amount));
        userRepository.update(fromUser);
        
        // 2. 增加转入账户余额
        User toUser = userRepository.findById(toUserId);
        toUser.setBalance(toUser.getBalance().add(amount));
        userRepository.update(toUser);
        
        // 3. 创建交易记录
        Transaction transaction = new Transaction();
        transaction.setFromUserId(fromUserId);
        transaction.setToUserId(toUserId);
        transaction.setAmount(amount);
        transaction.setStatus("SUCCESS");
        transactionRepository.save(transaction);
    } catch (Exception e) {
        logger.error("Transfer error", e);
        // 问题：没有事务回滚，部分操作已执行
    }
}`,
      fixedCode: `@Transactional
public void transfer(Long fromUserId, Long toUserId, BigDecimal amount) {
    try {
        // 1. 扣减转出账户余额
        User fromUser = userRepository.findById(fromUserId);
        if (fromUser.getBalance().compareTo(amount) < 0) {
            throw new InsufficientBalanceException("Insufficient balance");
        }
        fromUser.setBalance(fromUser.getBalance().subtract(amount));
        userRepository.update(fromUser);
        
        // 2. 增加转入账户余额
        User toUser = userRepository.findById(toUserId);
        toUser.setBalance(toUser.getBalance().add(amount));
        userRepository.update(toUser);
        
        // 3. 创建交易记录
        Transaction transaction = new Transaction();
        transaction.setFromUserId(fromUserId);
        transaction.setToUserId(toUserId);
        transaction.setAmount(amount);
        transaction.setStatus("SUCCESS");
        transactionRepository.save(transaction);
    } catch (Exception e) {
        logger.error("Transfer error", e);
        // 事务会自动回滚
        throw new TransferException("Transfer failed", e);
    }
}`
    };
  },
  methods: {
    goBack() {
      this.$router.push('/');
    },
    async transferWithoutTransaction() {
      try {
        this.result = await api.examples.dataconsistency.transfer(
          this.fromUserId, 
          this.toUserId, 
          this.amount
        );
      } catch (error) {
        this.result = {
          status: 'error',
          message: '操作失败',
          error: error.message
        };
      }
    },
    async transferWithTransaction() {
      try {
        this.result = await api.examples.dataconsistency.transferFixed(
          this.fromUserId, 
          this.toUserId, 
          this.amount
        );
      } catch (error) {
        this.result = {
          status: 'error',
          message: '操作失败',
          error: error.message
        };
      }
    }
  }
}
</script>

<style scoped>
.dataconsistency-container {
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

.transfer-form {
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: inline-block;
  width: 120px;
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
}

.btn-danger {
  background: #dc3545;
  color: white;
}

.btn-success {
  background: #28a745;
  color: white;
}

.result-section {
  margin-top: 20px;
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