<template>
  <div class="state-container">
    <div class="header">
      <button class="back-btn" @click="goBackToJSExamples">
        <i class="back-icon">🏠</i>
        <span>返回案例列表</span>
      </button>
      <h1>高级案例：状态管理陷阱</h1>
    </div>

    <div class="case-description">
      <h2>问题描述</h2>
      <p>在复杂的前端应用中，状态管理不当会导致数据不一致、难以调试、性能问题等挑战。</p>
      <div class="error-message">
        <strong>常见问题：</strong>
        <code>状态更新不同步、响应式失效、状态污染、难以追踪状态变化</code>
      </div>
    </div>

    <div class="case-content">
      <div class="demo-section">
        <h2>演示</h2>

        <div class="demo-buttons">
          <button @click="testBadStateManagement" :class="buttonTypes.danger.class">
            测试糟糕的状态管理
          </button>
          <button @click="testGoodStateManagement" :class="buttonTypes.success.class">
            测试优化的状态管理
          </button>
          <button @click="testReactiveFailure" :class="buttonTypes.danger.class">
            测试响应式失效
          </button>
          <button @click="testReactiveFix" :class="buttonTypes.success.class">
            测试响应式修复
          </button>
          <button @click="testStatePollution" :class="buttonTypes.danger.class">
            测试状态污染
          </button>
          <button @click="testStateIsolation" :class="buttonTypes.success.class">
            测试状态隔离
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
            <div class="result-item" v-if="result.stateSnapshot">
              <strong>状态快照：</strong>
              <pre>{{ JSON.stringify(result.stateSnapshot, null, 2) }}</pre>
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
          </div>
        </div>

        <div class="console-section">
          <h3>控制台输出</h3>
          <div class="console">
            <div v-for="(log, index) in consoleLogs" :key="index" class="log-item">
              {{ log }}
            </div>
          </div>
          <button @click="clearConsole" :class="buttonTypes.secondary.class">
            清空控制台
          </button>
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

          <div class="code-content" v-show="activeTab === 'bad'">
            <pre><code v-html="highlightCode(badStateCode)"></code></pre>
          </div>

          <div class="code-content" v-show="activeTab === 'reactive'">
            <pre><code v-html="highlightCode(reactiveCode)"></code></pre>
          </div>

          <div class="code-content" v-show="activeTab === 'pollution'">
            <pre><code v-html="highlightCode(pollutionCode)"></code></pre>
          </div>

          <div class="code-content" v-show="activeTab === 'optimized'">
            <pre><code v-html="highlightCode(optimizedCode)"></code></pre>
          </div>
        </div>
      </div>

      <div class="solution-section">
        <h2>解决方案</h2>
        <ul>
          <li><strong>单一数据源：</strong>确保每个状态都有唯一的数据源</li>
          <li><strong>不可变性：</strong>使用不可变数据，避免直接修改状态</li>
          <li><strong>响应式正确使用：</strong>理解Vue的响应式原理，正确使用computed和watch</li>
          <li><strong>状态隔离：</strong>不同模块的状态应该相互独立</li>
          <li><strong>状态管理工具：</strong>使用Vuex、Pinia等工具管理复杂状态</li>
          <li><strong>调试工具：</strong>使用Vue DevTools追踪状态变化</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { exampleMixin, exampleStyles } from '../../utils/exampleMixin';

export default {
  name: 'StateManagementExample',
  mixins: [exampleMixin],
  data() {
    return {
      // 糟糕的状态管理示例
      badState: {
        user: null,
        products: [],
        cart: [],
        orders: []
      },
      
      // 优化的状态管理示例
      goodState: {
        user: {
          data: null,
          loading: false,
          error: null
        },
        products: {
          data: [],
          loading: false,
          error: null
        },
        cart: {
          items: [],
          total: 0
        }
      },
      
      // 响应式测试
      reactiveTest: {
        array: [],
        object: {},
        nested: {
          level1: {
            level2: {
              value: 0
            }
          }
        }
      },
      
      badStateCode: `// 糟糕的状态管理示例
export default {
  data() {
    return {
      user: null,
      products: [],
      cart: [],
      orders: [],
      // 问题1：状态分散，难以管理
      // 问题2：状态之间没有明确的关联关系
      // 问题3：状态更新逻辑分散在各个方法中
    };
  },
  methods: {
    addToCart(product) {
      // 问题4：直接修改状态，难以追踪变化
      this.cart.push(product);
      // 问题5：没有验证和错误处理
      this.updateTotal();
    },
    updateTotal() {
      // 问题6：计算逻辑重复，容易出错
      this.total = this.cart.reduce((sum, item) => sum + item.price, 0);
    },
    removeFromCart(index) {
      // 问题7：直接修改数组
      this.cart.splice(index, 1);
      this.updateTotal();
    }
  }
};`,
      
      reactiveCode: `// 响应式失效示例
export default {
  data() {
    return {
      array: [],
      object: {},
      nested: {
        level1: {
          level2: {
            value: 0
          }
        }
      }
    };
  },
  methods: {
    // 问题1：直接通过索引修改数组元素，不会触发响应式更新
    updateArrayByIndex() {
      this.array[0] = 'new value'; // ❌ 不会触发更新
    },
    
    // 问题2：直接设置数组长度，不会触发响应式更新
    updateArrayLength() {
      this.array.length = 0; // ❌ 不会触发更新
    },
    
    // 问题3：直接添加新属性，不会触发响应式更新
    addNewProperty() {
      this.object.newProp = 'new value'; // ❌ 不会触发更新
    },
    
    // 问题4：直接修改嵌套对象属性，可能不会触发响应式更新
    updateNestedValue() {
      this.nested.level1.level2.value = 1; // ❌ 可能不会触发更新
    }
  }
};`,
      
      pollutionCode: `// 状态污染示例
export default {
  data() {
    return {
      // 问题1：全局状态污染
      globalState: {
        currentUser: null,
        currentProject: null
      },
      
      // 问题2：组件间状态共享导致污染
      sharedState: {
        formData: {},
        validationErrors: {}
      }
    };
  },
  methods: {
    // 问题3：一个组件的状态变化影响其他组件
    updateFormData(data) {
      Object.assign(this.sharedState.formData, data);
      // 这个修改会影响所有使用sharedState的组件
    },
    
    // 问题4：状态清理不彻底
    resetForm() {
      this.sharedState.formData = {};
      // 但是validationErrors没有清理
      // 下次使用时会出现脏数据
    }
  }
};`,
      
      optimizedCode: `// 优化后的状态管理示例

// 1. 使用Vuex进行集中式状态管理
const store = new Vuex.Store({
  state: {
    user: {
      data: null,
      loading: false,
      error: null
    },
    products: {
      data: [],
      loading: false,
      error: null
    },
    cart: {
      items: [],
      total: 0
    }
  },
  mutations: {
    // 使用mutations确保状态变更可追踪
    ADD_TO_CART(state, product) {
      state.cart.items.push(product);
      state.cart.total = calculateTotal(state.cart.items);
    },
    REMOVE_FROM_CART(state, index) {
      state.cart.items.splice(index, 1);
      state.cart.total = calculateTotal(state.cart.items);
    },
    SET_USER(state, user) {
      state.user.data = user;
    }
  },
  actions: {
    // 使用actions处理异步操作
    async fetchUser({ commit }) {
      commit('SET_USER_LOADING', true);
      try {
        const user = await api.getUser();
        commit('SET_USER', user);
      } catch (error) {
        commit('SET_USER_ERROR', error);
      } finally {
        commit('SET_USER_LOADING', false);
      }
    }
  },
  getters: {
    // 使用getters计算派生状态
    cartTotal: state => state.cart.total,
    cartItemCount: state => state.cart.items.length
  }
});

// 2. 响应式修复
export default {
  methods: {
    // 修复1：使用Vue.set
    updateArrayByIndex() {
      this.$set(this.array, 0, 'new value'); // ✅ 会触发更新
    },
    
    // 修复2：使用splice
    updateArrayLength() {
      this.array.splice(0, this.array.length); // ✅ 会触发更新
    },
    
    // 修复3：使用Vue.set
    addNewProperty() {
      this.$set(this.object, 'newProp', 'new value'); // ✅ 会触发更新
    },
    
    // 修复4：使用Vue.set或深拷贝
    updateNestedValue() {
      this.$set(this.nested.level1.level2, 'value', 1); // ✅ 会触发更新
    }
  }
};

// 3. 状态隔离
export default {
  data() {
    return {
      // 每个组件都有自己的状态
      localState: {
        formData: {},
        validationErrors: {}
      }
    };
  },
  computed: {
    // 使用computed隔离计算逻辑
    isValid() {
      return Object.keys(this.localState.validationErrors).length === 0;
    }
  },
  methods: {
    resetForm() {
      // 彻底清理状态
      this.localState = {
        formData: {},
        validationErrors: {}
      };
    }
  }
};`,
      
      buttonTypes: exampleStyles.buttonTypes,
      resultStatus: exampleStyles.resultStatus,
      tabConfigs: {
        bad: { icon: '❌', label: '糟糕的状态管理' },
        reactive: { icon: '⚠️', label: '响应式失效' },
        pollution: { icon: '🔴', label: '状态污染' },
        optimized: { icon: '✅', label: '优化方案' }
      },
      activeTab: 'bad',
      result: null,
      consoleLogs: []
    };
  },
  methods: {
    async testBadStateManagement() {
      try {
        this.clearResult();
        this.log('开始测试糟糕的状态管理...');
        
        // 模拟糟糕的状态管理
        this.badState.user = { name: 'John', age: 30 };
        this.badState.products = Array(100).fill().map((_, i) => ({
          id: i,
          name: `Product ${i}`,
          price: Math.random() * 100
        }));
        
        // 直接修改状态，没有验证
        this.badState.cart.push(this.badState.products[0]);
        this.badState.cart.push(this.badState.products[1]);
        
        // 计算总价（重复计算逻辑）
        const total = this.badState.cart.reduce((sum, item) => sum + item.price, 0);
        
        this.result = {
          status: 'success',
          message: '糟糕的状态管理测试完成',
          stateSnapshot: {
            user: this.badState.user,
            cartCount: this.badState.cart.length,
            productsCount: this.badState.products.length,
            total: total.toFixed(2)
          },
          warning: '状态分散，难以管理和追踪',
          details: '状态更新逻辑分散，没有统一的状态管理'
        };
        
        this.log('糟糕的状态管理测试完成');
      } catch (error) {
        this.setErrorResult('操作失败', error.message);
        this.log('操作失败: ' + error.message, 'error');
      }
    },
    
    async testGoodStateManagement() {
      try {
        this.clearResult();
        this.log('开始测试优化的状态管理...');
        
        // 模拟优化的状态管理
        this.goodState.user.data = { name: 'John', age: 30 };
        this.goodState.user.loading = false;
        
        this.goodState.products.data = Array(100).fill().map((_, i) => ({
          id: i,
          name: `Product ${i}`,
          price: Math.random() * 100
        }));
        this.goodState.products.loading = false;
        
        // 使用统一的方法更新状态
        this.addToCart(this.goodState.products.data[0]);
        this.addToCart(this.goodState.products.data[1]);
        
        this.result = {
          status: 'success',
          message: '优化的状态管理测试完成',
          stateSnapshot: {
            user: this.goodState.user.data,
            cartCount: this.goodState.cart.items.length,
            productsCount: this.goodState.products.data.length,
            total: this.goodState.cart.total.toFixed(2)
          },
          info: '使用统一的状态管理方法，状态更新可追踪',
          details: '状态结构清晰，更新逻辑集中'
        };
        
        this.log('优化的状态管理测试完成');
      } catch (error) {
        this.setErrorResult('操作失败', error.message);
        this.log('操作失败: ' + error.message, 'error');
      }
    },
    
    async testReactiveFailure() {
      try {
        this.clearResult();
        this.log('开始测试响应式失效...');
        
        // 测试响应式失效
        this.reactiveTest.array = [1, 2, 3];
        this.reactiveTest.object = { name: 'test' };
        
        // 直接修改数组索引（不会触发响应式）
        this.reactiveTest.array[0] = 999;
        
        // 直接添加新属性（不会触发响应式）
        this.reactiveTest.object.newProp = 'new value';
        
        // 修改嵌套对象属性（可能不会触发响应式）
        this.reactiveTest.nested.level1.level2.value = 100;
        
        this.result = {
          status: 'success',
          message: '响应式失效测试完成',
          stateSnapshot: {
            array: this.reactiveTest.array,
            object: this.reactiveTest.object,
            nestedValue: this.reactiveTest.nested.level1.level2.value
          },
          warning: '某些操作不会触发响应式更新',
          details: '直接通过索引修改数组、直接添加新属性等操作不会触发响应式'
        };
        
        this.log('响应式失效测试完成');
      } catch (error) {
        this.setErrorResult('操作失败', error.message);
        this.log('操作失败: ' + error.message, 'error');
      }
    },
    
    async testReactiveFix() {
      try {
        this.clearResult();
        this.log('开始测试响应式修复...');
        
        // 测试响应式修复
        this.reactiveTest.array = [1, 2, 3];
        this.reactiveTest.object = { name: 'test' };
        
        // 使用$set修复响应式
        this.$set(this.reactiveTest.array, 0, 999);
        
        // 使用$set添加新属性
        this.$set(this.reactiveTest.object, 'newProp', 'new value');
        
        // 使用$set修改嵌套对象
        this.$set(this.reactiveTest.nested.level1.level2, 'value', 100);
        
        this.result = {
          status: 'success',
          message: '响应式修复测试完成',
          stateSnapshot: {
            array: this.reactiveTest.array,
            object: this.reactiveTest.object,
            nestedValue: this.reactiveTest.nested.level1.level2.value
          },
          info: '使用$set方法确保响应式更新',
          details: '所有修改都会触发响应式更新'
        };
        
        this.log('响应式修复测试完成');
      } catch (error) {
        this.setErrorResult('操作失败', error.message);
        this.log('操作失败: ' + error.message, 'error');
      }
    },
    
    async testStatePollution() {
      try {
        this.clearResult();
        this.log('开始测试状态污染...');
        
        // 模拟状态污染
        const pollutedState = {
          formData: {
            name: 'John',
            email: 'john@example.com'
          },
          validationErrors: {
            name: 'Name is required'
          }
        };
        
        // 模拟一个组件修改状态
        pollutedState.formData.name = 'Jane';
        pollutedState.formData.age = 25;
        
        // 模拟另一个组件使用状态，但出现了脏数据
        const dirtyData = { ...pollutedState.formData };
        
        this.result = {
          status: 'success',
          message: '状态污染测试完成',
          stateSnapshot: {
            formData: pollutedState.formData,
            dirtyData: dirtyData
          },
          warning: '状态被多个组件共享，容易出现污染',
          details: '一个组件的状态修改会影响其他组件，导致脏数据'
        };
        
        this.log('状态污染测试完成');
      } catch (error) {
        this.setErrorResult('操作失败', error.message);
        this.log('操作失败: ' + error.message, 'error');
      }
    },
    
    async testStateIsolation() {
      try {
        this.clearResult();
        this.log('开始测试状态隔离...');
        
        // 模拟状态隔离
        const componentA = {
          localState: {
            formData: {
              name: 'John',
              email: 'john@example.com'
            },
            validationErrors: {}
          }
        };
        
        const componentB = {
          localState: {
            formData: {
              name: 'Jane',
              email: 'jane@example.com'
            },
            validationErrors: {}
          }
        };
        
        // 组件A修改自己的状态
        componentA.localState.formData.age = 25;
        
        // 组件B的状态不受影响
        const isolatedData = { ...componentB.localState.formData };
        
        this.result = {
          status: 'success',
          message: '状态隔离测试完成',
          stateSnapshot: {
            componentA: componentA.localState.formData,
            componentB: componentB.localState.formData,
            isolatedData: isolatedData
          },
          info: '每个组件都有自己的状态，相互隔离',
          details: '组件A的修改不会影响组件B的状态'
        };
        
        this.log('状态隔离测试完成');
      } catch (error) {
        this.setErrorResult('操作失败', error.message);
        this.log('操作失败: ' + error.message, 'error');
      }
    },
    
    addToCart(product) {
      this.goodState.cart.items.push(product);
      this.goodState.cart.total = this.goodState.cart.items.reduce(
        (sum, item) => sum + item.price, 0
      );
    },
    
    switchTab(tab) {
      this.activeTab = tab;
    },
    
    clearConsole() {
      this.consoleLogs = [];
    },
    
    log(message) {
      this.consoleLogs.push(`[${new Date().toLocaleTimeString()}] ${message}`);
    },
    
    clearResult() {
      this.result = null;
    },
    
    setErrorResult(message, error) {
      this.result = {
        status: 'error',
        message: message,
        error: error
      };
    },
    
    goBackToJSExamples() {
      this.$router.push('/js-examples');
    }
  }
}
</script>

<style scoped>
/* 只保留组件特有的样式，通用样式已移至 common.css */
.state-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.demo-buttons button.disabled {
  background-color: #ccc !important;
  cursor: not-allowed !important;
  transform: none !important;
  box-shadow: none !important;
}

.console {
  background-color: #1e1e1e;
  color: #d4d4d4;
  padding: 15px;
  border-radius: 4px;
  font-family: 'Courier New', monospace;
  font-size: 14px;
  max-height: 300px;
  overflow-y: auto;
}

.log-item {
  margin: 5px 0;
  padding: 2px 0;
  border-bottom: 1px solid #333;
}

.result-item pre {
  background-color: #f5f5f5;
  padding: 10px;
  border-radius: 4px;
  overflow-x: auto;
  font-size: 12px;
}
</style>