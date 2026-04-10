<template>
  <Layout>
    <div class="repayment-record">
      <h1>还款记录</h1>
      <div class="search-section">
        <input type="number" v-model="loanId" placeholder="请输入贷款ID">
        <button class="search-btn" @click="searchRecords" :disabled="loading">查询</button>
      </div>
      <div v-if="loading" class="loading">加载中...</div>
      <div v-else-if="records.length > 0" class="record-list">
        <table>
          <thead>
            <tr>
              <th>还款ID</th>
              <th>贷款ID</th>
              <th>还款日期</th>
              <th>还款金额</th>
              <th>还款方式</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="record in records" :key="record.id">
              <td>{{ record.id }}</td>
              <td>{{ record.loanId }}</td>
              <td>{{ formatDate(record.paymentDate) }}</td>
              <td>{{ record.amount.toFixed(2) }}</td>
              <td>{{ record.paymentMethod }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-else class="no-data">
        <p>暂无还款记录数据</p>
      </div>
    </div>
  </Layout>
</template>

<script>
import api from '../api/api';
import Layout from '../components/Layout.vue';

export default {
  name: 'RepaymentRecord',
  components: {
    Layout
  },
  data() {
    return {
      loanId: 1,
      records: [],
      loading: false
    }
  },
  mounted() {
    this.searchRecords();
  },
  methods: {
    searchRecords() {
      if (!this.loanId) {
        alert('请输入贷款ID');
        return;
      }
      
      this.loading = true;
      
      api.getLoanRepaymentRecords(this.loanId)
        .then(data => {
          this.records = data;
          this.loading = false;
        })
        .catch(error => {
          console.error('获取还款记录失败:', error);
          this.loading = false;
          alert('获取还款记录失败，请检查网络连接');
        });
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
.repayment-record {
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

.record-list {
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

.no-data {
  background-color: white;
  padding: 40px;
  text-align: center;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  color: #999;
}
</style>