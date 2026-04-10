<template>
  <Layout>
    <div class="js-examples-container">
      <div class="header">
        <h1>JavaScript 进阶实战案例</h1>
      </div>
      <p class="description">
        本页面包含4期 JavaScript 前端问题的案例分析和解决方案，用于培训和学习。
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
  </Layout>
</template>

<script>
import Layout from '../../components/Layout.vue';

export default {
  name: 'JSExamplesIndex',
  components: {
    Layout
  },
  methods: {
    navigateTo(path) {
      this.$router.push(path);
    },
    goBackHome() {
      this.$router.push('/');
    }
  }
}
</script>

<style scoped>
/* 只保留组件特有的样式，通用样式已移至 common.css */
.js-examples-container .case-card {
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.js-examples-container .case-card:hover {
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);
  border-color: #007bff;
}
</style>