<template>
  <div class="loan-apply">
    <h1>贷款申请</h1>
    <div class="apply-form">
      <div class="form-group">
        <label for="userId">用户ID</label>
        <input type="number" id="userId" v-model="loan.userId" placeholder="请输入用户ID">
      </div>
      <div class="form-group">
        <label for="loanAmount">贷款金额</label>
        <input type="number" id="loanAmount" v-model="loan.loanAmount" placeholder="请输入贷款金额" step="0.01" min="0">
      </div>
      <div class="form-group">
        <label for="interestRate">年利率(%)</label>
        <input type="number" id="interestRate" v-model="loan.interestRate" placeholder="请输入年利率" step="0.01" min="0">
      </div>
      <div class="form-group">
        <label for="loanTerm">贷款期限(月)</label>
        <select id="loanTerm" v-model="loan.loanTerm">
          <option value="3">3个月</option>
          <option value="6">6个月</option>
          <option value="12">12个月</option>
          <option value="24">24个月</option>
          <option value="36">36个月</option>
        </select>
      </div>
      <button class="submit-btn" @click="submitApplication" :disabled="submitting">
        {{ submitting ? '提交中...' : '提交申请' }}
      </button>
    </div>
    <div v-if="applicationResult" class="result">
      <h3>申请结果</h3>
      <div class="result-info">
        <p>贷款ID: {{ applicationResult.id }}</p>
        <p>贷款金额: {{ applicationResult.loanAmount }} 元</p>
        <p>年利率: {{ applicationResult.interestRate }}%</p>
        <p>贷款期限: {{ applicationResult.loanTerm }} 个月</p>
        <p>申请状态: {{ applicationResult.status }}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LoanApply',
  data() {
    return {
      loan: {
        userId: 2, // 默认用户ID
        loanAmount: '',
        interestRate: 4.5,
        loanTerm: 12
      },
      submitting: false,
      applicationResult: null
    }
  },
  methods: {
    submitApplication() {
      if (!this.loan.userId || !this.loan.loanAmount || !this.loan.interestRate || !this.loan.loanTerm) {
        alert('请填写完整信息');
        return;
      }
      
      this.submitting = true;
      
      // 模拟API调用
      setTimeout(() => {
        this.applicationResult = {
          id: Math.floor(Math.random() * 1000),
          userId: this.loan.userId,
          loanAmount: this.loan.loanAmount,
          interestRate: this.loan.interestRate,
          loanTerm: this.loan.loanTerm,
          status: '申请中'
        };
        this.submitting = false;
        alert('贷款申请已提交，请等待审批');
      }, 1000);
    }
  }
}
</script>

<style scoped>
.loan-apply {
  padding: 20px;
}

h1 {
  margin-bottom: 30px;
  color: #333;
}

.apply-form {
  max-width: 500px;
  background-color: white;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  margin-bottom: 30px;
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 8px;
  color: #666;
  font-weight: bold;
}

input, select {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
}

.submit-btn {
  background-color: #4CAF50;
  color: white;
  border: none;
  padding: 12px 20px;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;
  width: 100%;
  margin-top: 10px;
}

.submit-btn:hover {
  background-color: #45a049;
}

.submit-btn:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.result {
  max-width: 500px;
  background-color: #f9f9f9;
  padding: 20px;
  border-radius: 8px;
  border: 1px solid #ddd;
}

.result h3 {
  margin-bottom: 15px;
  color: #333;
}

.result-info p {
  margin-bottom: 10px;
  color: #666;
}
</style>