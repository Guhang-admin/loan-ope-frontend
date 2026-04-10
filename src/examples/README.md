# JavaScript 前端案例

## 概述

本目录包含 JavaScript 前端进阶实战案例，用于演示常见的前端问题和解决方案。

## 案例列表

### 1. AsyncExample.js - 异步操作陷阱

**问题描述**：
- 回调地狱：多层嵌套回调函数，代码难以阅读和维护
- Promise 链使用不当：没有正确返回 Promise，导致链式调用失败
- 并行操作串行化：多个独立的异步操作被串行执行，浪费时间
- 错误处理不当：异常没有被正确捕获和处理

**包含内容**：
- `badAsyncExample`：错误实现示例
- `goodAsyncExample`：正确实现示例

**相关页面**：`../views/js-examples/Async.vue`
**相关课件**：`../../文档/JS课件/第1期_异步操作陷阱_课件.md`

---

### 2. MemoryLeakExample.js - 内存泄漏问题

**问题描述**：
- 闭包持有外部变量引用，导致变量无法被垃圾回收
- 事件监听器未清理，即使元素被移除
- 定时器未清理，持续运行
- 全局变量累积，无限增长
- DOM 引用未释放，导致元素无法被回收

**包含内容**：
- `badMemoryLeakExample`：错误实现示例
- `goodMemoryLeakExample`：正确实现示例

**相关页面**：`../views/js-examples/MemoryLeak.vue`
**相关课件**：`../../文档/JS课件/第2期_内存泄漏问题_课件.md`

---

### 3. DomPerformanceExample.js - DOM 操作性能

**问题描述**：
- 频繁操作 DOM，每次都触发重排和重绘
- 频繁读取布局属性，导致强制同步布局（Layout Thrashing）
- 未使用事件委托，为每个元素添加事件监听器
- 直接修改 style，触发多次重绘
- 大量 DOM 节点的创建和插入

**包含内容**：
- `badDomExample`：错误实现示例
- `goodDomExample`：正确实现示例

**相关页面**：`../views/js-examples/Dom.vue`
**相关课件**：`../../文档/JS课件/第3期_DOM操作性能_课件.md`

---

### 4. SecurityExample.js - 安全问题

**问题描述**：
- XSS（跨站脚本攻击）：攻击者在页面中注入恶意脚本
- CSRF（跨站请求伪造）：攻击者诱导用户执行非预期的操作
- 敏感数据暴露：在前端存储或传输敏感信息
- 开放重定向：未验证的重定向 URL
- 内容安全策略（CSP）配置不当

**包含内容**：
- `badSecurityExample`：错误实现示例
- `goodSecurityExample`：正确实现示例

**相关页面**：`../views/js-examples/Security.vue`
**相关课件**：`../../文档/JS课件/第4期_安全问题_课件.md`

## 如何使用

### 1. 在代码中导入

```javascript
import { badAsyncExample, goodAsyncExample } from './AsyncExample';
import { badMemoryLeakExample, goodMemoryLeakExample } from './MemoryLeakExample';
import { badDomExample, goodDomExample } from './DomPerformanceExample';
import { badSecurityExample, goodSecurityExample } from './SecurityExample';
```

### 2. 调用示例方法

```javascript
// 测试异步操作陷阱
badAsyncExample.callbackHell().then(result => {
  console.log(result);
});

goodAsyncExample.asyncAwait().then(result => {
  console.log(result);
});

// 测试内存泄漏
badMemoryLeakExample.closureLeak();

goodMemoryLeakExample.avoidClosureLeak();

// 测试 DOM 操作性能
badDomExample.frequentDomOperations();

goodDomExample.useDocumentFragment();

// 测试安全问题
badSecurityExample.xssVulnerability();

goodSecurityExample.preventXSS();
```

### 3. 在页面中使用

每个案例都有对应的 Vue 页面，可以在页面中直接运行和测试：

- 访问 `/js-examples` 查看所有案例
- 访问 `/js-examples/async` 测试异步操作陷阱
- 访问 `/js-examples/memoryleak` 测试内存泄漏问题
- 访问 `/js-examples/dom` 测试 DOM 操作性能
- 访问 `/js-examples/security` 测试安全问题

## 最佳实践

### 异步编程

```javascript
// ✅ 推荐：使用 async/await
async function fetchData() {
  try {
    const result = await fetch('/api/data');
    const data = await result.json();
    return data;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

// ❌ 不推荐：回调地狱
function badExample() {
  fetch('/api/data', function(response) {
    response.json(function(data) {
      processData(data, function(result) {
        console.log(result);
      });
    });
  });
}
```

### 内存管理

```javascript
// ✅ 推荐：正确管理事件监听器
class Component {
  constructor(element) {
    this.element = element;
    this.handleClick = this.handleClick.bind(this);
    this.element.addEventListener('click', this.handleClick);
  }
  
  destroy() {
    this.element.removeEventListener('click', this.handleClick);
    this.element = null;
  }
}

// ❌ 不推荐：未清理监听器
function badExample() {
  const element = document.getElementById('btn');
  element.addEventListener('click', function() {
    console.log('Clicked');
  });
  // 没有移除监听器
}
```

### DOM 操作

```javascript
// ✅ 推荐：使用文档片段
function createManyElements() {
  const fragment = document.createDocumentFragment();
  for (let i = 0; i < 1000; i++) {
    const element = document.createElement('div');
    fragment.appendChild(element);
  }
  container.appendChild(fragment);
}

// ❌ 不推荐：频繁操作 DOM
for (let i = 0; i < 1000; i++) {
  const el = document.createElement('div');
  container.appendChild(el); // 每次都触发重排
}
```

### 安全防护

```javascript
// ✅ 推荐：防止 XSS
function safeRender(input) {
  element.textContent = input; // 自动转义
}

// ❌ 不推荐：直接插入 HTML
element.innerHTML = userInput; // 危险！
```

## 相关资源

- **课件目录**：`../../文档/JS课件/`
- **页面目录**：`../views/js-examples/`
- **路由配置**：`../router/index.js`

## 注意事项

- 本项目仅供学习和培训使用
- 实际生产环境中，请根据具体情况进行适当的调整
- 定期更新依赖库，以确保安全性和性能

## 许可证

本项目采用 MIT 许可证。