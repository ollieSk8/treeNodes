<template>
  <div class="container" v-if="treeNodes">
    <div class="role-tree-content">
      <TreeNode
        :nodes="treeNodes"
        :depth="0"
        :fatherIndex="0"
        :addKey="addKey"
        :removeKey="removeKey"
        :AllCheckedKeys="AllCheckedKeys"
        ref="TreeNode"
      ></TreeNode>
    </div>
  </div>
</template>
<script setup lang="ts">
  import { onMounted, PropType } from 'vue';
  import TreeNode from './TreeNode.vue';
  import type { treeNode } from '../views/type';
  const props = defineProps({
    treeNodes: {
      type: Array as PropType<treeNode[]>,
      required: true,
    },
    AllCheckedKeys: {
      type: Array as PropType<number[]>,
      required: true,
    },
  });
  const addKey = (key: number): void => {
    if (props.AllCheckedKeys.indexOf(key) === -1) {
      props.AllCheckedKeys.push(key);
    }
  };
  const removeKey = (key: number): void => {
    if (props.AllCheckedKeys.indexOf(key) > -1) {
      const Index = props.AllCheckedKeys.indexOf(key);
      props.AllCheckedKeys.splice(Index, 1);
    }
  };
  //初始化tree数据
  const initData = (nodes: treeNode[], path: treeNode[] = []) => {
    if (!nodes) return;
    for (const node of nodes) {
      path.push(node);
      node.IsExpanded = true;
      node.locked = false;
      if (props.AllCheckedKeys.indexOf(node.id) > -1) {
        path.forEach((node) => {
          node.indeterminate = true;
        });
        node.checked = true;
        node.indeterminate = false;
      }
      if (node.children) {
        initData(node.children, path);
      }
      path.pop();
    }
  };
  onMounted(() => {
    console.log(11);
    initData(props.treeNodes);
  });
</script>
<style lang="less">
  .container {
    width: 100%;
  }
</style>
