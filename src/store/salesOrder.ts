import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Item } from './item'
import { BOM } from './bom'

export interface SalesOrder {
  id: number
  orderDate: Date
  shipDate: Date
  isShipped: boolean
  isPreOrder: boolean
  items: [{
    item: BOM | Item,
    quantity: number,
    price: number,
  }]
}

export const useSalesOrderStore = defineStore('salesOrder', () => {
  const salesOrderList = ref([] as SalesOrder[])
  return {
    salesOrderList
  }
})