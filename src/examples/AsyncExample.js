/**
 * 第1期：异步操作陷阱 - 回调地狱与Promise使用不当
 * 问题：在处理多个异步操作时，容易出现回调地狱和Promise链使用不当的问题
 */

// 错误代码
export const badAsyncExample = {
  // 回调地狱
  callbackHell: function() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log('Step 1');
        setTimeout(() => {
          console.log('Step 2');
          setTimeout(() => {
            console.log('Step 3');
            setTimeout(() => {
              console.log('Step 4');
              resolve('Callback hell completed');
            }, 1000);
          }, 1000);
        }, 1000);
      }, 1000);
    });
  },

  // Promise 链使用不当
  badPromiseChain: function() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log('Async operation 1');
        resolve('Result 1');
      }, 1000);
    })
    .then(result => {
      console.log('Result 1:', result);
      // 错误：没有 return Promise
      setTimeout(() => {
        console.log('Async operation 2');
        return 'Result 2'; // 这个返回值不会被传递
      }, 1000);
    })
    .then(result => {
      console.log('Result 2:', result); // 这里会是 undefined
      return 'Final result';
    });
  },

  // 并行操作串行化
  sequentialParallel: function() {
    const promises = [
      new Promise(resolve => setTimeout(() => resolve('A'), 1000)),
      new Promise(resolve => setTimeout(() => resolve('B'), 1000)),
      new Promise(resolve => setTimeout(() => resolve('C'), 1000))
    ];

    // 错误：串行执行，总时间 3 秒
    return promises[0]
      .then(result => {
        console.log('Result A:', result);
        return promises[1];
      })
      .then(result => {
        console.log('Result B:', result);
        return promises[2];
      })
      .then(result => {
        console.log('Result C:', result);
        return 'Sequential completed';
      });
  }
};

// 正确代码
export const goodAsyncExample = {
  // 使用 Promise 链
  promiseChain: function() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log('Step 1');
        resolve('Step 1 completed');
      }, 1000);
    })
    .then(result => {
      console.log('Result 1:', result);
      return new Promise(resolve => {
        setTimeout(() => {
          console.log('Step 2');
          resolve('Step 2 completed');
        }, 1000);
      });
    })
    .then(result => {
      console.log('Result 2:', result);
      return new Promise(resolve => {
        setTimeout(() => {
          console.log('Step 3');
          resolve('Step 3 completed');
        }, 1000);
      });
    })
    .then(result => {
      console.log('Result 3:', result);
      return 'Promise chain completed';
    });
  },

  // 使用 async/await
  asyncAwait: async function() {
    console.log('Starting async/await example');
    
    await new Promise(resolve => setTimeout(() => {
      console.log('Step 1');
      resolve();
    }, 1000));
    
    await new Promise(resolve => setTimeout(() => {
      console.log('Step 2');
      resolve();
    }, 1000));
    
    await new Promise(resolve => setTimeout(() => {
      console.log('Step 3');
      resolve();
    }, 1000));
    
    console.log('Async/await completed');
    return 'Async/await completed';
  },

  // 并行操作
  parallelOperation: function() {
    const promises = [
      new Promise(resolve => setTimeout(() => resolve('A'), 1000)),
      new Promise(resolve => setTimeout(() => resolve('B'), 1000)),
      new Promise(resolve => setTimeout(() => resolve('C'), 1000))
    ];

    // 正确：并行执行，总时间 1 秒
    return Promise.all(promises)
      .then(results => {
        console.log('All results:', results);
        return 'Parallel completed';
      });
  },

  // 错误处理
  errorHandling: async function() {
    try {
      const result1 = await new Promise((resolve, reject) => {
        setTimeout(() => {
          reject(new Error('Operation failed'));
        }, 1000);
      });
      console.log('Result 1:', result1);
    } catch (error) {
      console.error('Error caught:', error.message);
    }
    
    return 'Error handling completed';
  }
};