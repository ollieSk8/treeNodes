<template>
  <div>
    <div v-for="(node, index) in nodes" :key="node.id" :class="[{ 'tree-node-mb30': depth === 0 }]">
      <div :class="['tree-node-check']">
        <div :style="{ paddingLeft: depth * 30 + 'px' }">
          <CaretDownOutlined
            :style="{ position: 'relative', left: '-5px' }"
            v-show="node.IsExpanded && node.children"
            @click="expandNode(!node.IsExpanded, node)"
          />
          <CaretRightOutlined
            :style="{ position: 'relative', left: '-5px' }"
            v-show="!node.IsExpanded && node.children"
            @click="expandNode(!node.IsExpanded, node)"
          />
          <Checkbox
            :checked="node.checked"
            :indeterminate="node.indeterminate"
            @change="nodeChange(node)"
            >{{ node.name }}</Checkbox
          >
        </div>
      </div>
      <div :class="['tree-node']">
        <TreeNode
          :nodes="node.children"
          :fatherIndex="index"
          :depth="depth + 1"
          :addKey="addKey"
          :AllCheckedKeys="AllCheckedKeys"
          :removeKey="removeKey"
          @selectFatherNode="selectFatherNode"
          v-if="node.children"
          v-show="node.IsExpanded"
        ></TreeNode>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
  const TreeNode = defineAsyncComponent(() => import('./TreeNode.vue'));
  export default {
    name: 'TreeNode',
    components: { TreeNode },
  };
</script>
<script setup lang="ts">
  import { defineAsyncComponent, PropType } from 'vue';
  import { Checkbox } from 'ant-design-vue';
  import { CaretDownOutlined, CaretRightOutlined } from '@ant-design/icons-vue';
  import type { treeNode } from '../views/type';

  const emit = defineEmits(['selectFatherNode']);
  const props = defineProps({
    nodes: {
      type: Array as PropType<treeNode[]>,
      required: true,
      default() {
        return [];
      },
    },
    fatherIndex: {
      type: Number,
      default() {
        return 0;
      },
    },
    depth: {
      type: Number,
      default() {
        return 0;
      },
    },
    AllCheckedKeys: {
      type: Array as PropType<number[]>,
      required: true,
      default() {
        return [];
      },
    },
    addKey: {
      type: Function,
      default() {
        return () => {};
      },
    },
    removeKey: {
      type: Function,
      default() {
        return () => {};
      },
    },
  });
  //当前节点如果被选中 它下面所有节点被选中
  const selectChildrenNode = (status, children) => {
    if (children) {
      children.forEach((node) => {
        node.checked = status;
        node.indeterminate = false;
        if (node.checked) {
          props.addKey(node.id);
        } else {
          props.removeKey(node.id);
        }
        selectChildrenNode(status, node.children || []);
      });
    }
  };
  //查看当前节点上一层父节点下方，是否所有子节点被选中，如果全选则上层父节点被动选中
  //如果只选中了其中某个节点，但未全部选中，则该节点的父节点设置半选状态后，递归向上查找
  const selectFatherNode = (status, index, isAllchecked, hasOneChecked) => {
    let indexNode = props.nodes[index];
    //勾选状态
    if (status) {
      if (isAllchecked) {
        indexNode.checked = true;
        indexNode.indeterminate = false;
        props.addKey(indexNode.id);

        emit(
          'selectFatherNode',
          status,
          props.fatherIndex,
          props.nodes.every((node: treeNode) => {
            return node.checked === status;
          }),
          props.nodes.findIndex((child: treeNode) => {
            return child.checked === true;
          })
        );
      } else {
        indexNode.indeterminate = true;
        indexNode.checked = false;
        emit(
          'selectFatherNode',
          status,
          props.fatherIndex,
          props.nodes.every((node: treeNode) => {
            return node.checked === status;
          }),
          props.nodes.findIndex((child: treeNode) => {
            return child.checked === true;
          })
        );
      }
    } else {
      //非勾选状态
      // console.log('当前子是否至少有一个被选中');
      // console.log(indexNode.name);
      // console.log(hasOneChecked !== -1);
      indexNode.checked = false;
      if (hasOneChecked !== -1) {
        indexNode.indeterminate = true;
        props.removeKey(indexNode.id);
        emit(
          'selectFatherNode',
          status,
          props.fatherIndex,
          props.nodes.every((node: treeNode) => {
            return node.checked === status;
          }),
          props.nodes.findIndex((child: treeNode) => {
            return child.checked === status;
          })
        );
      } else {
        indexNode.indeterminate = false;
        props.removeKey(indexNode.id);
        emit(
          'selectFatherNode',
          status,
          props.fatherIndex,
          props.nodes.every((node: treeNode) => {
            return node.checked === status;
          }),
          props.nodes.findIndex((child: treeNode) => {
            return child.checked === true;
          })
        );
      }
    }
  };
  //设置当前用户操作节点状态
  const nodeChange = (node: treeNode) => {
    node.checked = !node.checked;
    if (node.checked) {
      node.indeterminate = false;
    }
    if (node.checked) {
      props.addKey(node.id);
    } else {
      props.removeKey(node.id);
    }

    selectChildrenNode(node.checked, node.children);

    emit(
      'selectFatherNode',
      node.checked,
      props.fatherIndex,
      props.nodes.every((child: treeNode) => {
        return child.checked === node.checked;
      }),
      props.nodes.findIndex((child: treeNode) => {
        return child.checked === true;
      })
    );
  };
  //设置展开折叠
  const expandNode = (status, node) => {
    node.IsExpanded = status;
    if (!status) {
      expandChildrenNode(status, node.children);
    }
  };
  // 子节点收起
  const expandChildrenNode = (status, nodes) => {
    nodes.forEach((node) => {
      node.IsExpanded = status;
      expandChildrenNode(status, node.children || []);
    });
  };
</script>
<style lang="less">
  .tree-node-mb30 {
    margin-bottom: 30px;
    background-color: #fbfbfb;
  }

  .tree-node-check {
    display: block;
    padding: 10px;
    border-bottom: 1px solid #ccc;
  }

  .inline {
    display: inline-block;
  }
</style>
