<template>
  <div class="example-container">
    <div class="header">
      <button class="back-btn" @click="goBackToExamples">
        <i class="back-icon">🏠</i>
        <span>返回案例列表</span>
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
          <button 
            @click="simulateConnectionLeak" 
            :class="[buttonTypes.danger.class, { 'disabled': isLoading }]"
            :disabled="isLoading"
          >
            模拟连接泄漏
          </button>
          <button 
            @click="fixedConnectionLeak" 
            :class="[buttonTypes.success.class, { 'disabled': isLoading }]"
            :disabled="isLoading"
          >
            正确关闭连接
          </button>
          <button 
            @click="resetConnectionCount" 
            :class="[buttonTypes.secondary.class, { 'disabled': isLoading }]"
            :disabled="isLoading"
          >
            连接泄漏恢复
          </button>
        </div>

        <div class="result-section" v-if="result || isLoading">
          <h3>结果</h3>
          <div class="result-card result-card-info" v-if="isLoading">
            <div class="result-item">
              <strong>状态：</strong>⏳ 处理中
            </div>
            <div class="result-item">
              <strong>消息：</strong>正在处理，请稍候...
            </div>
          </div>
          <div class="result-card" v-else :class="resultStatus[result.status].class">
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
            <div class="result-item" v-if="result.details">
              <strong>详情：</strong>{{ result.details }}
            </div>
            <div class="result-item" v-if="result.error">
              <strong>错误：</strong>{{ result.error }}
            </div>
            <div class="user-info" v-if="result.user">
              <strong>查询结果：</strong>
              <div class="user-details">
                <div>用户ID：{{ result.user.id }}</div>
                <div>用户名：{{ result.user.username }}</div>
                <div>姓名：{{ result.user.name }}</div>
                <div>角色：{{ result.user.role }}</div>
                <div>信用分：{{ result.user.creditScore }}</div>
              </div>
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
            <pre><code v-html="highlightCode(errorCode, 'java')"></code></pre>
          </div>

          <div class="code-content" v-show="activeTab === 'fixed'">
            <pre><code v-html="highlightCode(fixedCode, 'java')"></code></pre>
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
      },
      isLoading: false
    };
  },
  methods: {
    async simulateConnectionLeak() {
      try {
        this.isLoading = true;
        this.clearResult();
        this.log('开始模拟连接泄漏...');
        const response = await api.examples.timeout.simulateLeak();
        this.result = response;
        this.log('连接泄漏模拟完成', response.status);
      } catch (error) {
        this.setErrorResult('操作失败', error.message);
        this.log('操作失败: ' + error.message, 'error');
      } finally {
        this.isLoading = false;
      }
    },

    async fixedConnectionLeak() {
      try {
        this.isLoading = true;
        this.clearResult();
        this.log('开始正确关闭连接...');
        const response = await api.examples.timeout.fixedLeak();
        this.result = response;
        this.log('正确关闭连接完成', response.status);
      } catch (error) {
        this.setErrorResult('操作失败', error.message);
        this.log('操作失败: ' + error.message, 'error');
      } finally {
        this.isLoading = false;
      }
    },

    async resetConnectionCount() {
      try {
        this.isLoading = true;
        this.clearResult();
        this.log('开始连接泄漏恢复...');
        const response = await api.examples.timeout.reset();
        this.result = response;
        this.log('连接泄漏恢复完成', response.status);
      } catch (error) {
        this.setErrorResult('操作失败', error.message);
        this.log('操作失败: ' + error.message, 'error');
      } finally {
        this.isLoading = false;
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

.demo-controls button.disabled {
  background-color: #ccc !important;
  cursor: not-allowed !important;
  transform: none !important;
  box-shadow: none !important;
}

.result-card-info {
  background-color: #e3f2fd;
  border-left: 4px solid #2196f3;
  color: #1976d2;
  padding: 15px;
  border-radius: 4px;
  margin-top: 10px;
}

.user-info {
  margin-top: 10px;
  padding: 10px;
  background-color: #f5f5f5;
  border-radius: 4px;
}

.user-details {
  margin-left: 20px;
  margin-top: 5px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 10px;
}

.user-details div {
  font-size: 14px;
  color: #333;
}
</style>