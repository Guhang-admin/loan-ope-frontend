<template>
  <div class="js-examples-container">
    <h1>JavaScript 进阶实战案例</h1>
    <p class="description">
      本页面包含4期 JavaScript 常见问题的案例分析和解决方案，用于培训和学习。
    </p>
    
    <div class="cases-grid">
      <div class="case-card" @click="navigateTo('/js-examples/async')">
        <div class="case-icon">
          <i class="fas fa-sync"></i>
        </div>
        <h2>第1期：异步操作陷阱</h2>
        <p>回调地狱、Promise 链使用不当、并行操作串行化</p>
        <div class="case-badge">异步编程</div>
      </div>
      
      <div class="case-card" @click="navigateTo('/js-examples/memoryleak')">
        <div class="case-icon">
          <i class="fas fa-memory"></i>
        </div>
        <h2>第2期：内存泄漏问题</h2>
        <p>闭包、事件监听器、定时器、全局变量导致的内存泄漏</p>
        <div class="case-badge">内存管理</div>
      </div>
      
      <div class="case-card" @click="navigateTo('/js-examples/dom')">
        <div class="case-icon">
          <i class="fas fa-code"></i>
        </div>
        <h2>第3期：DOM 操作性能</h2>
        <p>频繁 DOM 操作、布局抖动、事件委托、样式操作</p>
        <div class="case-badge">性能优化</div>
      </div>
      
      <div class="case-card" @click="navigateTo('/js-examples/security')">
        <div class="case-icon">
          <i class="fas fa-shield-alt"></i>
        </div>
        <h2>第4期：安全问题</h2>
        <p>XSS、CSRF、敏感数据暴露、开放重定向</p>
        <div class="case-badge">安全防护</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'JSExamplesIndex',
  methods: {
    navigateTo(path) {
      this.$router.push(path);
    }
  }
}
</script>

<style scoped>
.js-examples-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

h1 {
  text-align: center;
  color: #333;
  margin-bottom: 20px;
}

.description {
  text-align: center;
  color: #666;
  margin-bottom: 40px;
  font-size: 16px;
}

.cases-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
  margin-top: 40px;
}

.case-card {
  background: white;
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid #e0e0e0;
}

.case-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);
  border-color: #007bff;
}

.case-icon {
  width: 60px;
  height: 60px;
  background: #f0f8ff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  font-size: 24px;
  color: #007bff;
}

.case-card h2 {
  font-size: 18px;
  margin-bottom: 15px;
  color: #333;
}

.case-card p {
  color: #666;
  margin-bottom: 20px;
  line-height: 1.5;
  font-size: 14px;
}

.case-badge {
  display: inline-block;
  background: #e3f2fd;
  color: #1976d2;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
}

@media (max-width: 768px) {
  .cases-grid {
    grid-template-columns: 1fr;
  }
}
</style>