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
        <div v-else>
          <div class="stats-container">
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
          
          <!-- 通知消息 -->
          <div class="notification-section">
            <h3>通知消息</h3>
            <div class="notification-container" v-if="notifications.length > 0">
              <div class="notification-scroll">
                <div class="notification-track">
                  <div v-for="(notification, index) in scrollNotifications" :key="index" :class="['notification-item', notification.type]">
                    <i :class="['notification-icon', notification.type]">{{ notification.icon }}</i>
                    <span class="notification-message">{{ notification.message }}</span>
                    <span class="notification-date">{{ notification.date }}</span>
                  </div>
                </div>
              </div>
            </div>
            <div v-else class="no-notifications">
              暂无通知消息
            </div>
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
      currentUser: null,
      totalFiles: 0,
      todayUploads: 0,
      totalUsers: 0,
      systemStatus: '正常',
      loading: true,
      notifications: [
        {
          id: 1,
          type: 'overdue',
          icon: '⚠️',
          message: '您有一笔还款已逾期3天，金额：¥5,000',
          date: '2026-04-10'
        },
        {
          id: 2,
          type: 'warning',
          icon: '⏰',
          message: '您有一笔还款将在2天后到期，金额：¥3,500',
          date: '2026-04-10'
        },
        {
          id: 3,
          type: 'normal',
          icon: '✅',
          message: '您的还款计划已更新',
          date: '2026-04-09'
        }
      ]
    }
  },
  computed: {
    // 用于无缝滚动的通知数据（复制一份原始数据）
    scrollNotifications() {
      return this.notifications.concat(this.notifications)
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

/* 通知消息样式 */
.notification-section {
  margin-top: 30px;
}

.notification-section h3 {
  color: #333;
  margin-bottom: 15px;
  font-size: 16px;
  font-weight: bold;
}

.notification-container {
  border: 1px solid #e9ecef;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  overflow: hidden;
  max-width: 600px;
}

.notification-scroll {
  width: 100%;
  overflow: hidden;
  position: relative;
  height: 50px;
}

.notification-track {
  display: flex;
  flex-direction: column;
  animation: scroll 10s linear infinite;
}

@keyframes scroll {
  0% {
    transform: translateY(0);
  }
  100% {
    transform: translateY(-50%);
  }
}

.notification-item {
  display: flex;
  align-items: center;
  padding: 8px 15px;
  margin-bottom: 10px;
  border-radius: 4px;
  transition: all 0.3s;
  width: 100%;
  box-sizing: border-box;
}

.notification-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.notification-item.overdue {
  background-color: #fee;
  border-left: 4px solid #dc3545;
}

.notification-item.warning {
  background-color: #fff3cd;
  border-left: 4px solid #ffc107;
}

.notification-item.normal {
  background-color: #e3f2fd;
  border-left: 4px solid #17a2b8;
}

.notification-icon {
  font-size: 16px;
  margin-right: 12px;
  flex-shrink: 0;
}

.notification-message {
  flex: 1;
  font-size: 14px;
  color: #333;
  margin-right: 12px;
}

.notification-date {
  font-size: 12px;
  color: #666;
  flex-shrink: 0;
}

.no-notifications {
  text-align: center;
  padding: 40px;
  color: #666;
  font-size: 14px;
  background-color: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
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

/* 表格样式 */
.table-section {
  margin-top: 30px;
}

.table-section h3 {
  color: #333;
  margin-bottom: 15px;
  font-size: 16px;
  font-weight: bold;
}

.table-container {
  max-height: 400px;
  overflow-y: auto;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.repayment-table {
  width: 100%;
  border-collapse: collapse;
  background-color: white;
}

.repayment-table th,
.repayment-table td {
  padding: 12px 15px;
  text-align: left;
  border-bottom: 1px solid #e9ecef;
}

.repayment-table th {
  background-color: #f8f9fa;
  font-weight: bold;
  color: #333;
  position: sticky;
  top: 0;
  z-index: 10;
}

.repayment-table tr:hover {
  background-color: #f5f5f5;
}

.repayment-table tr:last-child td {
  border-bottom: none;
}

/* 滚动条样式 */
.table-container::-webkit-scrollbar {
  width: 8px;
}

.table-container::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.table-container::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

.table-container::-webkit-scrollbar-thumb:hover {
  background: #555;
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