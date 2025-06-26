<template>
  <view class="sales-detail-container">
    <view class="page-header">
      <text class="page-title">{{ editIndex !== null ? '编辑销售' : '添加销售' }}</text>
    </view>

    <view class="sales-card">
      <view class="form-group">
        <text class="form-label">客户名称</text>
        <input v-model="sale.customer" class="form-input" placeholder="请输入客户名称" />
      </view>

      <view class="form-group">
        <text class="form-label">销售日期</text>
        <input v-model="sale.date" class="form-input" placeholder="请输入销售日期" />
      </view>

      <text class="section-title">销售产品列表</text>
      <view class="products-container">
        <view class="product-item" v-for="(product, index) in sale.products" :key="index">
          <input v-model="product.name" class="form-input product-input" placeholder="产品名称"/>
          <input v-model="product.quantity" type="number" class="form-input quantity-input" placeholder="数量"/>
          <input v-model="product.price" type="number" class="form-input price-input" placeholder="单价"/>
          <text class="unit-text">元</text>
          <button class="delete-btn" @click="removeProduct(index)">删除</button>
        </view>
      </view>

      <button class="add-btn" @click="addProduct">+ 添加产品</button>
      <view class="total-container">
        <text class="total-label">总价:</text>
        <text class="total-value">¥{{ calculateTotal() }}</text>
      </view>
    </view>

    <view class="btn-container">
      <button class="save-btn" @click="saveSale">保存销售</button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { onLoad } from '@dcloudio/uni-app'

interface Product {
  name: string
  quantity: number
  price: number
}

interface SaleItem {
  customer: string
  date: string
  products: Product[]
  total: number
}

const sale = ref<SaleItem>({
  customer: '',
  date: '',
  products: [],
  total: 0
})

const editIndex = ref<number | null>(null)
const SALES_STORAGE_KEY = 'sales_list'

async function loadSales() {
  try {
    const data = await uni.getStorage({ key: SALES_STORAGE_KEY })
    return (data && data.data) ? JSON.parse(data.data) : []
  } catch {
    return [];
  }
}

const addProduct = () => {
  sale.value.products.push({ name: '', quantity: 0, price: 0 })
}

const removeProduct = (index: number) => {
  sale.value.products.splice(index, 1)
}

const calculateTotal = () => {
  return sale.value.products.reduce(
    (sum, product) => sum + (product.quantity * product.price), 0
  ).toFixed(2)
}

async function saveSale() {
  const sales = await loadSales()
  sale.value.total = parseFloat(calculateTotal())
  
  if (editIndex.value !== null) {
    sales[editIndex.value] = sale.value
  } else {
    sales.push(sale.value)
  }
  
  uni.setStorage({ key: SALES_STORAGE_KEY, data: JSON.stringify(sales) })
  uni.navigateBack()
}

onLoad(async (options) => {
  if (options?.index) {
    editIndex.value = parseInt(options.index)
    const sales = await loadSales()
    sale.value = JSON.parse(JSON.stringify(sales[editIndex.value]))
  }
})
</script>

<style scoped>
.sales-detail-container {
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

.sales-card {
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

.products-container {
  margin-bottom: 20rpx;
}

.product-item {
  display: flex;
  gap: 15rpx;
  align-items: center;
  margin-bottom: 15rpx;
}

.product-input {
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