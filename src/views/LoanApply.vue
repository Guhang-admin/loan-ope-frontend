<template>
  <Layout>
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
      <div class="loan-list">
        <h2>我的贷款列表</h2>
        <div v-if="loading" class="loading">加载中...</div>
        <div v-else-if="loans.length === 0" class="no-data">暂无贷款记录</div>
        <div v-else class="loan-items">
          <div v-for="loan in loans" :key="loan.id" class="loan-item">
            <div class="loan-info">
              <h3>贷款ID: {{ loan.id }}</h3>
              <p>贷款金额: {{ loan.loanAmount }} 元</p>
              <p>年利率: {{ loan.interestRate }}%</p>
              <p>贷款期限: {{ loan.loanTerm }} 个月</p>
              <p>申请日期: {{ formatDate(loan.applicationDate) }}</p>
              <p>状态: <span :class="getStatusClass(loan.status)">{{ loan.status }}</span></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Layout>
</template>

<script>
import api from '../api/api';
import Layout from '../components/Layout.vue';

export default {
  name: 'LoanApply',
  components: {
    Layout
  },
  data() {
    return {
      loan: {
        userId: 2,
        loanAmount: '',
        interestRate: 4.5,
        loanTerm: 12
      },
      submitting: false,
      applicationResult: null,
      loans: [],
      loading: true
    }
  },
  mounted() {
    this.fetchLoans();
  },
  methods: {
    submitApplication() {
      if (!this.loan.userId || !this.loan.loanAmount || !this.loan.interestRate || !this.loan.loanTerm) {
        alert('请填写完整信息');
        return;
      }
      
      this.submitting = true;
      
      api.applyLoan({
        userId: this.loan.userId,
        loanAmount: parseFloat(this.loan.loanAmount),
        interestRate: parseFloat(this.loan.interestRate),
        loanTerm: parseInt(this.loan.loanTerm)
      })
      .then(data => {
        this.applicationResult = data;
        this.submitting = false;
        alert('贷款申请已提交，请等待审批');
        this.fetchLoans();
      })
      .catch(error => {
        console.error('提交申请失败:', error);
        this.submitting = false;
        alert('提交申请失败，请检查网络连接');
      });
    },
    fetchLoans() {
      const currentUser = JSON.parse(localStorage.getItem('currentUser'));
      if (!currentUser) {
        this.loading = false;
        return;
      }
      
      api.getUserLoans(currentUser.id)
        .then(data => {
          this.loans = data;
          this.loading = false;
        })
        .catch(error => {
          console.error('获取贷款列表失败:', error);
          this.loading = false;
          alert('获取贷款列表失败，请检查网络连接');
        });
    },
    formatDate(dateString) {
      if (!dateString) return '';
      const date = new Date(dateString);
      return date.toLocaleDateString('zh-CN');
    },
    getStatusClass(status) {
      switch(status) {
        case '已批准':
          return 'status-approved';
        case '已拒绝':
          return 'status-rejected';
        case '申请中':
          return 'status-pending';
        default:
          return '';
      }
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
  margin-bottom: 30px;
}

.result h3 {
  margin-bottom: 15px;
  color: #333;
}

.result-info p {
  margin-bottom: 10px;
  color: #666;
}

.loan-list {
  margin-top: 40px;
}

.loan-list h2 {
  margin-bottom: 20px;
  color: #333;
}

.loading {
  text-align: center;
  padding: 40px;
  font-size: 18px;
  color: #666;
}

.no-data {
  text-align: center;
  padding: 40px;
  font-size: 16px;
  color: #999;
}

.loan-items {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.loan-item {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.loan-info h3 {
  margin-bottom: 15px;
  color: #333;
}

.loan-info p {
  margin-bottom: 8px;
  color: #666;
}

.status-approved {
  color: #4CAF50;
  font-weight: bold;
}

.status-rejected {
  color: #f44336;
  font-weight: bold;
}

.status-pending {
  color: #ff9800;
  font-weight: bold;
}
</style>