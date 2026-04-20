// 案例页面共用方法和数据混入

export const exampleMixin = {
  data() {
    return {
      result: null,
      activeTab: 'error',
      consoleLogs: []
    }
  },

  methods: {
    // 返回主页面
    goBack() {
      this.$router.push('/')
    },

    // 返回案例首页
    goBackToExamples() {
      this.$router.push('/examples')
    },

    // 返回 JavaScript 案例首页
    goBackToJSExamples() {
      this.$router.push('/js-examples')
    },

    // 添加控制台日志
    log(message, type = 'info') {
      const timestamp = new Date().toLocaleTimeString()
      // 确保type是字符串类型
      const typeStr = typeof type === 'string' ? type : 'info'
      const logEntry = `[${timestamp}] ${typeStr.toUpperCase()}: ${message}`
      this.consoleLogs.push(logEntry)
      // 限制日志数量
      if (this.consoleLogs.length > 50) {
        this.consoleLogs.shift()
      }
    },

    // 清空控制台
    clearConsole() {
      this.consoleLogs = []
    },

    // 设置成功结果
    setSuccessResult(message, detail = null, extraData = {}) {
      this.result = {
        status: 'success',
        message,
        detail,
        ...extraData
      }
    },

    // 设置错误结果
    setErrorResult(message, detail = null, extraData = {}) {
      this.result = {
        status: 'error',
        message,
        detail,
        ...extraData
      }
    },

    // 清空结果
    clearResult() {
      this.result = null
    },

    // 切换标签页
    switchTab(tabName) {
      this.activeTab = tabName
    },

    // 模拟异步延迟
    async delay(ms) {
      return new Promise(resolve => setTimeout(resolve, ms))
    },

    // 格式化时间
    formatTime(date) {
      return new Date(date).toLocaleString('zh-CN')
    },

    // 格式化数字
    formatNumber(num, decimals = 2) {
      return Number(num).toFixed(decimals)
    },

    // 生成唯一ID
    generateId() {
      return Date.now().toString(36) + Math.random().toString(36).substr(2)
    },
    
    // 代码语法高亮
    highlightCode(code, language = 'javascript') {
      if (!code) return '';
      
      // 替换特殊字符
      code = code.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
      
      if (language === 'java') {
        // Java 代码高亮
        // 高亮注释
        code = code.replace(/(\/\/.*$|\/\*[\s\S]*?\*\/)/gm, '<span class="code-comment">$1</span>');
        
        // 高亮字符串
        code = code.replace(/(["'])(.*?)\1/g, '<span class="code-string">$&</span>');
        
        // 高亮注解
        code = code.replace(/(@\w+)/g, '<span class="code-annotation">$1</span>');
        
        // 高亮关键字
        const javaKeywords = ['public', 'private', 'protected', 'class', 'void', 'int', 'long', 'String', 'try', 'catch', 'finally', 'return', 'if', 'else', 'new', 'null', 'throws', 'extends', 'super', 'synchronized', 'boolean'];
        const keywordRegex = new RegExp('\\b(' + javaKeywords.join('|') + ')\\b', 'g');
        code = code.replace(keywordRegex, '<span class="code-keyword">$1</span>');
        
        // 高亮类型
        const javaTypes = ['List', 'ArrayList', 'Map', 'WeakHashMap', 'WeakReference', 'byte', 'EventListener', 'EventBus', 'User', 'Connection', 'PreparedStatement', 'ResultSet', 'SQLException', 'BigDecimal', 'Long', 'Exception', 'IllegalArgumentException', 'RuntimeException', 'AtomicInteger', 'Object', 'Thread', 'InterruptedException', 'ReentrantLock', 'TimeUnit'];
        const typeRegex = new RegExp('\\b(' + javaTypes.join('|') + ')\\b', 'g');
        code = code.replace(typeRegex, '<span class="code-type">$1</span>');
        
        // 高亮数字
        code = code.replace(/\b\d+\b/g, '<span class="code-number">$&</span>');
      } else {
        // JavaScript 代码高亮
        // 高亮注释
        code = code.replace(/(\/\/.*$|\/\*[\s\S]*?\*\/)/gm, '<span class="code-comment">$1</span>');
        
        // 高亮字符串
        code = code.replace(/(["'])(.*?)\1/g, '<span class="code-string">$&</span>');
        
        // 高亮关键字
        const jsKeywords = ['function', 'const', 'let', 'var', 'if', 'else', 'return', 'async', 'await', 'try', 'catch', 'finally', 'new', 'Promise', 'setTimeout', 'console', 'log', 'error', 'document', 'createElement', 'getElementById', 'appendChild', 'textContent', 'addEventListener', 'querySelectorAll', 'forEach', 'createDocumentFragment', 'className', 'cssText', 'classList', 'contains', 'target', 'apply', 'arguments', 'clearTimeout', 'removeEventListener', 'remove', 'setInterval', 'clearInterval', 'window', 'null', 'undefined', 'innerHTML'];
        const keywordRegex = new RegExp('\\b(' + jsKeywords.join('|') + ')\\b', 'g');
        code = code.replace(keywordRegex, '<span class="code-keyword">$1</span>');
        
        // 高亮数字
        code = code.replace(/\b\d+\b/g, '<span class="code-number">$&</span>');
        
        // 高亮函数名
        code = code.replace(/function\s+(\w+)/g, 'function <span class="code-function">$1</span>');
        
        // 高亮方法调用
        code = code.replace(/(\w+)\(/g, '<span class="code-method">$1</span>(');
      }
      
      return code;
    }
  }
}

// 案例页面共用样式配置
export const exampleStyles = {
  // 按钮类型配置
  buttonTypes: {
    danger: { class: 'btn btn-danger', label: '错误示例' },
    success: { class: 'btn btn-success', label: '正确示例' },
    secondary: { class: 'btn btn-secondary', label: '辅助操作' },
    default: { class: 'btn btn-default', label: '默认操作' },
    primary: { class: 'btn btn-primary', label: '主要操作' }
  },

  // 结果状态配置
  resultStatus: {
    success: { class: 'success', icon: '✓', label: '成功' },
    error: { class: 'error', icon: '✗', label: '失败' },
    warning: { class: 'warning', icon: '⚠', label: '警告' },
    info: { class: 'info', icon: 'ℹ', label: '信息' }
  },

  // 标签页配置
  tabs: {
    error: { label: '错误代码', icon: '✗' },
    fixed: { label: '正确代码', icon: '✓' },
    analysis: { label: '分析', icon: '🔍' },
    solution: { label: '解决方案', icon: '💡' }
  }
}

// 常用验证函数
export const validators = {
  // 验证必填
  required(value, fieldName = '字段') {
    if (value === null || value === undefined || value === '') {
      return `${fieldName}不能为空`
    }
    return null
  },

  // 验证数字
  isNumber(value, fieldName = '字段') {
    if (isNaN(Number(value))) {
      return `${fieldName}必须是数字`
    }
    return null
  },

  // 验证正数
  isPositive(value, fieldName = '字段') {
    if (Number(value) <= 0) {
      return `${fieldName}必须大于0`
    }
    return null
  },

  // 验证整数
  isInteger(value, fieldName = '字段') {
    if (!Number.isInteger(Number(value))) {
      return `${fieldName}必须是整数`
    }
    return null
  },

  // 验证范围
  inRange(value, min, max, fieldName = '字段') {
    const num = Number(value)
    if (num < min || num > max) {
      return `${fieldName}必须在 ${min} 和 ${max} 之间`
    }
    return null
  }
}

// 性能监控工具
export const performanceMonitor = {
  marks: {},

  // 开始计时
  start(label) {
    this.marks[label] = performance.now()
  },

  // 结束计时
  end(label) {
    if (this.marks[label]) {
      const duration = performance.now() - this.marks[label]
      delete this.marks[label]
      return duration
    }
    return 0
  },

  // 测量函数执行时间
  async measure(fn, label) {
    this.start(label)
    try {
      const result = await fn()
      const duration = this.end(label)
      return { result, duration }
    } catch (error) {
      this.end(label)
      throw error
    }
  }
}

// 内存监控工具
export const memoryMonitor = {
  // 获取内存信息
  getMemoryInfo() {
    if (performance && performance.memory) {
      return {
        used: performance.memory.usedJSHeapSize,
        total: performance.memory.totalJSHeapSize,
        limit: performance.memory.jsHeapSizeLimit
      }
    }
    return null
  },

  // 格式化内存大小
  formatBytes(bytes) {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }
}

export default {
  exampleMixin,
  exampleStyles,
  validators,
  performanceMonitor,
  memoryMonitor
}