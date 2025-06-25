<template>
  <view class="purchase-detail-container">
    <view class="page-header">
      <text class="page-title">{{ editIndex !== null ? '编辑采购' : '添加采购' }}</text>
    </view>

    <view class="purchase-card">
      <view class="form-group">
        <text class="form-label">供应商</text>
        <input v-model="purchase.supplier" class="form-input" placeholder="请输入供应商名称" />
      </view>

      <view class="form-group">
        <text class="form-label">采购日期</text>
        <input v-model="purchase.date" class="form-input" placeholder="请输入采购日期" />
      </view>

      <text class="section-title">采购材料列表</text>
      <view class="materials-container">
        <view class="material-item" v-for="(material, index) in purchase.materials" :key="index">
          <input v-model="material.name" class="form-input material-input" placeholder="材料名称"/>
          <input v-model="material.quantity" type="number" class="form-input quantity-input" placeholder="数量"/>
          <input v-model="material.price" type="number" class="form-input price-input" placeholder="单价"/>
          <text class="unit-text">元</text>
          <button class="delete-btn" @click="removeMaterial(index)">删除</button>
        </view>
      </view>

      <button class="add-btn" @click="addMaterial">+ 添加材料</button>
      <view class="total-container">
        <text class="total-label">总价:</text>
        <text class="total-value">¥{{ calculateTotal() }}</text>
      </view>
    </view>

    <view class="btn-container">
      <button class="save-btn" @click="savePurchase">保存采购</button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { onLoad } from '@dcloudio/uni-app'

interface Material {
  name: string
  quantity: number
  price: number
}

interface PurchaseItem {
  supplier: string
  date: string
  materials: Material[]
  total: number
}

const purchase = ref<PurchaseItem>({
  supplier: '',
  date: '',
  materials: [],
  total: 0
})

const editIndex = ref<number | null>(null)
const PURCHASE_STORAGE_KEY = 'purchase_list'

async function loadPurchases() {
  try {
    const data = await uni.getStorage({ key: PURCHASE_STORAGE_KEY })
    return (data && data.data) ? JSON.parse(data.data) : []
  } catch {
    return [];
  }
}

const addMaterial = () => {
  purchase.value.materials.push({ name: '', quantity: 0, price: 0 })
}

const removeMaterial = (index: number) => {
  purchase.value.materials.splice(index, 1)
}

const calculateTotal = () => {
  return purchase.value.materials.reduce(
    (sum, material) => sum + (material.quantity * material.price), 0
  ).toFixed(2)
}

async function savePurchase() {
  const purchases = await loadPurchases()
  purchase.value.total = parseFloat(calculateTotal())
  
  if (editIndex.value !== null) {
    purchases[editIndex.value] = purchase.value
  } else {
    purchases.push(purchase.value)
  }
  
  uni.setStorage({ key: PURCHASE_STORAGE_KEY, data: JSON.stringify(purchases) })
  uni.navigateBack()
}

onLoad(async (options) => {
  if (options?.index) {
    editIndex.value = parseInt(options.index)
    const purchases = await loadPurchases()
    purchase.value = JSON.parse(JSON.stringify(purchases[editIndex.value]))
  }
})
</script>

<style scoped>
.purchase-detail-container {
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

.purchase-card {
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

.quantity-input, .price-input {
  flex: 1;
}

.unit-text {
  font-size: 24rpx;
  color: #666;
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

.total-container {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-top: 20rpx;
  padding-top: 15rpx;
  border-top: 1px solid #eee;
}

.total-label {
  font-size: 28rpx;
  color: #333;
  margin-right: 10rpx;
}

.total-value {
  font-size: 32rpx;
  color: #ff9500;
  font-weight: bold;
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
</style>