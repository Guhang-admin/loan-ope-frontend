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
/* 只保留组件特有的样式，通用样式已移至 common.css */
</style>