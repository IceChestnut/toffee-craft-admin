<template>
  <view class="inventory-detail-container">
    <view class="page-header">
      <text class="page-title">{{ inventoryItem.name }}</text>
    </view>

    <view class="basic-info">
      <view class="info-row">
        <text class="info-label">当前库存</text>
        <text class="info-value">{{ inventoryItem.quantity }} {{ inventoryItem.unit }}</text>
      </view>
      
      <view class="info-row">
        <text class="info-label">库存状态</text>
        <text class="info-value" :class="inventoryItem.status">
          {{ 
            inventoryItem.status === 'normal' ? '正常' : 
            inventoryItem.status === 'low' ? '低库存' : '缺货' 
          }}
        </text>
      </view>
    </view>

    <view class="section">
      <text class="section-title">关联记录</text>
      
      <view class="tabs">
        <text 
          class="tab" 
          :class="{ 'active': activeTab === 'sales' }"
          @click="activeTab = 'sales'"
        >销售记录</text>
        <text 
          class="tab" 
          :class="{ 'active': activeTab === 'manufacture' }"
          @click="activeTab = 'manufacture'"
        >生产记录</text>
        <text 
          class="tab" 
          :class="{ 'active': activeTab === 'purchase' }"
          @click="activeTab = 'purchase'"
        >采购记录</text>
        <text 
          class="tab" 
          :class="{ 'active': activeTab === 'manual' }"
          @click="activeTab = 'manual'"
        >手动记录</text>
      </view>

      <view class="record-list">
        <view 
          class="record-item" 
          v-for="(record, index) in filteredRecords" 
          :key="index"
        >
          <view class="record-header">
            <text class="record-type">{{ getRecordType(record) }}</text>
            <text class="record-quantity" :class="getQuantityClass(record)">
              {{ getQuantityPrefix(record) }}{{ record.quantity }}
            </text>
          </view>
          
          <view class="record-body">
            <text class="record-time">{{ formatTime(record.time) }}</text>
            <text class="record-note">{{ record.note || '无备注' }}</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { onLoad } from '@dcloudio/uni-app'

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

interface Record {
  type: 'in' | 'out'
  quantity: number
  time: string
  note?: string
  // 其他记录特有字段
}

const inventoryItem = ref<InventoryItem>({
  id: '',
  name: '',
  quantity: 0,
  unit: '',
  status: 'normal',
  relatedRecords: {
    sales: [],
    manufacture: [],
    purchase: [],
    manual: []
  }
})

const activeTab = ref<'sales' | 'manufacture' | 'purchase' | 'manual'>('sales')

// 根据当前tab过滤记录
const filteredRecords = computed(() => {
  return inventoryItem.value.relatedRecords?.[activeTab.value] || []
})

// 获取记录类型
const getRecordType = (record: Record) => {
  if (activeTab.value === 'sales') return '销售出库'
  if (activeTab.value === 'manufacture') return '生产领料'
  if (activeTab.value === 'purchase') return '采购入库'
  return record.type === 'in' ? '手动入库' : '手动出库'
}

// 获取数量前缀
const getQuantityPrefix = (record: Record) => {
  return record.type === 'in' ? '+' : '-'
}

// 获取数量样式类
const getQuantityClass = (record: Record) => {
  return record.type === 'in' ? 'in' : 'out'
}

// 格式化时间
const formatTime = (time: string) => {
  return new Date(time).toLocaleString()
}

// 加载库存项详情
const loadInventoryDetail = async (id: string) => {
  // TODO: 替换为实际API调用
  inventoryItem.value = {
    id,
    name: '巧克力原料',
    quantity: 100,
    unit: '千克',
    status: 'normal',
    relatedRecords: {
      sales: [
        { type: 'out', quantity: 5, time: '2023-05-10T10:00:00', note: '订单#1001' },
        { type: 'out', quantity: 8, time: '2023-05-08T14:30:00', note: '订单#0998' }
      ],
      manufacture: [
        { type: 'out', quantity: 20, time: '2023-05-05T09:00:00', note: '生产批次#20230505' }
      ],
      purchase: [
        { type: 'in', quantity: 50, time: '2023-05-01T11:00:00', note: '采购单#P230501' }
      ],
      manual: [
        { type: 'in', quantity: 10, time: '2023-05-03T16:00:00', note: '盘点调整' }
      ]
    }
  }
}

onLoad((options) => {
  if (options?.id) {
    loadInventoryDetail(options.id)
  }
})
</script>

<style lang="scss">
.inventory-detail-container {
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

.basic-info {
  background-color: white;
  border-radius: 16rpx;
  padding: 30rpx;
  margin-bottom: 30rpx;
  box-shadow: 0 2rpx 10rpx rgba(0,0,0,0.05);
}

.info-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20rpx;
  &:last-child {
    margin-bottom: 0;
  }
}

.info-label {
  font-size: 28rpx;
  color: #666;
}

.info-value {
  font-size: 28rpx;
  color: #333;
  
  &.normal {
    color: #4cd964;
  }
  
  &.low {
    color: #ffcc00;
  }
  
  &.out {
    color: #ff3b30;
  }
}

.section {
  background-color: white;
  border-radius: 16rpx;
  padding: 30rpx;
  box-shadow: 0 2rpx 10rpx rgba(0,0,0,0.05);
}

.section-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 20rpx;
  display: block;
}

.tabs {
  display: flex;
  border-bottom: 1px solid #eee;
  margin-bottom: 20rpx;
}

.tab {
  padding: 10rpx 20rpx;
  font-size: 28rpx;
  color: #666;
  margin-right: 20rpx;
  
  &.active {
    color: #007aff;
    border-bottom: 2px solid #007aff;
    margin-bottom: -1px;
  }
}

.record-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.record-item {
  padding: 20rpx 0;
  border-bottom: 1px solid #f5f5f5;
  
  &:last-child {
    border-bottom: none;
  }
}

.record-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10rpx;
}

.record-type {
  font-size: 28rpx;
  color: #333;
}

.record-quantity {
  font-size: 28rpx;
  font-weight: bold;
  
  &.in {
    color: #4cd964;
  }
  
  &.out {
    color: #ff3b30;
  }
}

.record-body {
  display: flex;
  justify-content: space-between;
}

.record-time {
  font-size: 24rpx;
  color: #999;
}

.record-note {
  font-size: 24rpx;
  color: #666;
}
</style>