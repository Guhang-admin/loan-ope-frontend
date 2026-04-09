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
    </nav>
    <main class="main-content">
      <router-view />
    </main>
  </div>
</template>

<script>
export default {
  name: 'App'
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

.main-content {
  flex: 1;
  padding: 20px;
}
</style>