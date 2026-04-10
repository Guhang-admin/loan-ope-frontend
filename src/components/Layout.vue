<template>
  <div class="layout">
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
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Layout'
}
</script>

<style scoped>
.layout {
  display: flex;
  min-height: 85vh;
  gap: 20px;
  padding: 0 20px;
  margin-top: 20px;
}

/* 左侧菜单 */
.sidebar {
  width: 250px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  padding: 20px 0;
  flex-shrink: 0;
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

/* 响应式设计 */
@media (max-width: 768px) {
  .layout {
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
