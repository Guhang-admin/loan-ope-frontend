<template>
  <div class="home">
    <h1>统计主页</h1>
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
        <p class="stat-value status-ok">正常</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Home',
  data() {
    return {
      totalFiles: 128,
      todayUploads: 15,
      totalUsers: 42
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