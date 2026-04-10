<template>
  <div class="home">
    
    <!-- 主内容区 -->
    <div class="main-content">
      <!-- 左侧菜单 -->
      <div class="sidebar">
        <div class="menu-section">
          <h3>功能菜单</h3>
          <ul class="menu-list">
            <li>
              <router-link to="/" class="menu-item">
                <i class="menu-icon">📊</i>
                <span>统计主页</span>
              </router-link>
            </li>
            <li>
              <router-link to="/upload" class="menu-item">
                <i class="menu-icon">📁</i>
                <span>文件上传</span>
              </router-link>
            </li>
            <li>
              <router-link to="/loan-apply" class="menu-item">
                <i class="menu-icon">💰</i>
                <span>贷款申请</span>
              </router-link>
            </li>
            <li>
              <router-link to="/repayment-plan" class="menu-item">
                <i class="menu-icon">📅</i>
                <span>还款计划</span>
              </router-link>
            </li>
            <li>
              <router-link to="/repayment-record" class="menu-item">
                <i class="menu-icon">📋</i>
                <span>还款记录</span>
              </router-link>
            </li>
            <li>
              <router-link to="/credit-score" class="menu-item">
                <i class="menu-icon">⭐</i>
                <span>信用评分</span>
              </router-link>
            </li>
          </ul>
        </div>
        
        <div class="menu-section">
          <h3>案例演示</h3>
          <ul class="menu-list">
            <li>
              <router-link to="/examples" class="menu-item">
                <i class="menu-icon">🐛</i>
                <span>Java 案例</span>
              </router-link>
            </li>
            <li>
              <router-link to="/js-examples" class="menu-item">
                <i class="menu-icon">⚡</i>
                <span>JavaScript 案例</span>
              </router-link>
            </li>
          </ul>
        </div>
      </div>
      
      <!-- 右侧内容 -->
      <div class="content">
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
      loading: true,
      currentUser: null
    }
  },
  mounted() {
    this.getCurrentUser();
    this.fetchStats();
  },
  methods: {
    getCurrentUser() {
      const userStr = localStorage.getItem('currentUser');
      if (userStr) {
        this.currentUser = JSON.parse(userStr);
      }
    },
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
    },
    handleLogout() {
      localStorage.removeItem('currentUser');
      this.$router.push('/login');
    }
  }
}
</script>

<style scoped>
.home {
  display: flex;
  flex-direction: column;
  min-height: 85vh;
  background-color: #f5f5f5;
}

/* 顶部导航栏 */
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #333;
  color: white;
  padding: 0 20px;
  height: 60px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.navbar-left h1 {
  margin: 0;
  font-size: 20px;
  font-weight: bold;
}

.navbar-right {
  display: flex;
  align-items: center;
  gap: 20px;
}

.user-info {
  font-size: 14px;
}

.logout-btn {
  background-color: #dc3545;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s;
}

.logout-btn:hover {
  background-color: #c82333;
}

/* 主内容区 */
.main-content {
  display: flex;
  flex: 1;
  margin-top: 20px;
  padding: 0 20px;
  gap: 20px;
}

/* 左侧菜单 */
.sidebar {
  width: 250px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  padding: 20px 0;
}

.menu-section {
  margin-bottom: 30px;
  padding: 0 20px;
}

.menu-section h3 {
  color: #666;
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 15px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.menu-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 15px;
  border-radius: 4px;
  color: #333;
  text-decoration: none;
  transition: all 0.3s;
  margin-bottom: 5px;
}

.menu-item:hover {
  background-color: #f0f0f0;
  color: #667eea;
}

.menu-item.router-link-active {
  background-color: #e6e8ff;
  color: #667eea;
  font-weight: bold;
}

.menu-icon {
  font-size: 18px;
  width: 20px;
  text-align: center;
}

/* 右侧内容 */
.content {
  flex: 1;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  padding: 30px;
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
  background-color: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  text-align: center;
  transition: transform 0.3s, box-shadow 0.3s;
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
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

/* 响应式设计 */
@media (max-width: 768px) {
  .main-content {
    flex-direction: column;
  }
  
  .sidebar {
    width: 100%;
    margin-bottom: 20px;
  }
  
  .menu-list {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
  }
  
  .menu-item {
    flex: 1 1 calc(50% - 10px);
    justify-content: center;
  }
}
</style>