<template>
  <Layout>
    <div class="credit-score">
      <h1>用户信誉度</h1>
      <div v-if="loading" class="loading">加载中...</div>
      <div v-else class="user-list">
        <h2>用户列表</h2>
        <table>
          <thead>
            <tr>
              <th>用户ID</th>
              <th>用户名</th>
              <th>姓名</th>
              <th>角色</th>
              <th>信誉分数</th>
              <th>评级</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in users" :key="user.id" @click="selectUser(user)">
              <td>{{ user.id }}</td>
              <td>{{ user.username }}</td>
              <td>{{ user.name }}</td>
              <td>{{ user.role }}</td>
              <td>{{ user.creditScore }}</td>
              <td :class="['rating', getRatingClass(user.creditScore)]">{{ getRating(user.creditScore) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-if="selectedUser" class="user-detail">
        <h2>用户详情</h2>
        <div class="detail-card">
          <div class="detail-item">
            <label>用户ID:</label>
            <span>{{ selectedUser.id }}</span>
          </div>
          <div class="detail-item">
            <label>用户名:</label>
            <span>{{ selectedUser.username }}</span>
          </div>
          <div class="detail-item">
            <label>姓名:</label>
            <span>{{ selectedUser.name }}</span>
          </div>
          <div class="detail-item">
            <label>角色:</label>
            <span>{{ selectedUser.role }}</span>
          </div>
          <div class="detail-item">
            <label>信誉分数:</label>
            <span class="score">{{ selectedUser.creditScore }}</span>
          </div>
          <div class="detail-item">
            <label>评级:</label>
            <span :class="['rating', getRatingClass(selectedUser.creditScore)]">{{ getRating(selectedUser.creditScore) }}</span>
          </div>
          <div class="detail-item">
            <label>信誉评价:</label>
            <span>{{ getCreditEvaluation(selectedUser.creditScore) }}</span>
          </div>
          <div class="detail-item">
            <label>调整信誉分数:</label>
            <input type="number" v-model="newCreditScore" :min="0" :max="1000" step="1">
            <button class="update-btn" @click="updateCreditScore" :disabled="updating">更新</button>
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
  name: 'CreditScore',
  components: {
    Layout
  },
  data() {
    return {
      users: [],
      selectedUser: null,
      loading: true,
      updating: false,
      newCreditScore: 0
    }
  },
  mounted() {
    this.loadUsers();
  },
  methods: {
    loadUsers() {
      api.getUsers()
        .then(data => {
          this.users = data;
          this.loading = false;
          if (this.users.length > 0) {
            this.selectedUser = this.users[0];
            this.newCreditScore = this.selectedUser.creditScore;
          }
        })
        .catch(error => {
          console.error('获取用户列表失败:', error);
          this.loading = false;
          alert('获取用户列表失败，请检查网络连接');
        });
    },
    selectUser(user) {
      this.selectedUser = user;
      this.newCreditScore = user.creditScore;
    },
    updateCreditScore() {
      if (!this.selectedUser || this.newCreditScore === '') {
        alert('请输入有效的信誉分数');
        return;
      }
      
      const score = parseInt(this.newCreditScore);
      if (score < 0 || score > 1000) {
        alert('信誉分数必须在0-1000之间');
        return;
      }
      
      this.updating = true;
      
      api.updateCreditScore(this.selectedUser.id, score)
      .then(data => {
        this.selectedUser = data;
        this.updating = false;
        alert('信誉分数更新成功');
        this.loadUsers();
      })
      .catch(error => {
        console.error('更新信誉分数失败:', error);
        this.updating = false;
        alert('更新信誉分数失败，请检查网络连接');
      });
    },
    getRating(score) {
      if (score >= 900) return 'AAA';
      if (score >= 850) return 'AA';
      if (score >= 800) return 'A';
      if (score >= 750) return 'BBB';
      if (score >= 700) return 'BB';
      if (score >= 650) return 'B';
      return 'C';
    },
    getRatingClass(score) {
      if (score >= 850) return 'excellent';
      if (score >= 750) return 'good';
      if (score >= 650) return 'fair';
      return 'poor';
    },
    getCreditEvaluation(score) {
      if (score >= 900) return '信用极佳，可获得最优贷款条件';
      if (score >= 850) return '信用优秀，贷款条件良好';
      if (score >= 800) return '信用良好，可获得常规贷款条件';
      if (score >= 750) return '信用一般，可能需要提供额外担保';
      if (score >= 700) return '信用较差，贷款条件较为严格';
      if (score >= 650) return '信用差，可能难以获得贷款';
      return '信用极差，无法获得贷款';
    }
  }
}
</script>

<style scoped>
.credit-score {
  padding: 20px;
}

h1 {
  margin-bottom: 30px;
  color: #333;
}

h2 {
  margin-bottom: 20px;
  color: #333;
}

.loading {
  text-align: center;
  padding: 40px;
  font-size: 18px;
  color: #666;
}

.user-list {
  margin-bottom: 40px;
}

.user-list table {
  width: 100%;
  border-collapse: collapse;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  overflow: hidden;
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
  cursor: pointer;
}

.rating {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 14px;
  font-weight: bold;
}

.rating.excellent {
  background-color: #f6ffed;
  color: #52c41a;
}

.rating.good {
  background-color: #e6f7ff;
  color: #1890ff;
}

.rating.fair {
  background-color: #fff7e6;
  color: #fa8c16;
}

.rating.poor {
  background-color: #ffecec;
  color: #ff4d4f;
}

.user-detail {
  margin-top: 30px;
}

.detail-card {
  background-color: white;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  max-width: 600px;
}

.detail-item {
  display: flex;
  margin-bottom: 15px;
  align-items: center;
}

.detail-item label {
  width: 120px;
  font-weight: bold;
  color: #666;
}

.detail-item span {
  flex: 1;
  color: #333;
}

.detail-item .score {
  font-size: 18px;
  font-weight: bold;
  color: #1890ff;
}

.detail-item input {
  flex: 1;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
  margin-right: 10px;
}

.update-btn {
  background-color: #4CAF50;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.update-btn:hover {
  background-color: #45a049;
}

.update-btn:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}
</style>