<template>
  <Layout>
    <div class="repayment-plan">
      <h1>还款计划</h1>
      <div class="search-section">
        <input type="number" v-model="loanId" placeholder="请输入贷款ID">
        <button class="search-btn" @click="searchPlans" :disabled="loading">查询</button>
      </div>
      <div v-if="loading" class="loading">加载中...</div>
      <div v-else-if="plans.length > 0" class="plan-list">
        <table>
          <thead>
            <tr>
              <th>期数</th>
              <th>到期日期</th>
              <th>本金</th>
              <th>利息</th>
              <th>总金额</th>
              <th>状态</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="plan in plans" :key="plan.id">
              <td>{{ plan.installmentNumber }}</td>
              <td>{{ formatDate(plan.dueDate) }}</td>
              <td>{{ plan.principal.toFixed(2) }}</td>
              <td>{{ plan.interest.toFixed(2) }}</td>
              <td>{{ plan.totalAmount.toFixed(2) }}</td>
              <td :class="['status', plan.status]">{{ plan.status }}</td>
              <td>
                <button v-if="plan.status === '未还款'" class="pay-btn" @click="makePayment(plan.id)" :disabled="paying || !isPaymentAllowed(plan.dueDate)">还款</button>
                <span v-else>{{ plan.status }}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-else class="no-data">
        <p>暂无还款计划数据</p>
      </div>
    </div>
  </Layout>
</template>

<script>
import api from '../api/api';
import Layout from '../components/Layout.vue';

export default {
  name: 'RepaymentPlan',
  components: {
    Layout
  },
  data() {
    return {
      loanId: 1,
      plans: [],
      loading: false,
      paying: false
    }
  },
  mounted() {
    this.searchPlans();
  },
  methods: {
    searchPlans() {
      if (!this.loanId) {
        alert('请输入贷款ID');
        return;
      }
      
      this.loading = true;
      
      api.getLoanRepaymentPlans(this.loanId)
        .then(data => {
          this.plans = data;
          this.loading = false;
        })
        .catch(error => {
          console.error('获取还款计划失败:', error);
          this.loading = false;
          alert('获取还款计划失败，请检查网络连接');
        });
    },
    makePayment(planId) {
      this.paying = true;
      
      api.makePayment(planId)
      .then(data => {
        this.paying = false;
        alert('还款成功');
        this.searchPlans();
      })
      .catch(error => {
        console.error('还款失败:', error);
        this.paying = false;
        alert('还款失败，请检查网络连接');
      });
    },
    isPaymentAllowed(dueDate) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const due = new Date(dueDate);
      due.setHours(0, 0, 0, 0);
      return today >= due;
    },
    formatDate(date) {
      if (typeof date === 'string') {
        date = new Date(date);
      }
      return date.toISOString().split('T')[0];
    }
  }
}
</script>

<style scoped>
.repayment-plan {
  padding: 20px;
}

h1 {
  margin-bottom: 30px;
  color: #333;
}

.search-section {
  margin-bottom: 20px;
  display: flex;
  max-width: 300px;
}

.search-section input {
  flex: 1;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px 0 0 4px;
  font-size: 16px;
}

.search-btn {
  background-color: #3498db;
  color: white;
  border: none;
  padding: 0 20px;
  border-radius: 0 4px 4px 0;
  cursor: pointer;
  transition: background-color 0.3s;
}

.search-btn:hover {
  background-color: #2980b9;
}

.search-btn:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.loading {
  text-align: center;
  padding: 40px;
  font-size: 18px;
  color: #666;
}

.plan-list {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  overflow: hidden;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

th {
  background-color: #f2f2f2;
  font-weight: bold;
  color: #333;
}

tr:hover {
  background-color: #f5f5f5;
}

.status {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 14px;
  font-weight: bold;
}

.status.未还款 {
  background-color: #ffecec;
  color: #ff4d4f;
}

.status.已还款 {
  background-color: #f6ffed;
  color: #52c41a;
}

.status.逾期 {
  background-color: #fff7e6;
  color: #fa8c16;
}

.pay-btn {
  background-color: #4CAF50;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.pay-btn:hover {
  background-color: #45a049;
}

.pay-btn:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.no-data {
  background-color: white;
  padding: 40px;
  text-align: center;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  color: #999;
}
</style>