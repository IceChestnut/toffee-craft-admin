<template>
  <view class="container">
    <image class="logo" src="/static/logo.png" />
    <text class="title">店铺管理系统</text>
    
    <view class="menu-grid">
      <view class="menu-item" @click="navigateTo('bom')">
        <text>配方管理</text>
      </view>
      <view class="menu-item" @click="navigateTo('purchase')">
        <text>采购管理</text>
      </view>
      <view class="menu-item" @click="navigateTo('sales')">
        <text>销售管理</text>
      </view>
      <view class="menu-item" @click="navigateTo('manufacture')">
        <text>制作管理</text>
      </view>
      <view class="menu-item" @click="navigateTo('inventory')">
        <text>库存管理</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
const navigateTo = (module: string) => {
  uni.navigateTo({
    url: `/pages/${module}/list`
  })
}
</script>

<style>
.container {
  padding: 20rpx;
}

.logo {
  height: 200rpx;
  width: 200rpx;
  margin: 40rpx auto;
  display: block;
}

.title {
  font-size: 48rpx;
  text-align: center;
  margin: 20rpx auto 40rpx;
  color: #333;
  font-weight: bold;
  width: 100%;
  display: block;
}

.menu-grid {
  display: flex;
  flex-direction: column;
  gap: 30rpx;
  padding: 0 20rpx;
}

.menu-item {
  height: 120rpx;
  background-color: #f5f5f5;
  border-radius: 16rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28rpx;
  color: #333;
  transition: all 0.3s;
  margin: 0 auto;
  width: 90%;
}

.menu-item:active {
  background-color: #e5e5e5;
  transform: scale(0.98);
}
</style>
