<template>
  <div class="home">
    <h1>统计主页</h1>
    <div v-if="loading" class="loading">加载中...</div>
    <div v-else class="stats-container">
      <div class="stat-card">
        <h3>总文件数</h3>
        <p class="stat-value">{{ totalFiles }}</p>
      </div>
      <div class="stat-card">
        <h3>今日上传</h3>
        <p class="stat-value">{{ todayUploads }}</p>
      </div>
      <div class="stat-card">
        <h3>总用户数</h3>
        <p class="stat-value">{{ totalUsers }}</p>
      </div>
      <div class="stat-card">
        <h3>系统状态</h3>
        <p class="stat-value status-ok">{{ systemStatus }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import api from '../api/api';

export default {
  name: 'Home',
  data() {
    return {
      totalFiles: 0,
      todayUploads: 0,
      totalUsers: 0,
      systemStatus: '正常',
      loading: true
    }
  },
  mounted() {
    this.fetchStats();
  },
  methods: {
    fetchStats() {
      api.getStats()
        .then(data => {
          this.totalFiles = data.totalFiles;
          this.todayUploads = data.todayUploads;
          this.totalUsers = data.totalUsers;
          this.systemStatus = data.status;
          this.loading = false;
        })
        .catch(error => {
          console.error('获取统计数据失败:', error);
          this.loading = false;
          alert('获取统计数据失败，请检查网络连接');
        });
    }
  }
}
</script>

<style scoped>
.home {
  padding: 20px;
}

h1 {
  margin-bottom: 30px;
  color: #333;
}

.loading {
  text-align: center;
  padding: 40px;
  font-size: 18px;
  color: #666;
}

.stats-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}

.stat-card {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  text-align: center;
}

.stat-card h3 {
  color: #666;
  margin-bottom: 10px;
  font-size: 14px;
}

.stat-value {
  font-size: 24px;
  font-weight: bold;
  color: #333;
}

.status-ok {
  color: #4CAF50;
}
</style>