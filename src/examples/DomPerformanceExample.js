/**
 * 第3期：DOM 操作性能 - 频繁操作 DOM 导致的性能问题
 * 问题：频繁的 DOM 操作会导致重排和重绘，影响页面性能
 */

// 错误代码
export const badDomExample = {
  // 频繁操作 DOM
  frequentDomOperations: function() {
    const start = performance.now();
    
    const container = document.createElement('div');
    container.id = 'bad-container';
    document.body.appendChild(container);
    
    // 错误：每次循环都操作 DOM
    for (let i = 0; i < 1000; i++) {
      const element = document.createElement('div');
      element.textContent = `Item ${i}`;
      container.appendChild(element); // 每次都触发重排
    }
    
    const end = performance.now();
    console.log('Frequent DOM operations time:', end - start);
    
    return `Frequent DOM operations took ${end - start}ms`;
  },

  // 频繁读取布局属性
  frequentLayoutReads: function() {
    const start = performance.now();
    
    const container = document.createElement('div');
    container.id = 'layout-container';
    document.body.appendChild(container);
    
    for (let i = 0; i < 1000; i++) {
      const element = document.createElement('div');
      element.textContent = `Item ${i}`;
      container.appendChild(element);
      
      // 错误：每次都读取布局属性，触发强制同步布局
      const height = element.offsetHeight;
      console.log('Element height:', height);
    }
    
    const end = performance.now();
    console.log('Frequent layout reads time:', end - start);
    
    return `Frequent layout reads took ${end - start}ms`;
  },

  // 未使用事件委托
  noEventDelegation: function() {
    const container = document.createElement('ul');
    container.id = 'no-delegation';
    document.body.appendChild(container);
    
    // 错误：为每个元素添加事件监听器
    for (let i = 0; i < 100; i++) {
      const li = document.createElement('li');
      li.textContent = `Item ${i}`;
      li.addEventListener('click', function() {
        console.log('Item clicked:', i);
      });
      container.appendChild(li);
    }
    
    return 'No event delegation - 100 event listeners added';
  },

  // 直接修改 style
  directStyleModification: function() {
    const start = performance.now();
    
    const container = document.createElement('div');
    container.id = 'style-container';
    document.body.appendChild(container);
    
    for (let i = 0; i < 1000; i++) {
      const element = document.createElement('div');
      // 错误：直接修改 style，触发重绘
      element.style.width = '100px';
      element.style.height = '100px';
      element.style.backgroundColor = 'red';
      element.style.margin = '10px';
      element.textContent = `Item ${i}`;
      container.appendChild(element);
    }
    
    const end = performance.now();
    console.log('Direct style modification time:', end - start);
    
    return `Direct style modification took ${end - start}ms`;
  }
};

// 正确代码
export const goodDomExample = {
  // 使用文档片段
  useDocumentFragment: function() {
    const start = performance.now();
    
    const container = document.createElement('div');
    container.id = 'good-container';
    document.body.appendChild(container);
    
    // 正确：使用文档片段，减少 DOM 操作次数
    const fragment = document.createDocumentFragment();
    for (let i = 0; i < 1000; i++) {
      const element = document.createElement('div');
      element.textContent = `Item ${i}`;
      fragment.appendChild(element); // 先添加到片段
    }
    
    container.appendChild(fragment); // 一次性添加到 DOM
    
    const end = performance.now();
    console.log('Document fragment time:', end - start);
    
    return `Document fragment took ${end - start}ms`;
  },

  // 批量读写布局属性
  batchLayoutOperations: function() {
    const start = performance.now();
    
    const container = document.createElement('div');
    container.id = 'batch-container';
    document.body.appendChild(container);
    
    // 正确：先批量写入
    for (let i = 0; i < 1000; i++) {
      const element = document.createElement('div');
      element.textContent = `Item ${i}`;
      container.appendChild(element);
    }
    
    // 再批量读取
    const elements = container.querySelectorAll('div');
    elements.forEach((element, index) => {
      const height = element.offsetHeight;
      console.log('Element', index, 'height:', height);
    });
    
    const end = performance.now();
    console.log('Batch layout operations time:', end - start);
    
    return `Batch layout operations took ${end - start}ms`;
  },

  // 使用事件委托
  useEventDelegation: function() {
    const container = document.createElement('ul');
    container.id = 'with-delegation';
    document.body.appendChild(container);
    
    // 正确：使用事件委托，只添加一个监听器
    for (let i = 0; i < 100; i++) {
      const li = document.createElement('li');
      li.textContent = `Item ${i}`;
      li.dataset.index = i;
      container.appendChild(li);
    }
    
    container.addEventListener('click', function(event) {
      if (event.target.tagName === 'LI') {
        const index = event.target.dataset.index;
        console.log('Item clicked:', index);
      }
    });
    
    return 'Event delegation - only 1 event listener added';
  },

  // 使用 CSS 类
  useCssClasses: function() {
    const start = performance.now();
    
    // 先添加样式
    const style = document.createElement('style');
    style.textContent = `
      .item {
        width: 100px;
        height: 100px;
        background-color: blue;
        margin: 10px;
      }
    `;
    document.head.appendChild(style);
    
    const container = document.createElement('div');
    container.id = 'css-container';
    document.body.appendChild(container);
    
    // 正确：使用 CSS 类，减少样式操作
    for (let i = 0; i < 1000; i++) {
      const element = document.createElement('div');
      element.className = 'item'; // 使用 CSS 类
      element.textContent = `Item ${i}`;
      container.appendChild(element);
    }
    
    const end = performance.now();
    console.log('CSS classes time:', end - start);
    
    return `CSS classes took ${end - start}ms`;
  },

  // 使用 requestAnimationFrame
  useRequestAnimationFrame: function() {
    let count = 0;
    const maxCount = 100;
    
    function update() {
      if (count < maxCount) {
        const element = document.createElement('div');
        element.textContent = `Animated item ${count}`;
        document.body.appendChild(element);
        count++;
        requestAnimationFrame(update);
      }
    }
    
    requestAnimationFrame(update);
    return 'Using requestAnimationFrame for smooth updates';
  }
};