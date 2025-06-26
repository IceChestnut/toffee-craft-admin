import { defineStore } from "pinia";
import type { Product, Material } from "./item";
import { ref } from "vue";
export interface BOM {
  product: string;
  materialUsage: { material: Material; usage: number }[];
  version?: string;
}
export const useBOMStore = defineStore(
  "bom",
  () => {
    const bomList = ref([] as BOM[]);
    const addBOM = (bom: BOM) => {
      bomList.value.push(bom);
    };
    const updateBOM = (index: number, bom: BOM) => {
      if (index !== -1) {
        bomList.value[index] = bom;
      }
    };
    const delBOM = (index: number) => {
      bomList.value.splice(index, 1);
    };
    return {
      bomList,
      addBOM,
      updateBOM,
      delBOM,
    };
  },
  {
    unistorage: true,
  }
);
