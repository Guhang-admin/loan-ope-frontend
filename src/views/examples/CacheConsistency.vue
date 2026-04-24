<template>
  <div class="example-container">
    <div class="header">
      <button class="back-btn" @click="goBackToExamples">
        <i class="back-icon">🏠</i>
        <span>返回案例列表</span>
      </button>
      <h1>高级案例：缓存一致性问题</h1>
    </div>

    <div class="case-description">
      <h2>问题描述</h2>
      <p>缓存与数据库之间的数据一致性是分布式系统中的常见挑战。本案例演示了缓存穿透、缓存击穿、缓存雪崩和缓存一致性等问题。</p>
      <div class="error-message">
        <strong>常见问题：</strong>
        <code>缓存穿透、缓存击穿、缓存雪崩、数据不一致</code>
      </div>
    </div>

    <div class="case-content">
      <div class="demo-section">
        <h2>演示</h2>

        <div class="demo-controls">
          <div class="input-group">
            <label>商品ID：</label>
            <input type="number" v-model.number="productId" min="1" max="10" />
          </div>
          <div class="input-group" v-if="activeDemo === 'consistency'">
            <label>新价格：</label>
            <input type="number" v-model.number="newPrice" min="50" max="500" step="50" />
          </div>
        </div>

        <div class="demo-buttons">
          <button 
            @click="setActiveDemo('penetration')" 
            :class="[buttonTypes.danger.class, { 'active': activeDemo === 'penetration' }]"
          >
            缓存穿透
          </button>
          <button 
            @click="setActiveDemo('breakdown')" 
            :class="[buttonTypes.secondary.class, { 'active': activeDemo === 'breakdown' }]"
          >
            缓存击穿
          </button>
          <button 
            @click="setActiveDemo('avalanche')" 
            :class="[buttonTypes.secondary.class, { 'active': activeDemo === 'avalanche' }]"
          >
            缓存雪崩
          </button>
          <button 
            @click="setActiveDemo('consistency')" 
            :class="[buttonTypes.primary.class, { 'active': activeDemo === 'consistency' }]"
          >
            缓存一致性
          </button>
        </div>

        <div class="demo-actions">
          <button 
            @click="testProblem" 
            :class="[buttonTypes.danger.class, { 'disabled': isLoading }]"
            :disabled="isLoading"
          >
            测试问题
          </button>
          <button 
            @click="testSolution" 
            :class="[buttonTypes.success.class, { 'disabled': isLoading }]"
            :disabled="isLoading"
          >
            测试解决方案
          </button>
          <button 
            @click="resetData" 
            :class="[buttonTypes.secondary.class, { 'disabled': isLoading }]"
            :disabled="isLoading"
          >
            重置数据
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
          <div class="result-card" v-else :class="result.error ? 'result-card-error' : 'result-card-success'">
            <div class="result-item">
              <strong>操作：</strong>{{ result.operation }}
            </div>
            <div class="result-item">
              <strong>消息：</strong>{{ result.message }}
            </div>
            <div class="result-item" v-if="result.productId">
              <strong>商品ID：</strong>{{ result.productId }}
            </div>
            <div class="result-item" v-if="result.fromCache">
              <strong>来源：</strong>缓存
            </div>
            <div class="result-item" v-if="result.fromDatabase">
              <strong>来源：</strong>数据库
            </div>
            <div class="result-item" v-if="result.dbQueryCount">
              <strong>数据库查询次数：</strong>{{ result.dbQueryCount }}
            </div>
            <div class="result-item" v-if="result.errorCount">
              <strong>错误次数：</strong>{{ result.errorCount }}
            </div>
            <div class="result-item" v-if="result.originalPrice">
              <strong>原始价格：</strong>{{ result.originalPrice }}
            </div>
            <div class="result-item" v-if="result.cachedPrice">
              <strong>缓存价格：</strong>{{ result.cachedPrice }}
            </div>
            <div class="result-item" v-if="result.newPrice">
              <strong>新价格：</strong>{{ result.newPrice }}
            </div>
            <div class="result-item" v-if="result.executionTime">
              <strong>执行时间：</strong>{{ result.executionTime }}ms
            </div>
            <div class="result-item" v-if="result.product">
              <strong>商品信息：</strong>
              <div class="product-info">
                <div>ID：{{ result.product.id }}</div>
                <div>名称：{{ result.product.name }}</div>
                <div>价格：{{ result.product.price }}</div>
                <div>库存：{{ result.product.stock }}</div>
              </div>
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

        <div class="product-status" v-if="products.length > 0">
          <h3>商品状态</h3>
          <div class="product-cards">
            <div class="product-card" v-for="product in products" :key="product.id">
              <h4>商品 {{ product.id }}：{{ product.name }}</h4>
              <div class="product-price">
                <strong>价格：</strong>{{ product.price }}
              </div>
              <div class="product-stock">
                <strong>库存：</strong>{{ product.stock }}
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

          <div class="code-content" v-show="activeTab === 'penetration'">
            <pre><code v-html="highlightCode(penetrationCode)"></code></pre>
          </div>

          <div class="code-content" v-show="activeTab === 'breakdown'">
            <pre><code v-html="highlightCode(breakdownCode)"></code></pre>
          </div>

          <div class="code-content" v-show="activeTab === 'avalanche'">
            <pre><code v-html="highlightCode(avalancheCode)"></code></pre>
          </div>

          <div class="code-content" v-show="activeTab === 'consistency'">
            <pre><code v-html="highlightCode(consistencyCode)"></code></pre>
          </div>

          <div class="code-content" v-show="activeTab === 'solutions'">
            <pre><code v-html="highlightCode(solutionsCode)"></code></pre>
          </div>
        </div>
      </div>

      <div class="solution-section">
        <h2>解决方案</h2>
        <ul>
          <li><strong>缓存穿透：</strong>使用布隆过滤器或缓存null值</li>
          <li><strong>缓存击穿：</strong>使用互斥锁或提前刷新缓存</li>
          <li><strong>缓存雪崩：</strong>设置不同的缓存过期时间，使用多级缓存</li>
          <li><strong>缓存一致性：</strong>使用延迟双删、消息队列或Canal</li>
          <li><strong>缓存策略：</strong>选择合适的缓存更新策略（如先更新数据库后更新缓存）</li>
          <li><strong>监控告警：</strong>实时监控缓存命中率和数据库压力</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { exampleMixin, exampleStyles } from '../../utils/exampleMixin';
import api from '../../api/api';

export default {
  name: 'CacheConsistencyExample',
  mixins: [exampleMixin],
  data() {
    return {
      productId: 1,
      newPrice: 150,
      activeDemo: 'penetration',
      isLoading: false,
      result: null,
      products: [],
      
      penetrationCode: `// 缓存穿透问题
public CacheResult simulateCachePenetration(Long productId) {
    // 从缓存获取
    Product cachedProduct = cache.get(productId);
    if (cachedProduct != null) {
        return cachedProduct;
    }
    
    // 缓存未命中，从数据库获取
    Product dbProduct = database.get(productId);
    if (dbProduct == null) {
        // 商品不存在，但仍然会查询数据库
        // 问题：恶意请求不存在的ID会导致大量数据库查询
        return null;
    }
    
    // 将数据放入缓存
    cache.put(productId, dbProduct);
    return dbProduct;
}

// 解决方案
public CacheResult fixCachePenetration(Long productId) {
    // 从缓存获取
    Product cachedProduct = cache.get(productId);
    if (cachedProduct != null) {
        return cachedProduct;
    }
    
    // 缓存未命中，从数据库获取
    Product dbProduct = database.get(productId);
    if (dbProduct == null) {
        // 商品不存在，将null值放入缓存
        cache.put(productId, null);
        return null;
    }
    
    // 将数据放入缓存
    cache.put(productId, dbProduct);
    return dbProduct;
}`,
      
      breakdownCode: `// 缓存击穿问题
public CacheResult simulateCacheBreakdown(Long productId) {
    // 模拟缓存过期
    cache.remove(productId);
    
    // 模拟大量并发请求
    for (int i = 0; i < 10; i++) {
        new Thread(() -> {
            // 从缓存获取
            Product cachedProduct = cache.get(productId);
            if (cachedProduct != null) {
                return;
            }
            
            // 缓存未命中，从数据库获取
            Product dbProduct = database.get(productId);
            // 模拟数据库查询延迟
            Thread.sleep(100);
            
            // 将数据放入缓存
            cache.put(productId, dbProduct);
        }).start();
    }
    
    // 问题：多个线程同时查询数据库，导致数据库压力过大
    return result;
}

// 解决方案
public CacheResult fixCacheBreakdown(Long productId) {
    // 使用互斥锁
    String lockKey = "lock:product:" + productId;
    if (acquireLock(lockKey)) {
        try {
            // 从缓存获取
            Product cachedProduct = cache.get(productId);
            if (cachedProduct != null) {
                return cachedProduct;
            }
            
            // 缓存未命中，从数据库获取
            Product dbProduct = database.get(productId);
            
            // 将数据放入缓存
            cache.put(productId, dbProduct);
            return dbProduct;
        } finally {
            releaseLock(lockKey);
        }
    }
    return null;
}`,
      
      avalancheCode: `// 缓存雪崩问题
public CacheResult simulateCacheAvalanche() {
    // 模拟大量缓存同时过期
    cache.clear();
    
    // 模拟大量并发请求
    for (int i = 0; i < 20; i++) {
        final Long productId = (long) (i % 3) + 1;
        new Thread(() -> {
            // 从缓存获取
            Product cachedProduct = cache.get(productId);
            if (cachedProduct != null) {
                return;
            }
            
            // 缓存未命中，从数据库获取
            Product dbProduct = database.get(productId);
            // 模拟数据库查询延迟
            Thread.sleep(100);
            
            // 将数据放入缓存
            cache.put(productId, dbProduct);
        }).start();
    }
    
    // 问题：大量缓存同时过期，导致数据库压力骤增
    return result;
}

// 解决方案
public void fixCacheAvalanche() {
    // 设置不同的缓存过期时间
    int baseExpireTime = 3600;
    for (Product product : database.values()) {
        // 添加随机过期时间
        int expireTime = baseExpireTime + (int) (Math.random() * 3600);
        cache.put(product.getId(), product, expireTime);
    }
}`,
      
      consistencyCode: `// 缓存一致性问题
public CacheResult simulateCacheConsistency(Long productId, BigDecimal newPrice) {
    // 更新数据库
    Product product = database.get(productId);
    product.setPrice(newPrice);
    database.put(productId, product);
    
    // 模拟缓存更新失败
    if (Math.random() < 0.5) {
        // 缓存更新失败
        // 问题：数据库和缓存数据不一致
        return result;
    } else {
        // 缓存更新成功
        cache.put(productId, product);
        return result;
    }
}

// 解决方案
public CacheResult fixCacheConsistency(Long productId, BigDecimal newPrice) {
    // 延迟双删策略
    // 1. 删除缓存
    cache.remove(productId);
    
    // 2. 更新数据库
    Product product = database.get(productId);
    product.setPrice(newPrice);
    database.put(productId, product);
    
    // 3. 延迟删除缓存（防止并发更新）
    Thread.sleep(500);
    cache.remove(productId);
    
    // 4. 重新写入缓存
    cache.put(productId, product);
    
    return result;
}`,
      
      solutionsCode: `// 缓存策略总结

1. 缓存穿透解决方案：
   - 布隆过滤器：过滤掉不存在的键
   - 缓存null值：对不存在的数据也进行缓存
   - 限流：对恶意请求进行限流

2. 缓存击穿解决方案：
   - 互斥锁：防止多个线程同时查询数据库
   - 提前刷新：在缓存过期前提前更新
   - 热点数据永不过期：对热点数据设置永不过期

3. 缓存雪崩解决方案：
   - 随机过期时间：设置不同的过期时间
   - 多级缓存：使用本地缓存+分布式缓存
   - 限流降级：当缓存失效时进行限流

4. 缓存一致性解决方案：
   - 延迟双删：先删缓存，再更新数据库，再删缓存
   - 消息队列：使用消息队列异步更新缓存
   - Canal：监听数据库binlog更新缓存

5. 缓存更新策略：
   - 先更新数据库，后更新缓存
   - 先删除缓存，后更新数据库
   - 基于消息队列的异步更新`,
      
      buttonTypes: exampleStyles.buttonTypes,
      resultStatus: exampleStyles.resultStatus,
      tabConfigs: {
        penetration: { icon: '🔍', label: '缓存穿透' },
        breakdown: { icon: '💥', label: '缓存击穿' },
        avalanche: { icon: '❄️', label: '缓存雪崩' },
        consistency: { icon: '🔄', label: '缓存一致性' },
        solutions: { icon: '✅', label: '解决方案' }
      },
      activeTab: 'penetration'
    };
  },
  mounted() {
    this.getProducts();
  },
  methods: {
    setActiveDemo(demo) {
      this.activeDemo = demo;
      this.activeTab = demo;
      this.result = null;
    },
    
    async testProblem() {
      try {
        this.isLoading = true;
        this.result = null;
        
        let response;
        switch (this.activeDemo) {
          case 'penetration':
            response = await api.examples.cacheConsistency.simulateCachePenetration(this.productId);
            break;
          case 'breakdown':
            response = await api.examples.cacheConsistency.simulateCacheBreakdown(this.productId);
            break;
          case 'avalanche':
            response = await api.examples.cacheConsistency.simulateCacheAvalanche();
            break;
          case 'consistency':
            response = await api.examples.cacheConsistency.simulateCacheConsistency(this.productId, this.newPrice);
            break;
          default:
            return;
        }
        
        this.result = response;
        this.getProducts();
      } catch (error) {
        this.result = {
          operation: this.activeDemo,
          message: '操作失败',
          error: error.message || '未知错误'
        };
      } finally {
        this.isLoading = false;
      }
    },
    
    async testSolution() {
      try {
        this.isLoading = true;
        this.result = null;
        
        let response;
        switch (this.activeDemo) {
          case 'penetration':
            response = await api.examples.cacheConsistency.fixCachePenetration(this.productId);
            break;
          case 'breakdown':
            response = await api.examples.cacheConsistency.fixCacheBreakdown(this.productId);
            break;
          case 'consistency':
            response = await api.examples.cacheConsistency.fixCacheConsistency(this.productId, this.newPrice);
            break;
          default:
            return;
        }
        
        this.result = response;
        this.getProducts();
      } catch (error) {
        this.result = {
          operation: this.activeDemo + ' (解决方案)',
          message: '操作失败',
          error: error.message || '未知错误'
        };
      } finally {
        this.isLoading = false;
      }
    },
    
    async resetData() {
      try {
        this.isLoading = true;
        
        await api.examples.cacheConsistency.reset();
        
        this.result = {
          operation: '重置数据',
          message: '数据已重置',
          info: '所有商品和缓存已恢复到初始状态'
        };
        
        this.getProducts();
      } catch (error) {
        this.result = {
          operation: '重置数据',
          message: '重置失败',
          error: error.message || '未知错误'
        };
      } finally {
        this.isLoading = false;
      }
    },
    
    async getProducts() {
      try {
        const response = await api.examples.cacheConsistency.getProducts();
        this.products = response;
      } catch (error) {
        console.error('获取商品信息失败:', error);
      }
    },
    
    switchTab(tab) {
      this.activeTab = tab;
    },
    
    goBackToExamples() {
      this.$router.push('/examples');
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

.demo-controls {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.input-group {
  display: flex;
  align-items: center;
  gap: 10px;
}

.input-group label {
  font-weight: bold;
  white-space: nowrap;
}

.input-group input {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  width: 120px;
}

.demo-buttons {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.demo-buttons button {
  flex: 1;
  min-width: 120px;
}

.demo-buttons button.active {
  border: 2px solid #007bff;
  box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
}

.demo-actions {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.demo-actions button.disabled {
  background-color: #ccc !important;
  cursor: not-allowed !important;
  transform: none !important;
  box-shadow: none !important;
}

.product-status {
  margin-top: 30px;
}

.product-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-top: 15px;
}

.product-card {
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.product-card h4 {
  margin-top: 0;
  margin-bottom: 10px;
  color: #333;
}

.product-price {
  font-size: 18px;
  margin-bottom: 10px;
}

.product-stock {
  font-size: 14px;
  color: #666;
}

.product-info {
  background-color: #f5f5f5;
  padding: 10px;
  border-radius: 4px;
  margin-top: 5px;
  font-size: 14px;
}

@media (max-width: 768px) {
  .demo-controls {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .demo-buttons {
    flex-direction: column;
    width: 100%;
  }
  
  .demo-actions {
    flex-direction: column;
    width: 100%;
  }
  
  .demo-actions button {
    width: 100%;
  }
}
</style>