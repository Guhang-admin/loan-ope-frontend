/**
 * 第2期：内存泄漏 - 闭包和事件监听器导致的内存泄漏
 * 问题：JavaScript 中常见的内存泄漏原因
 */

// 错误代码
export const badMemoryLeakExample = {
  // 闭包导致的内存泄漏
  closureLeak: function() {
    const largeData = new Array(1000000).fill('data'); // 大数组
    
    // 错误：内部函数引用了外部变量，导致外部变量无法被垃圾回收
    function innerFunction() {
      // 即使不使用 largeData，闭包仍然会持有引用
      console.log('Inner function called');
    }
    
    return innerFunction;
  },

  // 事件监听器未清理
  eventListenerLeak: function() {
    const element = document.createElement('div');
    document.body.appendChild(element);
    
    // 错误：添加监听器但未移除
    element.addEventListener('click', function() {
      console.log('Element clicked');
    });
    
    // 即使移除元素，监听器仍然存在
    document.body.removeChild(element);
    
    return 'Event listener added but not removed';
  },

  // 定时器未清理
  timerLeak: function() {
    let count = 0;
    
    // 错误：设置定时器但未清除
    setInterval(function() {
      count++;
      console.log('Timer tick:', count);
    }, 1000);
    
    return 'Timer set but not cleared';
  },

  // 全局变量累积
  globalVariableLeak: function() {
    // 错误：全局变量无限增长
    if (!window.leakArray) {
      window.leakArray = [];
    }
    
    for (let i = 0; i < 1000; i++) {
      window.leakArray.push(new Array(1000).fill('leak'));
    }
    
    return `Global array size: ${window.leakArray.length}`;
  }
};

// 正确代码
export const goodMemoryLeakExample = {
  // 避免闭包泄漏
  avoidClosureLeak: function() {
    {
      const largeData = new Array(1000000).fill('data');
      console.log('Large data created');
    } // largeData 超出作用域
    
    function innerFunction() {
      console.log('Inner function called');
    }
    
    return innerFunction;
  },

  // 正确管理事件监听器
  properEventListener: function() {
    const element = document.createElement('div');
    document.body.appendChild(element);
    
    function handleClick() {
      console.log('Element clicked');
    }
    
    element.addEventListener('click', handleClick);
    
    // 正确：移除监听器
    element.removeEventListener('click', handleClick);
    document.body.removeChild(element);
    
    return 'Event listener properly managed';
  },

  // 正确管理定时器
  properTimer: function() {
    let count = 0;
    const timerId = setInterval(function() {
      count++;
      console.log('Timer tick:', count);
      
      if (count >= 5) {
        clearInterval(timerId); // 正确：清除定时器
        console.log('Timer cleared');
      }
    }, 1000);
    
    return 'Timer properly managed';
  },

  // 避免全局变量泄漏
  avoidGlobalLeak: function() {
    // 正确：使用局部变量
    let localArray = [];
    for (let i = 0; i < 1000; i++) {
      localArray.push(new Array(1000).fill('temp'));
    }
    
    // 手动释放
    localArray = null;
    
    return 'Local array properly managed';
  },

  // 使用 WeakMap 避免内存泄漏
  weakMapExample: function() {
    const weakMap = new WeakMap();
    const element = document.createElement('div');
    
    // 存储弱引用
    weakMap.set(element, { data: 'some data' });
    
    console.log('WeakMap size:', weakMap.has(element));
    
    // 当 element 被垃圾回收时，WeakMap 中的条目也会被自动清理
    element = null;
    
    return 'WeakMap used to avoid memory leak';
  }
};