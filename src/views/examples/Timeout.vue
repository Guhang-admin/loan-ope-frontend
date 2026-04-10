<template>
  <div class="example-container">
    <div class="header">
      <button class="back-btn" @click="goBack">
        <i class="back-icon">🏠</i>
        <span>返回主页面</span>
      </button>
      <h1>第1期：神秘超时 - 数据库连接池耗尽导致的超时问题</h1>
    </div>

    <div class="case-description">
      <h2>问题描述</h2>
      <p>系统在高并发下出现间歇性超时，表现为数据库连接池耗尽，API响应时间突然变长。</p>
      <div class="error-message">
        <strong>错误信息：</strong>
        <code>java.sql.SQLTransientConnectionException: HikariPool-1 - Connection is not available, request timed out after 30000ms.</code>
      </div>
    </div>

    <div class="case-content">
      <div class="demo-section">
        <h2>演示</h2>

        <div class="demo-controls">
          <button @click="simulateConnectionLeak" :class="buttonTypes.danger.class">
            模拟连接泄漏
          </button>
          <button @click="fixedConnectionLeak" :class="buttonTypes.success.class">
            正确关闭连接
          </button>
        </div>

        <div class="result-section" v-if="result">
          <h3>结果</h3>
          <div class="result-card" :class="resultStatus[result.status].class">
            <div class="result-item">
              <strong>状态：</strong>{{ resultStatus[result.status].icon }} {{ resultStatus[result.status].label }}
            </div>
            <div class="result-item">
              <strong>消息：</strong>{{ result.message }}
            </div>
            <div class="result-item" v-if="result.connectionCount">
              <strong>连接数：</strong>{{ result.connectionCount }}
            </div>
            <div class="result-item" v-if="result.warning">
              <strong>警告：</strong>{{ result.warning }}
            </div>
            <div class="result-item" v-if="result.info">
              <strong>提示：</strong>{{ result.info }}
            </div>
          </div>
        </div>
      </div>

      <div class="code-section">
        <h2>代码分析</h2>

        <div class="code-tabs">
          <div class="tab">
            <button
              v-for="(config, key) in tabConfigs"
              :key="key"
              @click="switchTab(key)"
              :class="{ active: activeTab === key }"
            >
              {{ config.icon }} {{ config.label }}
            </button>
          </div>

          <div class="code-content" v-show="activeTab === 'error'">
            <pre><code>{{ errorCode }}</code></pre>
          </div>

          <div class="code-content" v-show="activeTab === 'fixed'">
            <pre><code>{{ fixedCode }}</code></pre>
          </div>
        </div>
      </div>

      <div class="solution-section">
        <h2>解决方案</h2>
        <ul>
          <li><strong>使用 try-with-resources：</strong>确保资源自动关闭，即使在异常情况下也能正确释放连接</li>
          <li><strong>连接池参数调优：</strong>合理设置最小连接数、最大连接数、连接超时时间等</li>
          <li><strong>监控体系：</strong>设置连接池使用率阈值，配置自动告警</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import api from '../../api/api';
import { exampleMixin, exampleStyles } from '../../utils/exampleMixin';

export default {
  name: 'TimeoutExample',
  mixins: [exampleMixin],
  data() {
    return {
      errorCode: `public User getUserById(Long id) {
    Connection conn = null;
    PreparedStatement stmt = null;
    ResultSet rs = null;
    try {
        conn = dataSource.getConnection();
        String sql = "SELECT * FROM user WHERE id = ?";
        stmt = conn.prepareStatement(sql);
        stmt.setLong(1, id);
        rs = stmt.executeQuery();
        if (rs.next()) {
            User user = new User();
            user.setId(rs.getLong("id"));
            user.setName(rs.getString("name"));
            return user;
        }
    } catch (SQLException e) {
        logger.error("Database error", e);
    }
    // 问题：没有关闭连接、语句和结果集
    return null;
}`,
      fixedCode: `public User getUserById(Long id) {
    try (Connection conn = dataSource.getConnection();
         PreparedStatement stmt = conn.prepareStatement("SELECT * FROM user WHERE id = ?");) {
        stmt.setLong(1, id);
        try (ResultSet rs = stmt.executeQuery()) {
            if (rs.next()) {
                User user = new User();
                user.setId(rs.getLong("id"));
                user.setName(rs.getString("name"));
                return user;
            }
        }
    } catch (SQLException e) {
        logger.error("Database error", e);
    }
    return null;
}`,
      buttonTypes: exampleStyles.buttonTypes,
      resultStatus: exampleStyles.resultStatus,
      tabConfigs: {
        error: exampleStyles.tabs.error,
        fixed: exampleStyles.tabs.fixed
      }
    };
  },
  methods: {
    async simulateConnectionLeak() {
      try {
        this.clearResult();
        this.log('开始模拟连接泄漏...');
        const response = await api.examples.timeout.simulateLeak();
        this.result = response;
        this.log('连接泄漏模拟完成', response.status);
      } catch (error) {
        this.setErrorResult('操作失败', error.message);
        this.log('操作失败: ' + error.message, 'error');
      }
    },

    async fixedConnectionLeak() {
      try {
        this.clearResult();
        this.log('开始正确关闭连接...');
        const response = await api.examples.timeout.fixedLeak();
        this.result = response;
        this.log('正确关闭连接完成', response.status);
      } catch (error) {
        this.setErrorResult('操作失败', error.message);
        this.log('操作失败: ' + error.message, 'error');
      }
    }
  }
}
</script>

<style scoped>
/* 只保留组件特有的样式，通用样式已移至 common.css */
.example-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}
</style>