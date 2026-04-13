<template>
  <div class="async-container">
    <div class="header">
      <button class="back-btn" @click="goBackToJSExamples">
        <i class="back-icon">🏠</i>
        <span>返回案例列表</span>
      </button>
      <h1>第1期：异步操作陷阱</h1>
    </div>

    <div class="case-description">
      <h2>问题描述</h2>
      <p>在处理多个异步操作时，容易出现回调地狱、Promise 链使用不当、并行操作串行化等问题，导致代码难以维护和性能下降。</p>
    </div>

    <div class="case-content">
      <div class="demo-section">
        <h2>演示</h2>

        <div class="demo-buttons">
          <button @click="testCallbackHell" :class="buttonTypes.danger.class">
            测试回调地狱
          </button>
          <button @click="testBadPromiseChain" :class="buttonTypes.danger.class">
            测试 Promise 链错误
          </button>
          <button @click="testSequentialParallel" :class="buttonTypes.danger.class">
            测试串行并行
          </button>
          <button @click="testPromiseChain" :class="buttonTypes.success.class">
            测试 Promise 链正确
          </button>
          <button @click="testAsyncAwait" :class="buttonTypes.success.class">
            测试 Async/Await
          </button>
          <button @click="testParallelOperation" :class="buttonTypes.success.class">
            测试并行操作
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
            <div class="result-item" v-if="result.time">
              <strong>执行时间：</strong>{{ result.time }}ms
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

          <div class="code-content" v-show="activeTab === 'error'">
            <pre><code v-html="highlightCode(errorCode)"></code></pre>
          </div>

          <div class="code-content" v-show="activeTab === 'fixed'">
            <pre><code v-html="highlightCode(fixedCode)"></code></pre>
          </div>
        </div>
      </div>

      <div class="solution-section">
        <h2>解决方案</h2>
        <ul>
          <li><strong>使用 Promise 链：</strong>替代嵌套回调</li>
          <li><strong>使用 async/await：</strong>使异步代码更简洁</li>
          <li><strong>并行操作：</strong>使用 Promise.all 提高性能</li>
          <li><strong>正确处理错误：</strong>使用 try/catch 或 Promise.catch</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import api from '../../api/api';
import { exampleMixin, exampleStyles, performanceMonitor } from '../../utils/exampleMixin';

export default {
  name: 'AsyncExample',
  mixins: [exampleMixin],
  data() {
    return {
      errorCode: `// 1. 回调地狱
function fetchUserData(userId, callback) {
  setTimeout(() => {
    callback({ id: userId, name: 'User' + userId });
  }, 1000);
}

function fetchUserPosts(userId, callback) {
  setTimeout(() => {
    callback([{ id: 1, title: 'Post 1' }, { id: 2, title: 'Post 2' }]);
  }, 1000);
}

function fetchPostComments(postId, callback) {
  setTimeout(() => {
    callback([{ id: 1, content: 'Comment 1' }, { id: 2, content: 'Comment 2' }]);
  }, 1000);
}

// 回调地狱
fetchUserData(1, (user) => {
  console.log('User:', user);
  fetchUserPosts(user.id, (posts) => {
    console.log('Posts:', posts);
    fetchPostComments(posts[0].id, (comments) => {
      console.log('Comments:', comments);
    });
  });
});

// 2. Promise 链错误使用
function fetchData() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve('Data');
    }, 1000);
  });
}

// 错误：没有返回 Promise
fetchData()
  .then(data => {
    console.log(data);
    // 没有 return，导致后续 then 接收 undefined
  })
  .then(result => {
    console.log('Result:', result); // 输出 undefined
  });

// 3. 串行执行并行操作
async function sequentialOperations() {
  const data1 = await fetchData();
  const data2 = await fetchData();
  const data3 = await fetchData();
  console.log('Total time:', 3000); // 实际耗时约 3000ms
}`,
      fixedCode: `// 1. 使用 Promise 链
function fetchUserData(userId) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({ id: userId, name: 'User' + userId });
    }, 1000);
  });
}

function fetchUserPosts(userId) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve([{ id: 1, title: 'Post 1' }, { id: 2, title: 'Post 2' }]);
    }, 1000);
  });
}

function fetchPostComments(postId) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve([{ id: 1, content: 'Comment 1' }, { id: 2, content: 'Comment 2' }]);
    }, 1000);
  });
}

// 使用 Promise 链
fetchUserData(1)
  .then(user => {
    console.log('User:', user);
    return fetchUserPosts(user.id);
  })
  .then(posts => {
    console.log('Posts:', posts);
    return fetchPostComments(posts[0].id);
  })
  .then(comments => {
    console.log('Comments:', comments);
  })
  .catch(error => {
    console.error('Error:', error);
  });

// 2. 正确使用 Promise 链
function fetchData() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve('Data');
    }, 1000);
  });
}

// 正确：返回 Promise
fetchData()
  .then(data => {
    console.log(data);
    return data + ' processed'; // 返回值会传递给下一个 then
  })
  .then(result => {
    console.log('Result:', result); // 输出 "Data processed"
  });

// 3. 并行执行操作
async function parallelOperations() {
  const [data1, data2, data3] = await Promise.all([
    fetchData(),
    fetchData(),
    fetchData()
  ]);
  console.log('Total time:', 1000); // 实际耗时约 1000ms
}

// 4. 使用 async/await
async function asyncAwaitExample() {
  try {
    const user = await fetchUserData(1);
    const posts = await fetchUserPosts(user.id);
    const comments = await fetchPostComments(posts[0].id);
    console.log('User:', user);
    console.log('Posts:', posts);
    console.log('Comments:', comments);
  } catch (error) {
    console.error('Error:', error);
  }
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
    async testCallbackHell() {
      try {
        this.clearResult();
        this.clearConsole();
        this.log('开始测试回调地狱...');
        
        performanceMonitor.start('callbackHell');
        
        // 模拟回调地狱
        const result = await new Promise((resolve) => {
          const startTime = Date.now();
          
          function fetchUserData(userId, callback) {
            setTimeout(() => {
              callback({ id: userId, name: 'User' + userId });
            }, 300);
          }
          
          function fetchUserPosts(userId, callback) {
            setTimeout(() => {
              callback([{ id: 1, title: 'Post 1' }, { id: 2, title: 'Post 2' }]);
            }, 300);
          }
          
          function fetchPostComments(postId, callback) {
            setTimeout(() => {
              callback([{ id: 1, content: 'Comment 1' }, { id: 2, content: 'Comment 2' }]);
            }, 300);
          }
          
          // 回调地狱
          fetchUserData(1, (user) => {
            this.log('User:', user);
            fetchUserPosts(user.id, (posts) => {
              this.log('Posts:', posts);
              fetchPostComments(posts[0].id, (comments) => {
                this.log('Comments:', comments);
                resolve({
                  status: 'success',
                  message: '回调地狱测试完成',
                  time: Date.now() - startTime
                });
              });
            });
          });
        });
        
        const duration = performanceMonitor.end('callbackHell');
        
        this.result = {
          ...result,
          time: Math.round(duration)
        };
        this.log('回调地狱测试完成', result.status);
        this.log(`执行时间: ${duration.toFixed(2)}ms`);
      } catch (error) {
        this.setErrorResult('操作失败', error.message);
        this.log('操作失败: ' + error.message, 'error');
      }
    },

    async testBadPromiseChain() {
      try {
        this.clearResult();
        this.clearConsole();
        this.log('开始测试 Promise 链错误...');
        
        performanceMonitor.start('badPromiseChain');
        
        // 模拟 Promise 链错误
        const result = await new Promise((resolve) => {
          const startTime = Date.now();
          
          function fetchData() {
            return new Promise((resolve) => {
              setTimeout(() => {
                resolve('Data');
              }, 300);
            });
          }
          
          // 错误：没有返回 Promise
          fetchData()
            .then(data => {
              this.log('Data:', data);
              // 没有 return，导致后续 then 接收 undefined
            })
            .then(result => {
              this.log('Result:', result); // 输出 undefined
              resolve({
                status: 'success',
                message: 'Promise 链错误测试完成',
                time: Date.now() - startTime
              });
            });
        });
        
        const duration = performanceMonitor.end('badPromiseChain');
        
        this.result = {
          ...result,
          time: Math.round(duration)
        };
        this.log('Promise 链错误测试完成', result.status);
        this.log(`执行时间: ${duration.toFixed(2)}ms`);
      } catch (error) {
        this.setErrorResult('操作失败', error.message);
        this.log('操作失败: ' + error.message, 'error');
      }
    },

    async testSequentialParallel() {
      try {
        this.clearResult();
        this.clearConsole();
        this.log('开始测试串行并行...');
        
        performanceMonitor.start('sequentialParallel');
        
        // 模拟串行执行
        const result = await new Promise((resolve) => {
          const startTime = Date.now();
          
          function fetchData() {
            return new Promise((resolve) => {
              setTimeout(() => {
                resolve('Data');
              }, 300);
            });
          }
          
          async function sequentialOperations() {
            const data1 = await fetchData();
            this.log('Data 1:', data1);
            const data2 = await fetchData();
            this.log('Data 2:', data2);
            const data3 = await fetchData();
            this.log('Data 3:', data3);
            resolve({
              status: 'success',
              message: '串行执行测试完成',
              time: Date.now() - startTime
            });
          }
          
          sequentialOperations.bind(this)();
        });
        
        const duration = performanceMonitor.end('sequentialParallel');
        
        this.result = {
          ...result,
          time: Math.round(duration)
        };
        this.log('串行并行测试完成', result.status);
        this.log(`执行时间: ${duration.toFixed(2)}ms`);
      } catch (error) {
        this.setErrorResult('操作失败', error.message);
        this.log('操作失败: ' + error.message, 'error');
      }
    },

    async testPromiseChain() {
      try {
        this.clearResult();
        this.clearConsole();
        this.log('开始测试 Promise 链正确...');
        
        performanceMonitor.start('promiseChain');
        
        // 模拟正确的 Promise 链
        const result = await new Promise((resolve) => {
          const startTime = Date.now();
          
          function fetchData() {
            return new Promise((resolve) => {
              setTimeout(() => {
                resolve('Data');
              }, 300);
            });
          }
          
          // 正确：返回 Promise
          fetchData()
            .then(data => {
              this.log('Data:', data);
              return data + ' processed'; // 返回值会传递给下一个 then
            })
            .then(result => {
              this.log('Result:', result); // 输出 "Data processed"
              resolve({
                status: 'success',
                message: 'Promise 链正确测试完成',
                time: Date.now() - startTime
              });
            });
        });
        
        const duration = performanceMonitor.end('promiseChain');
        
        this.result = {
          ...result,
          time: Math.round(duration)
        };
        this.log('Promise 链正确测试完成', result.status);
        this.log(`执行时间: ${duration.toFixed(2)}ms`);
      } catch (error) {
        this.setErrorResult('操作失败', error.message);
        this.log('操作失败: ' + error.message, 'error');
      }
    },

    async testAsyncAwait() {
      try {
        this.clearResult();
        this.clearConsole();
        this.log('开始测试 Async/Await...');
        
        performanceMonitor.start('asyncAwait');
        
        // 模拟 Async/Await
        const result = await new Promise((resolve) => {
          const startTime = Date.now();
          
          function fetchData() {
            return new Promise((resolve) => {
              setTimeout(() => {
                resolve('Data');
              }, 300);
            });
          }
          
          async function asyncAwaitExample() {
            try {
              const data1 = await fetchData();
              this.log('Data 1:', data1);
              const data2 = await fetchData();
              this.log('Data 2:', data2);
              const data3 = await fetchData();
              this.log('Data 3:', data3);
              resolve({
                status: 'success',
                message: 'Async/Await 测试完成',
                time: Date.now() - startTime
              });
            } catch (error) {
              this.log('Error:', error);
              resolve({
                status: 'error',
                message: 'Async/Await 测试失败',
                time: Date.now() - startTime
              });
            }
          }
          
          asyncAwaitExample.bind(this)();
        });
        
        const duration = performanceMonitor.end('asyncAwait');
        
        this.result = {
          ...result,
          time: Math.round(duration)
        };
        this.log('Async/Await 测试完成', result.status);
        this.log(`执行时间: ${duration.toFixed(2)}ms`);
      } catch (error) {
        this.setErrorResult('操作失败', error.message);
        this.log('操作失败: ' + error.message, 'error');
      }
    },

    async testParallelOperation() {
      try {
        this.clearResult();
        this.clearConsole();
        this.log('开始测试并行操作...');
        
        performanceMonitor.start('parallelOperation');
        
        // 模拟并行操作
        const result = await new Promise((resolve) => {
          const startTime = Date.now();
          
          function fetchData() {
            return new Promise((resolve) => {
              setTimeout(() => {
                resolve('Data');
              }, 300);
            });
          }
          
          async function parallelOperations() {
            const [data1, data2, data3] = await Promise.all([
              fetchData(),
              fetchData(),
              fetchData()
            ]);
            this.log('Data 1:', data1);
            this.log('Data 2:', data2);
            this.log('Data 3:', data3);
            resolve({
              status: 'success',
              message: '并行操作测试完成',
              time: Date.now() - startTime
            });
          }
          
          parallelOperations.bind(this)();
        });
        
        const duration = performanceMonitor.end('parallelOperation');
        
        this.result = {
          ...result,
          time: Math.round(duration)
        };
        this.log('并行操作测试完成', result.status);
        this.log(`执行时间: ${duration.toFixed(2)}ms`);
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
.async-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}
</style>