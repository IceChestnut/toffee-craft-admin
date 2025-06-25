<template>
  <view class="purchase-list-container">
    <view class="page-header">
      <text class="page-title">采购管理</text>
      <button class="add-btn" @click="addPurchase">+ 添加采购</button>
    </view>

    <view v-if="purchaseList.length === 0" class="empty-state">
      <text class="empty-text">暂无采购数据</text>
      <text class="empty-hint">点击右上角添加按钮创建新采购</text>
    </view>

    <view class="purchase-list">
      <view class="purchase-card" v-for="(item, index) in purchaseList" :key="index">
        <view class="purchase-info">
          <text class="purchase-name">{{ item.supplier }}</text>
          <text class="material-count">{{ item.materials.length }} 种材料</text>
          <text class="purchase-date">{{ item.date }}</text>
          <text class="purchase-total">总价: ¥{{ item.total }}</text>
        </view>
        <view class="purchase-actions">
          <button class="detail-btn" @click="viewDetail(index)">详情</button>
          <button class="delete-btn" @click="deletePurchase(index)">删除</button>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { onShow } from '@dcloudio/uni-app'

interface PurchaseItem {
  supplier: string
  date: string
  materials: { name: string, quantity: number, price: number }[]
  total: number
}

const purchaseList = ref<PurchaseItem[]>([])
const PURCHASE_STORAGE_KEY = 'purchase_list'

async function loadPurchases() {
  try {
    const data = await uni.getStorage({ key: PURCHASE_STORAGE_KEY });
    if (data && data.data) {
      purchaseList.value = JSON.parse(data.data);
    }
  } catch {}
}

const savePurchases = () => {
  localStorage.setItem(PURCHASE_STORAGE_KEY, JSON.stringify(purchaseList.value))
}

const addPurchase = () => {
  uni.navigateTo({
    url: '/pages/purchase/detail'
  })
}

const viewDetail = (index: number) => {
  uni.navigateTo({
    url: `/pages/purchase/detail?index=${index}`
  })
}

const deletePurchase = (index: number) => {
  purchaseList.value.splice(index, 1)
  savePurchases()
}

onMounted(async () => {
  await loadPurchases()
})

onShow(async () => {
  await loadPurchases()
})

</script>

<style scoped>
.purchase-list-container {
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

.purchase-list {
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.purchase-card {
  background-color: white;
  border-radius: 16rpx;
  padding: 25rpx;
  box-shadow: 0 2rpx 10rpx rgba(0,0,0,0.05);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.purchase-info {
  flex: 1;
}

.purchase-name {
  font-size: 32rpx;
  color: #333;
  margin-bottom: 8rpx;
  display: block;
}

.material-count {
  font-size: 24rpx;
  color: #666;
}

.purchase-date {
  font-size: 24rpx;
  color: #666;
  display: block;
  margin-top: 5rpx;
}

.purchase-total {
  font-size: 26rpx;
  color: #ff9500;
  font-weight: bold;
  display: block;
  margin-top: 5rpx;
}

.purchase-actions {
  display: flex;
  gap: 15rpx;
}

.detail-btn {
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
  margin-bottom: 10rpx;
  display: block;
}

.empty-hint {
  font-size: 26rpx;
  display: block;
}
</style>