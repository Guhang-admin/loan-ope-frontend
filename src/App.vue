<template>
  <div id="app">
    <nav class="navbar">
      <div class="navbar-brand">管理系统</div>
      <div class="navbar-menu">
        <router-link to="/" class="navbar-item">统计主页</router-link>
        <router-link to="/upload" class="navbar-item">文件上传</router-link>
        <router-link to="/loan-apply" class="navbar-item">贷款申请</router-link>
        <router-link to="/repayment-plan" class="navbar-item">还款计划</router-link>
        <router-link to="/repayment-record" class="navbar-item">还款记录</router-link>
        <router-link to="/credit-score" class="navbar-item">用户信誉度</router-link>
      </div>
      <div class="navbar-user">
        <span v-if="currentUser" class="user-info">
          {{ currentUser.name }}
          <button class="logout-btn" @click="logout">退出</button>
        </span>
      </div>
    </nav>
    <main class="main-content">
      <router-view />
    </main>
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      currentUser: null
    }
  },
  mounted() {
    this.checkLoginStatus();
    window.addEventListener('storage', this.handleStorageChange);
  },
  beforeDestroy() {
    window.removeEventListener('storage', this.handleStorageChange);
  },
  methods: {
    checkLoginStatus() {
      const userStr = localStorage.getItem('currentUser');
      if (userStr) {
        this.currentUser = JSON.parse(userStr);
      } else {
        this.currentUser = null;
      }
    },
    handleStorageChange(e) {
      if (e.key === 'currentUser') {
        this.checkLoginStatus();
      }
    },
    logout() {
      localStorage.removeItem('currentUser');
      this.currentUser = null;
      this.$router.push('/login');
    }
  }
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: Arial, sans-serif;
  background-color: #f5f5f5;
}

#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.navbar {
  background-color: #333;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  height: 60px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.navbar-brand {
  font-size: 18px;
  font-weight: bold;
}

.navbar-menu {
  display: flex;
  flex: 1;
}

.navbar-item {
  color: white;
  text-decoration: none;
  padding: 0 15px;
  line-height: 60px;
  transition: background-color 0.3s;
}

.navbar-item:hover {
  background-color: rgba(255,255,255,0.1);
}

.navbar-user {
  display: flex;
  align-items: center;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 10px;
  color: white;
  font-size: 14px;
}

.logout-btn {
  background-color: #ff4d4f;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
  font-size: 14px;
}

.logout-btn:hover {
  background-color: #e63946;
}

.main-content {
  flex: 1;
  padding: 20px;
}
</style>