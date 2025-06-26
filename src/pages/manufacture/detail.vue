<template>
  <view class="container">
    <view class="header">
      <text class="title">{{ isEdit ? '编辑制作任务' : '新建制作任务' }}</text>
    </view>
    
    <view class="form">
      <view class="form-item">
        <text class="label">任务名称</text>
        <input v-model="task.name" class="input" placeholder="请输入任务名称" />
      </view>
      
      <view class="form-item">
        <text class="label">日期</text>
        <picker mode="date" :value="task.date" @change="dateChange">
          <view class="picker">{{ task.date || '请选择日期' }}</view>
        </picker>
      </view>
      
      <view class="form-item">
        <text class="label">状态</text>
        <picker mode="selector" :range="statusOptions" :value="statusIndex" @change="statusChange">
          <view class="picker">{{ task.status || '请选择状态' }}</view>
        </picker>
      </view>
      
      <view class="form-item">
        <text class="label">材料清单</text>
        <view class="materials">
          <view v-for="(material, index) in task.materials" :key="index" class="material-item">
            <input v-model="material.name" class="material-input" placeholder="材料名称" />
            <input v-model="material.quantity" class="material-input" placeholder="数量" type="number" />
            <button @click="removeMaterial(index)" class="remove-btn">×</button>
          </view>
          <button @click="addMaterial" class="add-material-btn">+ 添加材料</button>
        </view>
      </view>
    </view>
    
    <view class="footer">
      <button @click="saveTask" class="save-btn">保存</button>
      <button @click="cancel" class="cancel-btn">取消</button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { onLoad } from '@dcloudio/uni-app'

interface Material {
  name: string
  quantity: string
}

interface Task {
  name: string
  date: string
  status: string
  materials: Material[]
}

const task = ref<Task>({
  name: '',
  date: '',
  status: '',
  materials: []
})

const isEdit = ref(false)
const editIndex = ref(-1)

const statusOptions = ['pending', 'in-progress', 'completed']
const statusIndex = ref(0)

const loadTasks = () => {
  const saved = uni.getStorageSync('manufactureTasks')
  return saved ? JSON.parse(saved) : []
}

const saveTasks = (tasks: Task[]) => {
  uni.setStorageSync('manufactureTasks', JSON.stringify(tasks))
}

const dateChange = (e: any) => {
  task.value.date = e.detail.value
}

const statusChange = (e: any) => {
  statusIndex.value = e.detail.value
  task.value.status = statusOptions[statusIndex.value]
}

const addMaterial = () => {
  task.value.materials.push({ name: '', quantity: '' })
}

const removeMaterial = (index: number) => {
  task.value.materials.splice(index, 1)
}

const saveTask = () => {
  if (!task.value.name) {
    uni.showToast({
      title: '请填写任务名称',
      icon: 'none'
    })
    return
  }
  
  const tasks = loadTasks()
  
  if (isEdit.value) {
    tasks[editIndex.value] = task.value
  } else {
    tasks.push(task.value)
  }
  
  saveTasks(tasks)
  
  uni.navigateBack()
}

const cancel = () => {
  uni.navigateBack()
}

onLoad((options) => {
  if (options.index) {
    const tasks = loadTasks()
    const index = parseInt(options.index)
    task.value = { ...tasks[index] }
    isEdit.value = true
    editIndex.value = index
    statusIndex.value = statusOptions.indexOf(task.value.status)
  }
})
</script>

<style lang="scss">
.container {
  padding: 20px;
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.header {
  margin-bottom: 20px;
}

.title {
  font-size: 18px;
  font-weight: bold;
}

.form {
  flex: 1;
}

.form-item {
  margin-bottom: 16px;
}

.label {
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
  color: #333;
}

.input, .picker {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.materials {
  border: 1px solid #eee;
  border-radius: 4px;
  padding: 8px;
}

.material-item {
  display: flex;
  gap: 8px;
  margin-bottom: 8px;
  align-items: center;
}

.material-input {
  flex: 1;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.remove-btn {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: #FF5252;
  color: white;
  font-size: 16px;
  line-height: 32px;
  text-align: center;
}

.add-material-btn {
  width: 100%;
  padding: 8px;
  background-color: #f0f0f0;
  border-radius: 4px;
  text-align: center;
  margin-top: 8px;
}

.footer {
  display: flex;
  gap: 12px;
  margin-top: 20px;
}

.save-btn {
  flex: 1;
  background-color: #4CAF50;
  color: white;
  padding: 12px;
  border-radius: 4px;
  text-align: center;
}

.cancel-btn {
  flex: 1;
  background-color: #f0f0f0;
  padding: 12px;
  border-radius: 4px;
  text-align: center;
}
</style>