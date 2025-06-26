<template>
  <view class="sales-list-container">
    <view class="page-header">
      <text class="page-title">销售管理</text>
      <button class="add-btn" @click="addSale">+ 添加销售</button>
    </view>

    <view v-if="salesList.length === 0" class="empty-state">
      <text class="empty-text">暂无销售数据</text>
      <text class="empty-hint">点击右上角添加按钮创建新销售</text>
    </view>

    <view class="sales-list">
      <view class="sales-card" v-for="(item, index) in salesList" :key="index">
        <view class="sales-info">
          <text class="sales-name">{{ item.customer }}</text>
          <text class="product-count">{{ item.products.length }} 种产品</text>
          <text class="sales-date">{{ item.date }}</text>
          <text class="sales-total">总价: ¥{{ item.total }}</text>
        </view>
        <view class="sales-actions">
          <button class="detail-btn" @click="viewDetail(index)">详情</button>
          <button class="delete-btn" @click="deleteSale(index)">删除</button>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { onShow } from '@dcloudio/uni-app'

interface SaleItem {
  customer: string
  date: string
  products: { name: string, quantity: number, price: number }[]
  total: number
}

const salesList = ref<SaleItem[]>([])
const SALES_STORAGE_KEY = 'sales_list'

async function loadSales() {
  try {
    const data = await uni.getStorage({ key: SALES_STORAGE_KEY });
    if (data && data.data) {
      salesList.value = JSON.parse(data.data);
    }
  } catch {}
}

const saveSales = () => {
  localStorage.setItem(SALES_STORAGE_KEY, JSON.stringify(salesList.value))
}

const addSale = () => {
  uni.navigateTo({
    url: '/pages/sales/detail'
  })
}

const viewDetail = (index: number) => {
  uni.navigateTo({
    url: `/pages/sales/detail?index=${index}`
  })
}

const deleteSale = (index: number) => {
  salesList.value.splice(index, 1)
  saveSales()
}

onMounted(async () => {
  await loadSales()
})

onShow(async () => {
  await loadSales()
})

</script>

<style scoped>
.sales-list-container {
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

.sales-list {
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.sales-card {
  background-color: white;
  border-radius: 16rpx;
  padding: 25rpx;
  box-shadow: 0 2rpx 10rpx rgba(0,0,0,0.05);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.sales-info {
  flex: 1;
}

.sales-name {
  font-size: 32rpx;
  color: #333;
  margin-bottom: 8rpx;
  display: block;
}

.product-count {
  font-size: 24rpx;
  color: #666;
}

.sales-date {
  font-size: 24rpx;
  color: #666;
  display: block;
  margin-top: 5rpx;
}

.sales-total {
  font-size: 26rpx;
  color: #ff9500;
  font-weight: bold;
  display: block;
  margin-top: 5rpx;
}

.sales-actions {
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