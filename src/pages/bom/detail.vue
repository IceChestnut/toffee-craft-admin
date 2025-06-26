<template>
  <view class="bom-detail-container">
    <view class="page-header">
      <text class="page-title">{{ title }}</text>
    </view>

    <view class="bom-card">
      <view class="form-group">
        <text class="form-label">产品名称</text>
        <input v-model="bom.product" class="form-input" placeholder="请输入产品名称" />
      </view>

      <text class="section-title">材料列表</text>
      <view class="materials-container">
        <view class="material-item" v-for="(material, index) in bom?.materialUsage" :key="index">
          <input v-model="material.material.name" class="form-input material-input" placeholder="材料名称"/>
          <uni-number-box v-model="material.usage"/>
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
import { type BOM, type Material, useBOMStore } from '@/store'

const bomStore = useBOMStore()

const createBOM = ():BOM => ({
  product: '',
  materialUsage: [],
})
const originalBOM = ref<BOM>()
const bom = ref<BOM>(createBOM())
const title = ref('添加配方')
let isEdit = false
let index = -1

const addMaterial = () => {
  bom.value?.materialUsage.push({
    material: {
      name: '',
      unit: 'g',
    },
    usage: 0,
  })
}

function removeMaterial(index: number) {
  bom.value?.materialUsage.splice(index, 1)
}

async function saveBom() {
  if (!bom.value) {
    uni.showToast({
      title: '配方不能为空',
      icon: 'none',
    })
    return
  }
  bom.value.product = bom.value.product.trim()
  if (bom.value.product === '') {
    uni.showToast({
      title: '配方名称不能为空',
      icon: 'none',
    })
    return
  }
  bom.value.materialUsage.forEach(material => {
    material.material.name = material.material.name.trim()
    if (material.material.name === '') {
      uni.showToast({
        title: '材料名称不能为空',
        icon: 'none',
      })
      return
    }
  })
  if (isEdit) {
    bomStore.updateBOM(index, bom.value)
  } else {
    bomStore.addBOM(bom.value)
  }
  uni.navigateBack()
}

onLoad(async (options) => {
  if (options?.index) {
    index = parseInt(options.index)
    isEdit = true
    title.value = '编辑配方'
    originalBOM.value = bomStore.bomList[index]
    bom.value = JSON.parse(JSON.stringify(originalBOM.value))
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
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
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
