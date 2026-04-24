<template>
  <Layout>
    <div class="examples-container">
      <div class="header">
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
        
        <div class="case-card " @click="navigateTo('/examples/distributed-transaction')">
          <div class="case-number">05</div>
          <h3>分布式事务</h3>
          <p>分布式环境下的数据一致性问题</p>
          <div class="case-tag advanced-tag">高级案例</div>
        </div>
        
        <div class="case-card " @click="navigateTo('/examples/cache-consistency')">
          <div class="case-number">06</div>
          <h3>缓存一致性</h3>
          <p>缓存与数据库之间的数据一致性问题</p>
          <div class="case-tag advanced-tag">高级案例</div>
        </div>
      </div>
    </div>
  </Layout>
</template>

<script>
import Layout from '../../components/Layout.vue';

export default {
  name: 'ExamplesIndex',
  components: {
    Layout
  },
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

/* 高级案例样式 */
.case-card.advanced {
  border: 2px solid #007bff;
  box-shadow: 0 4px 8px rgba(0, 123, 255, 0.2);
  transition: all 0.3s ease;
}

.case-card.advanced:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0, 123, 255, 0.3);
}

.case-tag.advanced-tag {
  background-color: #007bff;
  color: white;
  font-weight: bold;
}
</style>