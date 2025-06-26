import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface Item {
  name: string
  unit: string
}

export interface Product extends Item {}
export interface Material extends Item {}

export const useItemStore = defineStore('item', () => {
  const productList = ref([] as Product[])
  const materialList = ref([] as Material[])
  return {
    productList,
    materialList
  }
})