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
          <button @click="simulateConnectionLeak" class="btn btn-danger">
            模拟连接泄漏
          </button>
          <button @click="fixedConnectionLeak" class="btn btn-success">
            正确关闭连接
          </button>
        </div>
        
        <div class="result-section" v-if="result">
          <h3>结果</h3>
          <div class="result-card" :class="result.status === 'success' ? 'success' : 'error'">
            <div class="result-item">
              <strong>状态：</strong>{{ result.status === 'success' ? '成功' : '失败' }}
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
            <button @click="activeTab = 'error'" :class="{ active: activeTab === 'error' }">
              错误代码
            </button>
            <button @click="activeTab = 'fixed'" :class="{ active: activeTab === 'fixed' }">
              正确代码
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

export default {
  name: 'TimeoutExample',
  data() {
    return {
      result: null,
      activeTab: 'error',
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
}`
    };
  },
  methods: {
    goBack() {
      this.$router.push('/');
    },
    async simulateConnectionLeak() {
      try {
        this.result = await api.examples.timeout.simulateLeak();
      } catch (error) {
        this.result = {
          status: 'error',
          message: '操作失败',
          error: error.message
        };
      }
    },
    async fixedConnectionLeak() {
      try {
        this.result = await api.examples.timeout.fixedLeak();
      } catch (error) {
        this.result = {
          status: 'error',
          message: '操作失败',
          error: error.message
        };
      }
    }
  }
}
</script>

<style scoped>
.example-container {
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

.case-description {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 30px;
}

.error-message {
  background: #f8d7da;
  border: 1px solid #f5c6cb;
  border-radius: 4px;
  padding: 10px;
  margin-top: 10px;
  font-size: 14px;
}

.error-message code {
  display: block;
  white-space: pre-wrap;
  margin-top: 5px;
}

.demo-section {
  background: white;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 30px;
}

.demo-controls {
  margin-bottom: 20px;
}

.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  margin-right: 10px;
}

.btn-danger {
  background: #dc3545;
  color: white;
}

.btn-success {
  background: #28a745;
  color: white;
}

.result-section {
  margin-top: 20px;
}

.result-card {
  padding: 20px;
  border-radius: 4px;
  margin-top: 10px;
}

.result-card.success {
  background: #d4edda;
  border: 1px solid #c3e6cb;
}

.result-card.error {
  background: #f8d7da;
  border: 1px solid #f5c6cb;
}

.result-item {
  margin-bottom: 10px;
}

.code-section {
  background: white;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 30px;
}

.code-tabs {
  margin-top: 20px;
}

.tab {
  display: flex;
  margin-bottom: 10px;
}

.tab button {
  padding: 10px 20px;
  border: 1px solid #ddd;
  background: #f8f9fa;
  cursor: pointer;
  border-radius: 4px 4px 0 0;
  margin-right: 5px;
}

.tab button.active {
  background: white;
  border-bottom: 1px solid white;
  font-weight: bold;
}

.code-content {
  border: 1px solid #ddd;
  border-radius: 0 4px 4px 4px;
  overflow: auto;
}

.code-content pre {
  margin: 0;
  padding: 20px;
  background: #f8f9fa;
  font-family: 'Courier New', Courier, monospace;
  font-size: 14px;
  line-height: 1.5;
}

.solution-section {
  background: white;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.solution-section ul {
  margin-top: 10px;
  padding-left: 20px;
}

.solution-section li {
  margin-bottom: 10px;
}
</style>