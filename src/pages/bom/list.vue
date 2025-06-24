<template>
  <view class="bom-list-container">
    <view class="page-header">
      <text class="page-title">配方管理</text>
      <button class="add-btn" @click="addBom">+ 添加配方</button>
    </view>

    <view v-if="bomList.length === 0" class="empty-state">
      <text class="empty-text">暂无配方数据</text>
      <text class="empty-hint">点击右上角添加按钮创建新配方</text>
    </view>

    <view class="bom-list">
      <view class="bom-card" v-for="(item, index) in bomList" :key="index">
        <view class="bom-info">
          <text class="bom-name">{{ item.name }}</text>
          <text class="material-count">{{ item.materials.length }} 种材料</text>
          <view class="materials-list">
            <text class="material-item" v-for="(material, mIndex) in item.materials" :key="mIndex">
              {{ material.name }}: {{ material.ratio }}g
            </text>
          </view>
        </view>
        <view class="bom-actions">
          <button class="edit-btn" @click="editBom(index)">编辑</button>
          <button class="delete-btn" @click="deleteBom(index)">删除</button>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

interface BomItem {
  name: string
  materials: { name: string, ratio: number }[]
}

const bomList = ref<BomItem[]>([])
const BOM_STORAGE_KEY = 'bom_list'

async function loadBoms() {
  try {
    const data = await uni.getStorage({ key: BOM_STORAGE_KEY });
    if (data && data.data) {
      bomList.value = JSON.parse(data.data);
    }
  } catch {}
}

const saveBoms = () => {
  localStorage.setItem(BOM_STORAGE_KEY, JSON.stringify(bomList.value))
}

const addBom = () => {
  uni.navigateTo({
    url: '/pages/bom/detail'
  })
}

const editBom = (index: number) => {
  uni.navigateTo({
    url: `/pages/bom/detail?index=${index}`
  })
}

const deleteBom = (index: number) => {
  bomList.value.splice(index, 1)
  saveBoms()
}

onMounted(() => {
  loadBoms()
})

// 添加页面显示时的钩子
uni.$on('onShow', () => {
  loadBoms()
})
</script>

<style scoped>
.bom-list-container {
  padding: 20rpx;
  min-height: 100vh;
  background-color: #f5f5f5;
  display: flex;
  flex-direction: column;
}

.page-header {
  position: sticky;
  top: 0;
  background-color: #f5f5f5;
  z-index: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30rpx;
  padding: 15rpx 20rpx;
  border-bottom: 1px solid #eee;
}

.page-title {
  flex: 1;
  font-size: 36rpx;
  font-weight: bold;
  color: #333;
}

.add-btn {
  background-color: #007aff;
  color: white;
  border-radius: 50rpx;
  padding: 12rpx 30rpx;
  font-size: 28rpx;
  border: none;
  margin-left: auto;
  display: block;
}

.bom-list {
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.bom-card {
  background-color: white;
  border-radius: 16rpx;
  padding: 25rpx;
  box-shadow: 0 2rpx 10rpx rgba(0,0,0,0.05);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.bom-info {
  flex: 1;
}

.bom-name {
  font-size: 32rpx;
  color: #333;
  margin-bottom: 8rpx;
  display: block;
}

.material-count {
  font-size: 24rpx;
  color: #666;
}

.materials-list {
  margin-top: 10rpx;
}

.material-item {
  font-size: 24rpx;
  color: #999;
  display: block;
  line-height: 36rpx;
}

.bom-actions {
  display: flex;
  gap: 15rpx;
}

.edit-btn {
  background-color: #4cd964;
  color: white;
  border-radius: 8rpx;
  padding: 8rpx 20rpx;
  font-size: 26rpx;
  border: none;
}

.delete-btn {
  background-color: #ff3b30;
  color: white;
  border-radius: 8rpx;
  padding: 8rpx 20rpx;
  font-size: 26rpx;
  border: none;
}

.empty-state {
  text-align: center;
  padding: 100rpx 0;
  color: #999;
}

.empty-text {
  font-size: 32rpx;
  margin-bottom: 15rpx;
  display: block;
}

.empty-hint {
  font-size: 26rpx;
}
</style>