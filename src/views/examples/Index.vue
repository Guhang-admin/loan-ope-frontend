<template>
  <div class="examples-container">
    <div class="header">
      <button class="back-btn" @click="goBackHome">
        <i class="back-icon">🏠</i>
        <span>返回主页面</span>
      </button>
      <h1>进阶实战案例</h1>
    </div>
    <p class="description">
      本页面包含4期真实生产问题的案例分析和解决方案，用于培训和学习。
    </p>
    
    <div class="cases-grid">
      <div class="case-card" @click="navigateTo('/examples/timeout')">
        <div class="case-number">01</div>
        <h3>神秘超时</h3>
        <p>数据库连接池超时问题</p>
        <div class="case-tag">连接泄漏</div>
      </div>
      
      <div class="case-card" @click="navigateTo('/examples/dataconsistency')">
        <div class="case-number">02</div>
        <h3>数据不一致</h3>
        <p>事务管理问题</p>
        <div class="case-tag">事务控制</div>
      </div>
      
      <div class="case-card" @click="navigateTo('/examples/memoryleak')">
        <div class="case-number">03</div>
        <h3>内存异常</h3>
        <p>内存泄漏问题</p>
        <div class="case-tag">内存管理</div>
      </div>
      
      <div class="case-card" @click="navigateTo('/examples/concurrency')">
        <div class="case-number">04</div>
        <h3>并发陷阱</h3>
        <p>竞态条件与死锁问题</p>
        <div class="case-tag">并发控制</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ExamplesIndex',
  methods: {
    goBackHome() {
      this.$router.push('/');
    },
    navigateTo(path) {
      this.$router.push(path);
    }
  }
}
</script>

<style scoped>
.examples-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 30px;
}

.back-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  background-color: #667eea;
  color: white;
  border: none;
  padding: 10px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s;
}

.back-btn:hover {
  background-color: #5568d3;
}

.back-icon {
  font-size: 16px;
}

h1 {
  text-align: center;
  color: #333;
  margin: 0;
  flex: 1;
}

.description {
  text-align: center;
  color: #666;
  margin-bottom: 40px;
  font-size: 16px;
}

.cases-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 30px;
}

.case-card {
  background: white;
  border-radius: 10px;
  padding: 30px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.case-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.case-number {
  position: absolute;
  top: 20px;
  right: 20px;
  font-size: 48px;
  font-weight: bold;
  color: rgba(0, 123, 255, 0.1);
}

.case-card h3 {
  color: #333;
  margin-bottom: 10px;
  font-size: 20px;
}

.case-card p {
  color: #666;
  margin-bottom: 20px;
  font-size: 14px;
}

.case-tag {
  display: inline-block;
  background: #e3f2fd;
  color: #1976d2;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

@media (max-width: 768px) {
  .cases-grid {
    grid-template-columns: 1fr;
  }
}
</style>