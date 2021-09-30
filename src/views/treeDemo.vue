<template>
  <div>
    <TreeList :treeNodes="formState.treeNodes" :AllCheckedKeys="formState.AllCheckedKeys" />
  </div>
</template>
<script setup lang="ts">
  import { onMounted, reactive } from 'vue';
  import TreeList from '../components/TreeList.vue';
  import type { treeNode } from './type';
  import { treeNodes } from '../data/treeNodeData';
  interface Iprops {
    treeNodes: treeNode[] | [];
    AllCheckedKeys: number[] | [];
  }
  const formState = reactive<Iprops>({
    treeNodes: [],
    AllCheckedKeys: [9, 17, 18],
  });
  formState.treeNodes = treeNodes;
</script>
<style lang="less" scoped></style>
