<template>
  <div class="repayment-plan">
    <h1>还款计划</h1>
    <div class="search-section">
      <input type="number" v-model="loanId" placeholder="请输入贷款ID">
      <button class="search-btn" @click="searchPlans">查询</button>
    </div>
    <div v-if="plans.length > 0" class="plan-list">
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
              <button v-if="plan.status === '未还款'" class="pay-btn" @click="makePayment(plan.id)">还款</button>
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
</template>

<script>
export default {
  name: 'RepaymentPlan',
  data() {
    return {
      loanId: 1,
      plans: []
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
      
      // 模拟API调用
      setTimeout(() => {
        this.plans = [
          {
            id: 1,
            loanId: this.loanId,
            installmentNumber: 1,
            dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            principal: 833.33,
            interest: 37.50,
            totalAmount: 870.83,
            status: '未还款'
          },
          {
            id: 2,
            loanId: this.loanId,
            installmentNumber: 2,
            dueDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
            principal: 833.33,
            interest: 34.38,
            totalAmount: 867.71,
            status: '未还款'
          },
          {
            id: 3,
            loanId: this.loanId,
            installmentNumber: 3,
            dueDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
            principal: 833.33,
            interest: 31.25,
            totalAmount: 864.58,
            status: '未还款'
          }
        ];
      }, 500);
    },
    makePayment(planId) {
      // 模拟还款操作
      setTimeout(() => {
        const plan = this.plans.find(p => p.id === planId);
        if (plan) {
          plan.status = '已还款';
          alert('还款成功');
        }
      }, 500);
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

.no-data {
  background-color: white;
  padding: 40px;
  text-align: center;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  color: #999;
}
</style>