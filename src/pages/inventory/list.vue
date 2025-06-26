<template>
  <view class="inventory-container">
    <view class="page-header">
      <text class="page-title">库存管理</text>
      <view class="action-buttons">
        <button class="out-btn" @click="showOutDialog">出库</button>
        <button class="in-btn" @click="showInDialog">入库</button>
      </view>
    </view>

    <view v-if="inventoryList.length === 0" class="empty-state">
      <text class="empty-text">暂无库存数据</text>
    </view>

    <view class="inventory-list">
      <view 
        class="inventory-card" 
        v-for="(item, index) in inventoryList" 
        :key="index"
        @click="viewDetail(item.id)"
      >
        <view class="inventory-info">
          <text class="item-name">{{ item.name }}</text>
          <text class="item-quantity">当前库存: {{ item.quantity }} {{ item.unit }}</text>
          <text class="item-status" :class="item.status">
            状态: {{ 
              item.status === 'normal' ? '正常' : 
              item.status === 'low' ? '低库存' : '缺货' 
            }}
          </text>
        </view>
        <uni-icons type="arrowright" size="20" color="#999"></uni-icons>
      </view>
    </view>

    <!-- 出库入库对话框 -->
    <uni-popup ref="inDialog" type="dialog">
      <uni-popup-dialog 
        mode="input" 
        title="入库操作"
        placeholder="请输入数量"
        @confirm="confirmIn"
      ></uni-popup-dialog>
    </uni-popup>

    <uni-popup ref="outDialog" type="dialog">
      <uni-popup-dialog 
        mode="input" 
        title="出库操作"
        placeholder="请输入数量"
        @confirm="confirmOut"
      ></uni-popup-dialog>
    </uni-popup>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { onShow } from '@dcloudio/uni-app'

interface InventoryItem {
  id: string
  name: string
  quantity: number
  unit: string
  status: 'normal' | 'low' | 'out'
  relatedRecords?: {
    sales?: Array<any>
    manufacture?: Array<any>
    purchase?: Array<any>
    manual?: Array<any>
  }
}

const inventoryList = ref<InventoryItem[]>([])
const currentItem = ref<InventoryItem | null>(null)
const inDialog = ref<any>(null)
const outDialog = ref<any>(null)

const INVENTORY_STORAGE_KEY = 'inventory_list'

// 加载库存数据
const loadInventory = async () => {
  try {
    const data = await uni.getStorage({ key: INVENTORY_STORAGE_KEY })
    if (data && data.data) {
      inventoryList.value = JSON.parse(data.data)
    } else {
      inventoryList.value = []
    }
  } catch {
    inventoryList.value = []
  }
}

// 查看详情
const viewDetail = (id: string) => {
  uni.navigateTo({
    url: `/pages/inventory/detail?id=${id}`
  })
}

// 显示入库对话框
const showInDialog = () => {
  inDialog.value.open()
}

// 显示出库对话框
const showOutDialog = () => {
  outDialog.value.open()
}

// 确认入库
const confirmIn = (quantity: string) => {
  const num = parseInt(quantity)
  if (isNaN(num) || num <= 0) {
    uni.showToast({ title: '请输入有效数量', icon: 'none' })
    return
  }
  
  // 实际项目中这里应该更新具体商品的库存
  inventoryList.value.forEach(item => {
    item.quantity += num
  })
  
  uni.setStorage({ 
    key: INVENTORY_STORAGE_KEY, 
    data: JSON.stringify(inventoryList.value) 
  })
  uni.showToast({ title: '入库成功' })
}

// 确认出库
const confirmOut = (quantity: string) => {
  const num = parseInt(quantity)
  if (isNaN(num) || num <= 0) {
    uni.showToast({ title: '请输入有效数量', icon: 'none' })
    return
  }
  
  // 实际项目中这里应该更新具体商品的库存
  inventoryList.value.forEach(item => {
    item.quantity = Math.max(0, item.quantity - num)
  })
  
  uni.setStorage({ 
    key: INVENTORY_STORAGE_KEY, 
    data: JSON.stringify(inventoryList.value) 
  })
  uni.showToast({ title: '出库成功' })
}

onShow(() => {
  loadInventory()
})
</script>

<style lang="scss">
.inventory-container {
  padding: 20rpx;
  min-height: 100vh;
  background-color: #f5f5f5;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30rpx;
  padding: 15rpx 20rpx;
}

.page-title {
  font-size: 36rpx;
  font-weight: bold;
  color: #333;
}

.action-buttons {
  display: flex;
  gap: 15rpx;
}

.in-btn, .out-btn {
  padding: 10rpx 20rpx;
  border-radius: 8rpx;
  font-size: 28rpx;
  border: none;
}

.in-btn {
  background-color: #4cd964;
  color: white;
}

.out-btn {
  background-color: #ff3b30;
  color: white;
}

.inventory-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.inventory-card {
  background-color: white;
  border-radius: 16rpx;
  padding: 25rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2rpx 10rpx rgba(0,0,0,0.05);
}

.inventory-info {
  flex: 1;
}

.item-name {
  font-size: 32rpx;
  color: #333;
  margin-bottom: 8rpx;
  display: block;
}

.item-quantity {
  font-size: 28rpx;
  color: #666;
  display: block;
  margin-bottom: 8rpx;
}

.item-status {
  font-size: 24rpx;
  padding: 4rpx 12rpx;
  border-radius: 8rpx;
  display: inline-block;

  &.normal {
    background-color: #4cd964;
    color: white;
  }

  &.low {
    background-color: #ffcc00;
    color: black;
  }

  &.out {
    background-color: #ff3b30;
    color: white;
  }
}
</style>