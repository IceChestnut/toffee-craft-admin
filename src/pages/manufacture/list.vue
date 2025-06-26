<template>
  <view class="container">
    <view class="header">
      <text class="title">制作任务列表</text>
      <button @click="addTask" class="add-btn">+ 添加任务</button>
    </view>
    
    <view class="task-list">
      <view v-for="(task, index) in tasks" :key="index" class="task-card">
        <text class="task-name">{{ task.name }}</text>
        <text class="task-date">{{ task.date }}</text>
        <text class="task-status" :class="task.status">{{ task.status }}</text>
        <view class="task-actions">
          <button @click="viewDetail(index)" class="action-btn">详情</button>
          <button @click="deleteTask(index)" class="action-btn danger">删除</button>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { onShow } from '@dcloudio/uni-app'

interface Task {
  name: string
  date: string
  status: 'pending' | 'in-progress' | 'completed'
}

const tasks = ref<Task[]>([])

const loadTasks = () => {
  const saved = uni.getStorageSync('manufactureTasks')
  if (saved) tasks.value = JSON.parse(saved)
}

const saveTasks = () => {
  uni.setStorageSync('manufactureTasks', JSON.stringify(tasks.value))
}

const addTask = () => {
  uni.navigateTo({
    url: '/pages/manufacture/detail'
  })
}

const viewDetail = (index: number) => {
  uni.navigateTo({
    url: `/pages/manufacture/detail?index=${index}`
  })
}

const deleteTask = (index: number) => {
  uni.showModal({
    title: '确认删除',
    content: '确定要删除这个制作任务吗？',
    success: (res) => {
      if (res.confirm) {
        tasks.value.splice(index, 1)
        saveTasks()
      }
    }
  })
}

onMounted(() => {
  loadTasks()
})

onShow(() => {
  loadTasks()
})
</script>

<style lang="scss">
.container {
  padding: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.title {
  font-size: 18px;
  font-weight: bold;
}

.add-btn {
  background-color: #4CAF50;
  color: white;
  padding: 8px 16px;
  border-radius: 4px;
}

.task-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.task-card {
  background: white;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.task-name {
  font-size: 16px;
  font-weight: 500;
}

.task-date {
  font-size: 14px;
  color: #666;
  margin: 4px 0;
}

.task-status {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
  margin-bottom: 8px;

  &.pending {
    background-color: #FFEB3B;
    color: #000;
  }

  &.in-progress {
    background-color: #2196F3;
    color: white;
  }

  &.completed {
    background-color: #4CAF50;
    color: white;
  }
}

.task-actions {
  display: flex;
  gap: 8px;
}

.action-btn {
  padding: 4px 12px;
  border-radius: 4px;
  font-size: 14px;
  background-color: #f0f0f0;

  &.danger {
    background-color: #FF5252;
    color: white;
  }
}
</style>