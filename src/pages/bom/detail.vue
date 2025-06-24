<template>
  <view class="bom-detail-container">
    <view class="page-header">
      <text class="page-title">{{ editIndex !== null ? '编辑配方' : '添加配方' }}</text>
    </view>

    <view class="bom-card">
      <view class="form-group">
        <text class="form-label">配方名称</text>
        <input
          v-model="bom.name"
          class="form-input"
          placeholder="请输入配方名称"
        />
      </view>

      <text class="section-title">材料列表</text>
      <view class="materials-container">
        <view class="material-item" v-for="(material, index) in bom.materials" :key="index">
          <input
            v-model="material.name"
            class="form-input material-input"
            placeholder="材料名称"
          />
          <input
            v-model="material.ratio"
            class="form-input ratio-input"
            placeholder="克数(g)"
            type="number"
          />
          <text class="unit-text">g</text>
          <button class="delete-btn" @click="removeMaterial(index)">删除</button>
        </view>
      </view>

      <button class="add-btn" @click="addMaterial">+ 添加材料</button>
    </view>

    <view class="btn-container">
      <button class="save-btn" @click="saveBom">保存配方</button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'

interface Material {
  name: string
  ratio: number
}

interface BomItem {
  name: string
  materials: Material[]
}

const bom = ref<BomItem>({
  name: '',
  materials: []
})

const editIndex = ref<number | null>(null)
const BOM_STORAGE_KEY = 'bom_list'

async function loadBoms() {
  try {
    const data = await uni.getStorage({ key: BOM_STORAGE_KEY })
    return (data && data.data) ? JSON.parse(data.data) : []
  } catch {
    return [];
  }
}

const addMaterial = () => {
  bom.value.materials.push({ name: '', ratio: 0 })
}

const removeMaterial = (index: number) => {
  bom.value.materials.splice(index, 1)
}

async function saveBom() {
  const boms = await loadBoms()
  if (editIndex.value !== null) {
    boms[editIndex.value] = bom.value
  } else {
    boms.push(bom.value)
  }
  uni.setStorage({ key: BOM_STORAGE_KEY, data: JSON.stringify(boms) })
  uni.navigateBack()
}

onLoad(async (options) => {
  if (options?.index) {
    editIndex.value = parseInt(options.index)
    const boms = await loadBoms()
    bom.value = JSON.parse(JSON.stringify(boms[editIndex.value]))
  }
})
</script>

<style scoped>
.bom-detail-container {
  padding: 20rpx;
  min-height: 100vh;
  background-color: #f5f5f5;
}

.page-header {
  margin-bottom: 30rpx;
  padding-bottom: 15rpx;
  border-bottom: 1px solid #eee;
}

.page-title {
  font-size: 36rpx;
  font-weight: bold;
  color: #333;
}

.bom-card {
  background-color: white;
  border-radius: 16rpx;
  padding: 30rpx;
  box-shadow: 0 2rpx 10rpx rgba(0,0,0,0.05);
  margin-bottom: 30rpx;
}

.form-group {
  margin-bottom: 30rpx;
}

.form-label {
  display: block;
  font-size: 28rpx;
  color: #333;
  margin-bottom: 10rpx;
}

.form-input {
  width: 100%;
  height: 70rpx;
  border: 1px solid #ddd;
  border-radius: 8rpx;
  padding: 0 20rpx;
  font-size: 28rpx;
  box-sizing: border-box;
}

.section-title {
  font-size: 28rpx;
  color: #333;
  margin: 20rpx 0 15rpx;
  display: block;
  font-weight: bold;
}

.materials-container {
  margin-bottom: 20rpx;
}

.material-item {
  display: flex;
  gap: 15rpx;
  align-items: center;
  margin-bottom: 15rpx;
}

.material-input {
  flex: 2;
}

.ratio-input {
  flex: 1;
}

.add-btn {
  background-color: #007aff;
  color: white;
  border-radius: 8rpx;
  padding: 15rpx 0;
  font-size: 28rpx;
  border: none;
  width: 100%;
  margin-top: 10rpx;
}

.btn-container {
  padding: 0 20rpx;
}

.save-btn {
  background-color: #4cd964;
  color: white;
  border-radius: 8rpx;
  padding: 18rpx 0;
  font-size: 32rpx;
  border: none;
  width: 100%;
}

.delete-btn {
  background-color: #ff3b30;
  color: white;
  border-radius: 8rpx;
  padding: 12rpx 20rpx;
  font-size: 26rpx;
  border: none;
}

.step-btn {
  width: 60rpx;
  height: 60rpx;
  border: 1px solid #ddd;
  background-color: #f5f5f5;
  border-radius: 8rpx;
  font-size: 28rpx;
  display: flex;
  justify-content: center;
  align-items: center;
}

.step-btn:active {
  background-color: #e5e5e5;
}
</style>