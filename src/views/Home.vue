<template>
  <Layout>
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

      <!-- 跑马灯图片展示 -->
      <div class="carousel-section">
        <h3>相关资讯</h3>
        <div class="carousel-container">
          <transition name="carousel-fade" mode="out-in">
            <div key="{{ currentCarouselIndex }}" class="carousel-item">
              <img :src="currentCarouselItem.image" :alt="currentCarouselItem.title" class="carousel-image">
              <div class="carousel-title">{{ currentCarouselItem.title }}</div>
            </div>
          </transition>
        </div>
      </div>
    </div>
  </Layout>
</template>

<script>
import api from '../api/api';
import Layout from '../components/Layout.vue';

export default {
  name: 'Home',
  components: {
    Layout
  },
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
      ],
      carouselItems: [

        {
          id: 1,
          title: '贷款',
          image: 'https://img2.baidu.com/it/u=3768499143,2537282227&fm=253&fmt=auto&app=120&f=JPEG?w=750&h=500'
        },
        {
          id: 2,
          title: '投资',
          image: 'https://tse3-mm.cn.bing.net/th/id/OIP-C.vxKhpRVTCzje8_sf6lJ_uAAAAA?w=285&h=189&c=7&r=0&o=7&pid=1.7&rm=3'
        },
        {
          id: 3,
          title: '贷款经理',
          image: 'https://tse3-mm.cn.bing.net/th/id/OIP-C.rLlptIcIc60J4uuMq15bzgHaE7?w=299&h=199&c=7&r=0&o=7&pid=1.7&rm=3'
        },
        {
          id: 4,
          title: '利率表',
          image: 'https://img0.baidu.com/it/u=4201593213,921838420&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=708'
        },
        {
          id: 5,
          title: '利率变化趋势',
          image: 'https://q1.itc.cn/q_70/images03/20240224/2595181a86c348b9b025109397c339e3.png'
        }
      ],
      currentCarouselIndex: 0
    }
  },
  computed: {
    // 用于无缝滚动的通知数据（复制一份原始数据）
    scrollNotifications() {
      return this.notifications.concat(this.notifications)
    },
    // 当前显示的轮播项
    currentCarouselItem() {
      return this.carouselItems[this.currentCarouselIndex]
    }
  },
  mounted() {
    this.getCurrentUser();
    this.fetchStats();
    
    // 启动轮播定时器
    this.carouselTimer = setInterval(() => {
      this.currentCarouselIndex = (this.currentCarouselIndex + 1) % this.carouselItems.length;
    }, 5000);
  },
  beforeUnmount() {
    // 清理轮播定时器
    if (this.carouselTimer) {
      clearInterval(this.carouselTimer);
    }
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

/* 跑马灯图片展示样式 */
.carousel-section {
  margin-top: 30px;
  margin-bottom: 30px;
}

.carousel-section h3 {
  color: #333;
  margin-bottom: 15px;
  font-size: 16px;
  font-weight: bold;
}

.carousel-container {
  width: 100%;
  max-width: 600px;
  overflow: hidden;
  position: relative;
  height: 300px;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  display: flex;
  align-items: center;
  justify-content: center;
}

.carousel-item {
  width: 100%;
  text-align: center;
  padding: 20px;
}

.carousel-image {
  width: 100%;
  max-width: 400px;
  height: 200px;
  object-fit: cover;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  transition: transform 0.3s;
}

.carousel-item:hover .carousel-image {
  transform: scale(1.05);
}

.carousel-title {
  margin-top: 20px;
  font-size: 16px;
  color: #333;
  font-weight: bold;
}

/* 轮播淡入淡出效果 */
.carousel-fade-enter-active,
.carousel-fade-leave-active {
  transition: opacity 0.5s ease;
}

.carousel-fade-enter-from,
.carousel-fade-leave-to {
  opacity: 0;
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
</style>