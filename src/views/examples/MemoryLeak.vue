<template>
  <div class="memoryleak-container">
    <h1>第3期：内存异常 - 内存泄漏问题</h1>
    
    <div class="case-description">
      <h2>问题描述</h2>
      <p>系统在运行一段时间后，出现内存占用持续增长，最终导致系统响应缓慢、频繁的 Full GC 甚至内存溢出错误 (OOM)。</p>
      <div class="error-message">
        <strong>错误信息：</strong>
        <code>java.lang.OutOfMemoryError: Java heap space</code>
      </div>
    </div>
    
    <div class="case-content">
      <div class="demo-section">
        <h2>演示</h2>
        
        <div class="cache-form">
          <div class="form-group">
            <label>数据ID：</label>
            <input type="number" v-model="dataId" placeholder="请输入ID">
          </div>
          <div class="form-group">
            <label>数据内容：</label>
            <input type="text" v-model="dataContent" placeholder="请输入数据内容">
          </div>
          <div class="form-actions">
            <button @click="addToCache" class="btn btn-primary">
              添加到缓存
            </button>
            <button @click="getCacheStatus" class="btn btn-info">
              查看缓存状态
            </button>
            <button @click="clearCache" class="btn btn-warning">
              清理缓存
            </button>
          </div>
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
            <div class="result-item" v-if="result.cacheSize">
              <strong>缓存大小：</strong>{{ result.cacheSize }}
            </div>
            <div class="result-item" v-if="result.warning">
              <strong>警告：</strong>{{ result.warning }}
            </div>
            <div class="result-item" v-if="result.info">
              <strong>提示：</strong>{{ result.info }}
            </div>
            <div class="result-item" v-if="result.error">
              <strong>错误：</strong>{{ result.error }}
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
          <li><strong>实现缓存过期机制：</strong>定期清理不再使用的对象</li>
          <li><strong>使用弱引用或软引用：</strong>允许垃圾回收器在内存不足时回收对象</li>
          <li><strong>及时释放资源：</strong>关闭流、数据库连接等资源</li>
          <li><strong>JVM 参数调优：</strong>合理设置堆内存大小，选择合适的垃圾收集器</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import api from '../../api/api';

export default {
  name: 'MemoryLeakExample',
  data() {
    return {
      dataId: 1,
      dataContent: '测试数据',
      result: null,
      activeTab: 'error',
      errorCode: `public static class BadUserCache {
    // 问题：静态集合导致内存泄漏
    private static final Map<Long, User> userCache = new ConcurrentHashMap<>();
    
    public void addUser(User user) {
        userCache.put(user.getId(), user);
    }
    
    public User getUser(Long id) {
        return userCache.get(id);
    }
    
    // 问题：没有清理机制
    public void clear() {
        // 空实现
    }
}`,
      fixedCode: `public static class GoodUserCache {
    private final Map<Long, User> userCache = new ConcurrentHashMap<>();
    private final Map<Long, Long> lastAccessTime = new ConcurrentHashMap<>();
    private static final long EXPIRY_TIME = 3600000; // 1小时
    
    public void addUser(User user) {
        userCache.put(user.getId(), user);
        lastAccessTime.put(user.getId(), System.currentTimeMillis());
    }
    
    public User getUser(Long id) {
        User user = userCache.get(id);
        if (user != null) {
            lastAccessTime.put(id, System.currentTimeMillis());
        }
        return user;
    }
    
    // 定期清理过期数据
    public void cleanup() {
        long now = System.currentTimeMillis();
        List<Long> toRemove = new ArrayList<>();
        for (Map.Entry<Long, Long> entry : lastAccessTime.entrySet()) {
            if (now - entry.getValue() > EXPIRY_TIME) {
                toRemove.add(entry.getKey());
            }
        }
        for (Long id : toRemove) {
            userCache.remove(id);
            lastAccessTime.remove(id);
        }
    }
    
    public void clear() {
        userCache.clear();
        lastAccessTime.clear();
    }
}`
    };
  },
  methods: {
    async addToCache() {
      try {
        this.result = await api.examples.memoryleak.addToCache(
          this.dataId, 
          this.dataContent
        );
        this.dataId++;
      } catch (error) {
        this.result = {
          status: 'error',
          message: '操作失败',
          error: error.message
        };
      }
    },
    async getCacheStatus() {
      try {
        this.result = await api.examples.memoryleak.getCacheStatus();
      } catch (error) {
        this.result = {
          status: 'error',
          message: '操作失败',
          error: error.message
        };
      }
    },
    async clearCache() {
      try {
        this.result = await api.examples.memoryleak.clearCache();
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
.memoryleak-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

h1 {
  text-align: center;
  color: #333;
  margin-bottom: 30px;
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

.cache-form {
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: inline-block;
  width: 100px;
  font-weight: 500;
}

.form-group input {
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  width: 200px;
}

.form-actions {
  margin-top: 20px;
}

.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  margin-right: 10px;
}

.btn-primary {
  background: #007bff;
  color: white;
}

.btn-info {
  background: #17a2b8;
  color: white;
}

.btn-warning {
  background: #ffc107;
  color: #212529;
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