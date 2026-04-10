<template>
  <Layout>
    <div class="upload">
      <h1>文件上传</h1>
      <div class="upload-container">
        <div class="upload-area" @dragover.prevent @drop.prevent="handleDrop">
          <input type="file" ref="fileInput" @change="handleFileChange" style="display: none;" multiple />
          <div class="upload-icon">📁</div>
          <p>点击或拖拽文件到此处上传</p>
          <button class="upload-btn" @click="triggerFileInput">选择文件</button>
        </div>
        <div v-if="files.length > 0" class="file-list">
          <h3>待上传文件</h3>
          <ul>
            <li v-for="(file, index) in files" :key="index">
              {{ file.name }}
              <span class="file-size">{{ formatFileSize(file.size) }}</span>
              <button class="remove-btn" @click="removeFile(index)">×</button>
            </li>
          </ul>
          <button class="submit-btn" @click="uploadFiles">开始上传</button>
        </div>
        <div v-if="uploading" class="upload-progress">
          <div class="progress-bar">
            <div class="progress-fill" :style="{ width: progress + '%' }"></div>
          </div>
          <p>上传中... {{ progress }}%</p>
        </div>
        <div v-if="uploadSuccess" class="upload-success">
          <p>文件上传成功！</p>
        </div>
      </div>
    </div>
  </Layout>
</template>

<script>
import api from '../api/api';
import Layout from '../components/Layout.vue';

export default {
  name: 'Upload',
  components: {
    Layout
  },
  data() {
    return {
      files: [],
      uploading: false,
      progress: 0,
      uploadSuccess: false
    }
  },
  methods: {
    triggerFileInput() {
      this.$refs.fileInput.click()
    },
    handleFileChange(e) {
      const selectedFiles = Array.from(e.target.files)
      this.files = [...this.files, ...selectedFiles]
    },
    handleDrop(e) {
      const droppedFiles = Array.from(e.dataTransfer.files)
      this.files = [...this.files, ...droppedFiles]
    },
    removeFile(index) {
      this.files.splice(index, 1)
    },
    formatFileSize(size) {
      if (size < 1024) return size + ' B'
      if (size < 1024 * 1024) return (size / 1024).toFixed(2) + ' KB'
      return (size / (1024 * 1024)).toFixed(2) + ' MB'
    },
    uploadFiles() {
      if (this.files.length === 0) return
      
      this.uploading = true
      this.uploadSuccess = false
      this.progress = 0
      
      // 上传每个文件
      const uploadPromises = this.files.map(file => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('uploader', localStorage.getItem('currentUser') ? JSON.parse(localStorage.getItem('currentUser')).username : 'anonymous');
        
        return api.uploadFile(formData);
      });
      
      // 模拟上传进度
      const interval = setInterval(() => {
        this.progress += 10
        if (this.progress >= 100) {
          clearInterval(interval)
        }
      }, 300);
      
      Promise.all(uploadPromises)
        .then(results => {
          clearInterval(interval)
          this.uploading = false
          this.uploadSuccess = true
          this.files = []
          this.progress = 100
        })
        .catch(error => {
          clearInterval(interval)
          this.uploading = false
          console.error('文件上传失败:', error)
          alert('文件上传失败，请检查网络连接')
        });
    }
  }
}
</script>

<style scoped>
.upload {
  padding: 20px;
}

h1 {
  margin-bottom: 30px;
  color: #333;
}

.upload-container {
  max-width: 600px;
  margin: 0 auto;
}

.upload-area {
  border: 2px dashed #ddd;
  border-radius: 8px;
  padding: 40px;
  text-align: center;
  background-color: white;
  cursor: pointer;
  transition: all 0.3s;
}

.upload-area:hover {
  border-color: #4CAF50;
  background-color: #f9f9f9;
}

.upload-icon {
  font-size: 48px;
  margin-bottom: 15px;
}

.upload-area p {
  margin-bottom: 20px;
  color: #666;
}

.upload-btn {
  background-color: #4CAF50;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.upload-btn:hover {
  background-color: #45a049;
}

.file-list {
  margin-top: 20px;
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.file-list h3 {
  margin-bottom: 15px;
  color: #333;
}

.file-list ul {
  list-style: none;
  margin-bottom: 20px;
}

.file-list li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid #eee;
}

.file-size {
  color: #666;
  font-size: 14px;
}

.remove-btn {
  background: none;
  border: none;
  font-size: 18px;
  color: #999;
  cursor: pointer;
  padding: 0 5px;
}

.remove-btn:hover {
  color: #ff0000;
}

.submit-btn {
  background-color: #3498db;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.submit-btn:hover {
  background-color: #2980b9;
}

.upload-progress {
  margin-top: 20px;
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.progress-bar {
  width: 100%;
  height: 20px;
  background-color: #f0f0f0;
  border-radius: 10px;
  overflow: hidden;
  margin-bottom: 10px;
}

.progress-fill {
  height: 100%;
  background-color: #4CAF50;
  transition: width 0.3s;
}

.upload-success {
  margin-top: 20px;
  background-color: #d4edda;
  color: #155724;
  padding: 15px;
  border-radius: 4px;
  border: 1px solid #c3e6cb;
}
</style>