export interface children {
  id: number;
  name: string;
  locked?: boolean;
  checked?: boolean;
  indeterminate?: boolean;
  IsExpanded?: boolean;
  children: children | any;
}
export interface treeNode {
  id: number;
  name: string;
  locked?: boolean;
  checked?: boolean;
  indeterminate?: boolean;
  IsExpanded?: boolean;
  children: children | any;
}
