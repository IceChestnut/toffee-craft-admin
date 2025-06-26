import { defineStore } from "pinia";
import { ref } from "vue";
import type { Product, Item, Material } from "./item";
import type { BOM } from "./bom";

export interface PurchaseOrder {
  id: number;
  orderDate: Date;
  items: [
    {
      item: Material | Item;
      quantity: number;
      price: number;
    }
  ];
}

export const usePurchaseOrderStore = defineStore("purchaseOrder", () => {
  const purchaseOrderList = ref([] as PurchaseOrder[]);
  return {
    purchaseOrderList,
  };
});
